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

  input EditPolygonInput {
    sessionId: String!
    polyonId: String!
    name: String
    coordinates: [[Float]]
  }
  
  input CreatePolygonInput {
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
    createPolygon(input: CreatePolygonInput!): String
    editPolygon(input: EditPolygonInput!): String
    deletePolygon(input: DeletePolygonInput!): String
  }
`;

export default typedef;
