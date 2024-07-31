const resolvers = {
  Query: {
    async getMapSession(_, { input }, ctx) {
      const result = await ctx.models.Perimeter.getMapSession(input);
      return result;
    },
  },
  Mutation: {
    createSession(_, { input }, ctx) {
      return ctx.models.Perimeter.createSession(input);
    },
    editSession(_, { input }, ctx) {
      return ctx.models.Perimeter.editSession(input);
    },
    createPolygon(_, { input }, ctx) {
      return ctx.models.Perimeter.createPolygon(input);
    },
    editPolygon(_, { input }, ctx) {
      return ctx.models.Perimeter.editPolygon(input);
    },
    deletePolygon(_, { input }, ctx) {
      return ctx.models.Perimeter.deletePolygon(input);
    },
  },
};

export default resolvers;
