"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fs = _interopRequireWildcard(require("fs"));

var child = _interopRequireWildcard(require("child_process"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var dir = "./build";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
} else {
  fs.rmdirSync(dir, {
    recursive: true
  });
  fs.mkdirSync(dir);
}

var ResultArray;
fs.readFile("Sketch.js", "utf8", function (err, contents) {
  // console.log(contents);
  var chunks = contents.split("//%");
  chunks.forEach(function (chunk, chunkId) {
    fs.writeFileSync("".concat(dir, "/chunk").concat(chunkId, ".js"), chunk);
    child.exec("minify ".concat(dir, "/chunk").concat(chunkId, ".js > ").concat(dir, "/chunk").concat(chunkId, ".min.js"), function (error, stdout, stderr) {
      if (error) {}
    });
  });
  var featureScript = contents.split("//#FEATURE_START")[1].split("//#FEATURE_END")[0];
  fs.writeFileSync("".concat(dir, "/feature.js"), featureScript);
  child.exec("minify ".concat(dir, "/feature.js > ").concat(dir, "/feature.min.js"), function (error, stdout, stderr) {
    if (error) {
      console.error(error);
    }
  });
});