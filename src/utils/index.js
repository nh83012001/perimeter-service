export function isValidPolygon(coordinates) {
  // Step 1: Check if the input data is an array
  const arrayResult = isArray(coordinates);
  if (arrayResult !== true) {
    return arrayResult;
  }

  // Step 2: Check if each coordinate pair is valid
  const coordsResult = areValidCoordinates(coordinates);
  if (coordsResult !== true) {
    return coordsResult;
  }

  // Step 3: Check if the polygon is closed
  const closedResult = isClosedPolygon(coordinates);
  if (closedResult !== true) {
    return closedResult;
  }

  return true;
}

function isArray(parsed) {
  if (!Array.isArray(parsed)) {
    return 'ERROR: Input is not an array.';
  }
  return true;
}

function areValidCoordinates(parsed) {
  for (let i = 0; i < parsed.length; i++) {
    const coord = parsed[i];
    if (!Array.isArray(coord) || coord.length !== 2) {
      return `ERROR: Invalid coordinate format at index ${i}. Each coordinate must be an array of two numbers.`;
    }
    if (typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
      return `ERROR: Coordinates at index ${i} must be numbers.`;
    }
    if (parsed.length < 3) {
      return 'ERROR: A valid polygon must have at least three coordinate arrays.';
    }
  }
  return true;
}

function isClosedPolygon(parsed) {
  const firstCoord = parsed[0];
  const lastCoord = parsed[parsed.length - 1];
  if (firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1]) {
    return 'ERROR: The polygon is not closed. The first and last coordinates must be the same.';
  }
  return true;
}
