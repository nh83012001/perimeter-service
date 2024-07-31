import { ApolloServer, gql } from 'apollo-server-lambda';
import DynamoConnector from '../connectors/dynamo-connector';
import { Perimeter } from './schemas/perimeter';

import schema from './schemas';

const contextFn = async ({ event, context }) => {
  const dynamoConnector = new DynamoConnector({
    tableName: process.env.SINGLE_TABLE_NAME,
  });

  return {
    headers: event.headers,
    event,
    context,
    models: {
      Perimeter: new Perimeter(dynamoConnector),
    },
  };
};

const handler = new ApolloServer({
  ...schema,
  uploads: false,
  typeDefs: schema.typeDefs.map(
    (each) => gql`
      ${each}
    `
  ),
  context: contextFn,
  formatError: /* istanbul ignore next */ (error) => {
    console.log(error);
    return error;
  },
}).createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});

export const handle = (event, context, cb) => handler(event, context, cb);

export default handle;
