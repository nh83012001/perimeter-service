class Perimeter {
  constructor(dynamoConnector) {
    this.dynamoConnector = dynamoConnector;
  }

  async getMapSession(sessionId) {
    await this.dynamoConnector.query({
      partitionKeyName: 'pk',
      partitionKeyValue: `SESSION#${sessionId}`,
    });

    const polygons = response.Items.filter((item) =>
      item.sk.startsWith('POLYGON')
    );

    const settings = response.Items.find((item) => item.sk === 'SETTINGS');

    const transformedResponse = {
      sessionId,
      polygons,
      zoom: settings?.zoom,
      center: settings?.center,
    };
    return transformedResponse;
  }

  async createSessionSettings(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `SETTINGS`,
      zoom: input.zoom,
      center: input.center,
    };

    this.dynamoConnector.saveAsUpdate(['pk', 'sk'], transformedInput);
    return 'success';
  }

  async editSessionSettings(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `SETTINGS`,
      zoom: input.zoom,
      center: input.center,
    };

    this.dynamoConnector.saveAsUpdate(['pk', 'sk'], transformedInput);
    return 'success';
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
