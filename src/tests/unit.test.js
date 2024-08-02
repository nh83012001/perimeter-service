const { isValidPolygon } = require('../utils/index');

describe('isValidPolygon', () => {
  test('should return true for a valid polygon', () => {
    const coordinates = JSON.stringify([
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 0],
    ]);
    expect(isValidPolygon(coordinates)).toBe(true);
  });

  test('should return error for invalid JSON', () => {
    const coordinates = '[0, 0], [1, 1], [1, 0], [0, 0]';
    expect(isValidPolygon(coordinates)).toBe('ERROR: Invalid JSON format.');
  });

  test('should return error for non-array JSON', () => {
    const coordinates = JSON.stringify({ a: 1, b: 2 });
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: Parsed JSON is not an array.'
    );
  });

  test('should return error for invalid coordinate format', () => {
    const coordinates = JSON.stringify([
      [0, 0],
      [1, 1],
      [1, 'a'],
      [0, 0],
    ]);
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: Coordinates at index 2 must be numbers.'
    );
  });

  test('should return error for non-closed polygon', () => {
    const coordinates = JSON.stringify([
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 1],
    ]);
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: The polygon is not closed. The first and last coordinates must be the same.'
    );
  });
});
