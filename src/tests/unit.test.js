const { isValidPolygon } = require('../utils/index');

describe('isValidPolygon', () => {
  test('should return true for a valid polygon', () => {
    const coordinates = [
      [-123.07367714843726, 47.82350779063202],
      [-121.12909707031201, 48.817017050693806],
      [-121.41474160156207, 46.47875157433711],
      [-123.07367714843726, 47.82350779063202],
    ];
    expect(isValidPolygon(coordinates)).toBe(true);
  });

  test('should return error for non-array JSON', () => {
    const coordinates = { a: 1, b: 2 };
    expect(isValidPolygon(coordinates)).toBe('ERROR: Input is not an array.');
  });

  test('should return if not an array of arrays', () => {
    const coordinates = [1, 2];
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: Invalid coordinate format at index 0. Each coordinate must be an array of two numbers.'
    );
  });

  test('should return error for invalid coordinate format', () => {
    const coordinates = [
      [0, 0],
      [1, 1],
      [1, 'a'],
      [0, 0],
    ];
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: Coordinates at index 2 must be numbers.'
    );
  });

  test('Polygon needs 3 points', () => {
    const coordinates = [
      [0, 0],
      [0, 0],
    ];
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: A valid polygon must have at least three coordinate arrays.'
    );
  });

  test('should return error for non-closed polygon', () => {
    const coordinates = [
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 1],
    ];
    expect(isValidPolygon(coordinates)).toBe(
      'ERROR: The polygon is not closed. The first and last coordinates must be the same.'
    );
  });
});
