module.exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports.sleep = async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.random = function(from, to) {
  return from + Math.floor(Math.random() * (to - from));
}
