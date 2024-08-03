# Perimeter Polygon Mapping Application

This API is designed to manage and manipulate polygons on a map, providing functionalities for creating, updating, retrieving, and deleting polygon data. It leverages AWS DynamoDB for data storage and Apollo Server for handling GraphQL queries and mutations.

## Table of Contents

- [Perimeter Polygon Mapping Application](#perimeter-polygon-mapping-application)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Running the Server](#running-the-server)
    - [Deployment](#deployment)
    - [GraphQL API](#graphql-api)
      - [Example Requests](#example-requests)
  - [Project Structure](#project-structure)
  - [AWS DynamoDB Single Table Design](#aws-dynamodb-single-table-design)
    - [Primary Key (PK)](#primary-key-pk)
    - [Sort Key (SK)](#sort-key-sk)
    - [Data Model](#data-model)
      - [Session Items](#session-items)
      - [Polygon Items](#polygon-items)
      - [Example Queries](#example-queries)
  - [Next Ideas](#next-ideas)

## Features

- **Create or Update Polygon**: Allows the creation or updating of polygon with specified coordinates and name.
- **Retrieve Map Session**: Fetches session data, including all polygons associated with a given session.
- **Delete Polygons**: Provides the ability to delete specific polygons based on session and polygon IDs.
- **Validation**: Ensures polygons are valid by checking that they form closed shapes and contain valid coordinate data.

**Assumption:**: _"Should return list of all created polygons to be viewed on Frontend"_ - because the next line says a sharable link based off of your session, I took this to mean it would be all polygons related to that particular session (not just all polygons anyone has created).

## Installation

1. Clone the repository:

```bash
   git clone https://github.com/nh83012001/perimeter-service
   cd perimeter-service
```

2. Install dependencies:

```bash
    npm install
```

3. Set up AWS credentials and configure DynamoDB:

- Ensure you have AWS credentials configured.
- Create a DynamoDB table and set the environment variable SINGLE_TABLE_NAME with the table name at the top of the serverless.yml file

## Usage

### Running the Server

Start the Apollo Server:

```bash
npm start
```

### Deployment

Deploy to AWS:

```bash
npm run deploy:dev
```

**Deployment URL:**

https://qsb51itvz4.execute-api.us-east-1.amazonaws.com/dev

### GraphQL API

The GraphQL API provides the following operations:

**Queries**

`getMapSession(input: GetMapSessionInput!): MapSession`

**Mutations**
`createOrUpdatePolygon(input: CreateOrUpdatePolygonInput!): String`
`deletePolygon(input: DeletePolygonInput!): String`

#### Example Requests

**Fetching a Map Session**

```
query {
  getMapSession(input: { sessionId: "session123" }) {
    sessionId
    polygons {
      polygonId
      name
      coordinates
    }
  }
}
```

**Creating or Updating a Polygon**

```
mutation {
  createOrUpdatePolygon(input: {
    sessionId: "session123",
    polygonId: "polygon456",
    name: "My Polygon",
    coordinates: [[-123.07, 47.82], [-121.12, 48.81], [-121.41, 46.47], [-123.07, 47.82]]
  })
}
```

**Deleting a Polygon**

```
mutation {
  deletePolygon(input: {
    sessionId: "session123",
    polygonId: "polygon456"
  })
}
```

## Project Structure

- **index.js**: Entry point for the application, setting up the Apollo Server and defining the schema and context.
- **graphql/schemas/perimeter/typedef.js**: Contains the GraphQL type definitions for queries, mutations, and custom types.
- **graphql/schemas/perimeter/resolvers.js**: Defines the resolver functions for handling GraphQL operations.
- **graphql/schemas/perimeter/model.js**: Implements the Perimeter class with methods to interact with DynamoDB.
- **connectors/dynamo-connector.js**: Provides the DynamoDB connector for querying and manipulating data.
- **tests/unit.test.js**: Contains unit tests for validating polygon data.

## AWS DynamoDB Single Table Design

This application uses AWS DynamoDB with a single table design to store and manage polygon data. A single table design helps to optimize for scalability and performance by consolidating multiple entity types into one table. Here's an overview of the data model:

### Primary Key (PK)

The primary key (PK) uniquely identifies each item in the DynamoDB table. In this application, the PK is structured as follows:

- **Session Items**: `SESSION#<sessionId>`

### Sort Key (SK)

The sort key (SK) is used in conjunction with the primary key to enable more complex queries and to distinguish between different types of items within the same partition. In this application, the SK is structured as follows:

- **Polygon Items**: `POLYGON#<polygonId>`

### Data Model

The table consists of two main entity types: sessions and polygons.

#### Polygon Items

Polygon items store information about individual polygons associated with a session. The PK for a polygon item is `SESSION#<sessionId>` and the SK is `POLYGON#<polygonId>`. Here is an example:

| PK          | SK          | polygonId | name       | coordinates             |
| ----------- | ----------- | --------- | ---------- | ----------------------- |
| SESSION#123 | POLYGON#456 | 456       | My Polygon | [[-123.07, 47.82], ...] |

#### Session Settings

This would be how you would expand with settings from the session. The PK for a session item is `SESSION#<sessionId>` and the SK is `SETTINGS`. Here is an example:

| PK          | SK       | zoom | center   |
| ----------- | -------- | ---- | -------- |
| SESSION#123 | SETTINGS | 6    | [12, 18] |

### Example Queries

- **Retrieve all polygons for a session**: Query with `PK = SESSION#<sessionId>` and SK begins with `POLYGON#`.
- **Get session metadata**: Query with `PK = SESSION#<sessionId>` and `SK = METADATA#<sessionId>`.

This design allows efficient querying and retrieval of session and polygon data, ensuring the application remains performant and scalable as the number of sessions and polygons grows.

## Next Ideas

- **User Authentication**: Implement user authentication and authorization for accessing and managing map sessions. There would be additional entries where PK would be the cognitoID (userID) and the sk would be sessionId.
- **API Security**: Authorizer for API that is cognito user pool. It would look like the following in the serverless file

```yaml
events:
  - http:
      path: graphql
      method: post
      cors: true
      authorizer:
        arn: ${self:provider.environment.USER_POOL}
```
