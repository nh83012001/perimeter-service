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

  async createOrUpdatePolygon(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `POLYGON#${input.polygonId}`,
      polygonId: input.polygonId,
      name: input.name,
      coordinates: input.coordinates,
    };
    try {
      await this.dynamoConnector.saveAsUpdate(['pk', 'sk'], transformedInput);
      return 'successful create or update of a polygon';
    } catch (error) {
      return 'error creating or updating polygon';
    }
  }

  async deletePolygon(input) {
    const transformedInput = {
      pk: `SESSION#${input.sessionId}`,
      sk: `POLYGON#${input.polygonId}`,
    };
    try {
      await this.dynamoConnector.deleteRecord(transformedInput);
      return 'successful delete';
    } catch (error) {
      return 'error deleting polygon';
    }
  }
}

export default Perimeter;
