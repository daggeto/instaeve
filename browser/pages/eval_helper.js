module.exports.innerText = function (node) {
  return node.innerText;
}

module.exports.textContains = function (node, text) {
  return node.innerText === text;
}
