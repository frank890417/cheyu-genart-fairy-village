import * as fs from "fs";
import * as child from "child_process";
import * as  uglifyjs from 'uglify-js'
var dir = "./build";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
} else {
  fs.rmdirSync(dir, {
    recursive: true,
  });
  fs.mkdirSync(dir);
}

var ResultArray;

function minify(source, dest) {

  const result = uglifyjs.minify([
    fs.readFileSync(source, 'utf8')], {
    mangle: true,
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true
    }
  });

  fs.writeFileSync(dest, result.code);
}

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
fs.readFile("mySketch.js", "utf8", function (err, contents) {
  var chunks = contents.split("//%");

  chunks.forEach((chunk, chunkId) => {
    fs.writeFileSync(`${dir}/chunk${chunkId}.js`, chunk);
    minify(`${dir}/chunk${chunkId}.js`, `${dir}/chunk${chunkId}.min.js`)
    // child.exec(
    //   `minify ${dir}/chunk${chunkId}.js > ${dir}/chunk${chunkId}.min.js`,
    //   (error, stdout, stderr) => {
    //   }
    // );
    // let file = `${dir}/chunk${chunkId}.min.js`
    // console.log(file, getFilesizeInBytes(file))
  });

  let featureScript = contents
    .split("//#FEATURE_START")[1]
    .split("//#FEATURE_END")[0];
  fs.writeFileSync(`${dir}/feature.js`, featureScript);

  minify(`${dir}/feature.js`, `${dir}/feature.min.js`)

});
