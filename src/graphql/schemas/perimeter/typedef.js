const typedef = `

  type MapSession {
    sessionId: String!
    polygons: [Polygon]
  }

  type Polygon {
    polygonId: String!
    name: String
    coordinates: [[Float]]
  }
  
  input CreateOrUpdatePolygonInput {
    sessionId: String!
    polygonId: String! 
    name: String
    coordinates: [[Float]]
  }

  input DeletePolygonInput {
    sessionId: String!
    polygonId: String!
  }

  input GetMapSessionInput {
    sessionId: String!
  }


  extend type Query {
    getMapSession(input: GetMapSessionInput!): MapSession
  }

  extend type Mutation {
    createOrUpdatePolygon(input: CreateOrUpdatePolygonInput!): String
    deletePolygon(input: DeletePolygonInput!): String
  }
`;

export default typedef;
