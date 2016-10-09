module.exports = (obj, list) => {
  return list.reduce((acc, value) => {
    if (obj.hasOwnProperty(value)) {
      acc[value] = obj[value]
    }
    return acc
  }, {})
}
