import { DynamoDB } from 'aws-sdk';
import omit from 'lodash/omit';
import merge from 'lodash/merge';

const defaultOptions = {
  httpOptions: { timeout: 1500 },
  convertEmptyValues: true,
};

export default class DynamoConnector {
  /**
   * Constructs connector with given param
   *
   * @param config Configuration object. Table name is mandatory.
   * @param {!string} config.tableName The table name that connector will use in calls.
   * @param {DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration} [config.options]
   *        Any other option.
   */
  constructor(config) {
    if (config == null) {
      throw Error('Configuration not given.');
    }

    if (typeof config.tableName !== 'string' || config.tableName.length < 1) {
      throw Error('Invalid table name or table name not given.');
    }

    this.tableName = config.tableName;
    this.docClient = new DynamoDB.DocumentClient(
      merge({ ...defaultOptions }, config.options)
    );
  }

  /**
   * Executes arbitrary query and returns records
   *
   * @param params Configuration of query.
   * @param {!string} params.partitionKeyName Name of the partition key.
   * @param {!string} params.partitionKeyValue Value of the partition key.
   * @param {string} [params.sortKeyName] Name of the sort key.
   * @param {string|string[]} [params.sortKeyValue] Value of the sort key. Can be array if used with a condition.
   * @param {string} [params.indexName] Name of the index if query has to be performed on a index.
   * @param {string} [params.condition] Condition operator to with sort key values.
   * @param {string} [params.limit] Number as string representing the maximum number of items that should be returned.
   * @param {object} [params.nextToken] Next value to continue previous query.
   * @param {Object} [params.options] Any other DocumentClient param will be forwarded to the document client
   *                                  underneath.
   * @returns {Promise<Object>} QueryResult Query result.
   * @returns {Object[]} [QueryResult.Items] Array of resulting objects.
   * @returns {string} [QueryResult.LastEvaluatedKey] Query marker where evaluation stopped.
   *                                                    Should be used as nextToken to get the rest of result.
   *
   */
  query(params) {
    if (params == null) {
      throw Error('Parameters not given.');
    }

    if (
      typeof params.partitionKeyName !== 'string' ||
      params.partitionKeyName.length < 1
    ) {
      throw Error('Invalid partition key name or name not given.');
    }

    if (
      typeof params.partitionKeyValue !== 'string' ||
      params.partitionKeyValue.length < 1
    ) {
      throw Error('Invalid partition key value or value not given.');
    }

    const queryParams = {
      TableName: this.tableName,
    };

    if (params.indexName != null) {
      queryParams.IndexName = params.indexName;
    }
    if (params.limit != null) {
      queryParams.Limit = params.limit;
    }
    if (params.nextToken != null) {
      queryParams.ExclusiveStartKey = params.nextToken;
    }

    // Add rest of the custom options if given.
    merge(queryParams, params.options);

    if (params.condition == null) {
      if (params.sortKeyName != null || params.sortKeyValue != null) {
        throw Error(
          'Trying to query by partition and sort key. Use get instead.'
        );
      }

      // Query only by partition key.
      merge(queryParams, {
        KeyConditionExpression: '#keyName = :keyValue',
        ExpressionAttributeNames: {
          '#keyName': params.partitionKeyName,
        },
        ExpressionAttributeValues: {
          ':keyValue': params.partitionKeyValue,
        },
      });
    } else {
      if (
        typeof params.sortKeyName !== 'string' ||
        params.sortKeyName.length < 1
      ) {
        throw Error('Invalid sort key name or name not given.');
      }

      if (
        typeof params.sortKeyValue === 'string' &&
        params.sortKeyValue.length < 1
      ) {
        throw Error('Invalid sort key value or value not given.');
      }

      if (
        typeof params.sortKeyValue !== 'string' &&
        !Array.isArray(params.sortKeyValue)
      ) {
        // TODO: Check each value of array.
        throw Error('Invalid sort key value or value not given.');
      }

      // Query  by condition.
      merge(queryParams, {
        KeyConditions: {
          [params.partitionKeyName]: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [params.partitionKeyValue],
          },
          [params.sortKeyName]: {
            ComparisonOperator: params.condition,
            AttributeValueList: Array.isArray(params.sortKeyValue)
              ? params.sortKeyValue
              : [params.sortKeyValue],
          },
        },
      });
    }

    return this.docClient.query(queryParams).promise();
  }

  /**
   * Gets one DynamoDB record
   *
   * @param params Configuration of query.
   * @param {!string} params.partitionKeyName Name of the partition key.
   * @param {!string} params.partitionKeyValue Value of the partition key.
   * @param {!string} params.sortKeyName Name of the sort key.
   * @param {!string} params.sortKeyValue Value of the sort key. Can be array if used with a condition.
   * @param {Object} [params.options] Any other DocumentClient param will be forwarded to the document client
   *                                  underneath.
   * @returns {Promise<Object>} QueryResult Query result.
   * @returns {Object} [QueryResult.Item] Result record if exist.
   */
  get(params) {
    if (params == null) {
      throw Error('Parameters not given.');
    }

    if (
      typeof params.partitionKeyName !== 'string' ||
      params.partitionKeyName.length < 1
    ) {
      throw Error('Invalid partition key name or name not given.');
    }

    if (
      typeof params.partitionKeyValue !== 'string' ||
      params.partitionKeyValue.length < 1
    ) {
      throw Error('Invalid partition key value or value not given.');
    }

    if (
      typeof params.sortKeyName !== 'string' ||
      params.sortKeyName.length < 1
    ) {
      throw Error('Invalid sort key name or name not given.');
    }

    if (
      typeof params.sortKeyValue === 'string' &&
      params.sortKeyValue.length < 1
    ) {
      throw Error('Invalid sort key value or value not given.');
    }

    const queryParams = {
      TableName: this.tableName,
      Key: {
        [params.partitionKeyName]: params.partitionKeyValue,
        [params.sortKeyName]: params.sortKeyValue,
      },
    };

    // Add rest of the custom options if given.
    merge(queryParams, params.options);

    return this.docClient.get(queryParams).promise();
  }

  saveAsUpdate(keys, input) {
    const keyValues = keys.reduce((acc, curValue) => {
      acc[curValue] = input[curValue];
      return acc;
    }, {});
    const bodyValues = omit(input, keys);
    return this.update(keyValues, bodyValues); // returns the promise from update
  }

  async update(keyValues, bodyValues) {
    try {
      const params = {
        TableName: this.tableName,
        Key: keyValues,
        UpdateExpression: 'SET #attr1 = :val1',
        ExpressionAttributeNames: {
          '#attr1': Object.keys(bodyValues)[0],
        },
        ExpressionAttributeValues: {
          ':val1': Object.values(bodyValues)[0],
        },
        ReturnValues: 'ALL_NEW',
      };
      const item = await this.docClient.update(params).promise();
      return item.Attributes;
    } catch (err) {
      console.log('Error updating item', err);
      return Promise.reject(err);
    }
  }

  async deleteRecord(bodyValues) {
    const params = {
      TableName: this.tableName,
      Key: {
        pk: bodyValues.pk,
        sk: bodyValues.sk,
      },
    };
    try {
      await this.docClient.delete(params).promise();
    } catch (err) {
      console.log('Error updating item', err);
      return Promise.reject(err);
    }
  }
}
