/**
* Deep nested object property access
* @param {Object} nestedObj - Object used to access property.
* @param {Array of String} pathArr - Array of property names access from left to right.
* @param {String} defaultValue - Default value if not found.
* @return {Any} Value of nested object property.
*/
const getValueFromNestedObject = (nestedObj, pathArr, defaultValue = null) => (
  pathArr.reduce(
    ((obj, key) => ((obj && obj[key] !== undefined) ? obj[key] : defaultValue)),
    nestedObj,
  )
);

export default getValueFromNestedObject;
