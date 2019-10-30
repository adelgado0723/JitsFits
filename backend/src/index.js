const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

server.express.use(cookieParser());

// TODO: Use express middleware to populate current user

// 1. Decode JWT to get user id for each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // Put the userId on the request for future requests to access
    req.userId = userId;
  }

  next();
});

// 2. Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // if they aren't logged in, then skip this
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    "{id, permissions, email, name}"
  );
  req.user = user;
  next();
});

// Code to change permisions

// server.express.use(async (req, res, next) => {
//   const updatedUser = await db.mutation.updateUser({
//     data: { permissions: { set: ["USER", "ADMIN"] } },
//     where: { email: req.user.email }
//   });
//   console.log(updatedUser);
//   next();
// });

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port
    http://localhost:${deets.port}`);
  }
);
