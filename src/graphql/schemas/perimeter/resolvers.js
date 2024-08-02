const resolvers = {
  Query: {
    async getMapSession(_, { input }, ctx) {
      const result = await ctx.models.Perimeter.getMapSession(input);
      return result;
    },
  },
  Mutation: {
    createOrUpdatePolygon(_, { input }, ctx) {
      return ctx.models.Perimeter.createOrUpdatePolygon(input);
    },

    deletePolygon(_, { input }, ctx) {
      return ctx.models.Perimeter.deletePolygon(input);
    },
  },
};

export default resolvers;
