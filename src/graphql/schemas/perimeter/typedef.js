const typedef = `

  type MapSession {
    sessionId: String!
    polygons: [Polygon]
  }

  type Polygon {
    polygonId: String!
    type: String!
    properties: Properties!
    geometry: Geometry!
  }

  type Properties {
    name: String!
  }

  type Geometry {
    coordinates: [[[Float]]]!
    type: String!
  }

  input EditPolygonInput {
    id: String!
    name: String
    coordinates: [[[Float]]]
  }
  
  input CreatePolygonInput {
    sessionId: String!
    polygonId: String! 
    name: String
    coordinates: [[[Float]]]
  }

  input CreateSessionInput {
    sessionId: String!
    zoom: Float
    center: [Float]  
  }

  input EditSessionInput {
    sessionId: String!
    zoom: Float
    center: [Float]
  }

  input DeletePolygonInput {
    sessionId: String!
    polygonId: String!
  }


  extend type Query {
    getMapSession(input: String!): MapSession
  }

  extend type Mutation {
    createPolygon(input: CreatePolygonInput!): String
    editPolygon(input: EditPolygonInput!): String
    deletePolygon(input: DeletePolygonInput!): String
  }
`;

export default typedef;
