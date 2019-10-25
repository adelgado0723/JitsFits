const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");

const MILLISECS_PER_SEC = 1000;
const SECS_PER_MIN = 60;
const MINS_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365;
const ONE_YEAR_IN_MILLISECS =
  MILLISECS_PER_SEC *
  SECS_PER_MIN *
  MINS_PER_HOUR *
  HOURS_PER_DAY *
  DAYS_PER_YEAR;
const ONE_HOUR_IN_MILLISECS = MILLISECS_PER_SEC * SECS_PER_MIN * MINS_PER_HOUR;

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }

    // createItem returns a promise
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how you create a relationship between and item and the user
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
    return item;
  },

  updateItem(parent, args, ctx, info) {
    // First, take a copy of the updates
    const updates = { ...args };

    // Remove ID from the updates since ids
    // are not to be updated.
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{id, title}`);

    // 2. Check if the request is coming from someone
    // that has permission to delete it
    //TODO

    // 3. Delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // Make their email lowercase
    args.email = args.email.toLowerCase();

    // Hash their password
    const password = await bcrypt.hash(args.password, 10);

    // Create user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    // Signing in the user with the credentials they just created

    // Create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set JWT as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_YEAR_IN_MILLISECS // Set to las for 1 year
    });

    // Return user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. Check if there is a user with that email
    const lowercaseEmail = email.toLowerCase();
    const user = await ctx.db.query.user({ where: { email: lowercaseEmail } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }

    // 3. Generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_YEAR_IN_MILLISECS
    });

    // 5. Return the user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }

    // 2. Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + ONE_HOUR_IN_MILLISECS;
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });

    // console.log(res);

    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: "adelgado0723@gmail.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(
        `Your Password Reset Token Is Here! 
        \n\n 
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
        Click Here to Reset</a>`
      )
    });

    // 4. Return the message
    return { message: "Thanks!" };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. Check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords don't match!");
    }

    // 2. Check if it is a legit reset token
    // 3. Check if it is expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - ONE_HOUR_IN_MILLISECS
      }
    });

    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }

    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);

    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { resetToken: null, resetTokenExpiry: null, password }
    });

    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // 7. Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_YEAR_IN_MILLISECS // Set to las for 1 year
    });

    // 8. Return the new user
    return updatedUser;
  }
};

module.exports = Mutations;
