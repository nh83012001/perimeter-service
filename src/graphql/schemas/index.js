import merge from 'lodash/merge';
import { typedef as Steve, resolvers as perimeterResolvers } from './perimeter';

const query = `
  type Query {
    _empty: String
  }
`;

const mutation = `
  type Mutation {
    _empty: String
  }
`;

const schemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default {
  typeDefs: [schemaDefinition, query, mutation, Steve],
  resolvers: merge({}, perimeterResolvers),
};
