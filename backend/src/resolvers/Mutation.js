const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    // createItem returns a promise
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // First, take a copu of the updates
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
  }
};

module.exports = Mutations;
