export function isValidPolygon(coordinates) {
  let parsed;
  let errorList = [];

  // Step 1: Check if coordinates can be parsed
  const parseResult = canParseJSON(coordinates);
  if (parseResult !== true) {
    errorList.push(parseResult);
    return errorList.join('\n'); // don't move on if you can't parse json
  }

  parsed = JSON.parse(coordinates);

  // Step 2: Check if parsed data is an array
  const arrayResult = isArray(parsed);
  if (arrayResult !== true) {
    errorList.push(arrayResult);
    return errorList.join('\n'); // don't move on if not an array
  }

  // Step 3: Check if each coordinate pair is valid
  const coordsResult = areValidCoordinates(parsed);
  if (coordsResult !== true) {
    errorList.push(coordsResult);
    return errorList.join('\n'); // don't move on if coordinates aren't numbers
  }

  // Step 4: Check if the polygon is closed
  const closedResult = isClosedPolygon(parsed);
  if (closedResult !== true) {
    errorList.push(closedResult);
  }
  if (errorList.length === 0) {
    return true;
  } else {
    return errorList.join('\n');
  }
}

function canParseJSON(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return 'ERROR: Invalid JSON format.';
  }
}

function isArray(parsed) {
  if (!Array.isArray(parsed)) {
    return 'ERROR: Parsed JSON is not an array.';
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
