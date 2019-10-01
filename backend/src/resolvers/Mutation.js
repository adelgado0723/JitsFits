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
  }
};

module.exports = Mutations;
