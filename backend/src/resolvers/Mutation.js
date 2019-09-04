const Mutations = {
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   // create a dog
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   return newDog;
  // }
  // removeDog(parent, args, ctx, info) {
  //   if (global.dogs) {
  //     let removedDogs = [];
  //     global.dogs.forEach((dog, index) => {
  //       if (dog.name === args.name) {
  //         removedDogs.push(global.dogs.splice(index, 1));
  //       }
  //     });
  //     return removedDogs;
  //   }
  // }
  createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
  }
};

module.exports = Mutations;
