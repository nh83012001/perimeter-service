class Perimeter {
  constructor(dynamoConnector) {
    this.dynamoConnector = dynamoConnector;
  }

  async getMapSession(input) {
    const { sessionId } = input;
    const response = await this.dynamoConnector.query({
      partitionKeyName: 'pk',
      partitionKeyValue: `SESSION#${sessionId}`,
    });
    const polygons = response.Items.filter((item) =>
      item.sk.startsWith('POLYGON')
    );

    const transformedResponse = {
      sessionId,
      polygons,
    };
    return transformedResponse;
  }

  // TODO should I put the all the coordinates into a data column?
  async createPolygon(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `POLYGON#${input.polygonId}`,
      name: input.name,
      coordinates: input.coordinates,
    };
    this.dynamoConnector.saveAsUpdate(['pk', 'sk'], transformedInput);
    return 'success';
  }

  async editPolygon(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `POLYGON#${input.polygonId}`,
      name: input.name,
      coordinates: input.coordinates,
    };
    this.dynamoConnector.saveAsUpdate(['pk', 'sk'], transformedInput);
    return 'success';
  }

  async deletePolygon(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `POLYGON#${input.polygonId}`,
    };
    this.dynamoConnector.deleteRecord(['pk', 'sk'], transformedInput);
    return 'success';
  }
}

export default Perimeter;
