"use strict";

var Queue = require("queue-promise");

var puppeteer = require("puppeteer");

var keccak256 = require("keccak256");

var cliProgress = require("cli-progress");

var _require = require("child_process"),
    exec = _require.exec;

var fs = require("fs");

var http = require("http");

var dir = "./img";
var dir2 = "./video";
var port = 5501;
var imgN = process.argv[2];
var dim = process.argv[3];
var deletePrevious = process.argv[4];
var isImage = process.argv[5];
var pageWaitTime = 60000;
var doneCount = 0;
var renderedFeatureList = [];
var browser, page, serve_file_path, server;
var bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar1.start(imgN, 0);

function removeAndCreateDir(dirName) {
  if (deletePrevious === "true") {
    fs.rmSync(dirName, {
      recursive: true,
      force: true
    });
  }

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

var queue = new Queue({
  concurrent: 5,
  interval: 100 // start: false,

}); // queue.on("start", () => {
//   console.log("start");
// });
// queue.on("stop", () => /* … */);
// queue.on("end", () => /* … */);

queue.on("resolve", function _callee(data) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (data.hash) renderedFeatureList.push(data);
          bar1.update(doneCount);
          fs.writeFileSync('img/features.json', JSON.stringify(renderedFeatureList, null, 2));

          if (!(doneCount == imgN)) {
            _context.next = 8;
            break;
          }

          bar1.stop();
          _context.next = 7;
          return regeneratorRuntime.awrap(browser.close());

        case 7:
          // await server.close();
          process.exit();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
queue.on("reject", function (error) {
  return console.error(error);
});

function setup() {
  return regeneratorRuntime.async(function setup$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(puppeteer.launch({
            headless: false
          }));

        case 2:
          browser = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(browser.newPage());

        case 5:
          page = _context2.sent;
          dim = parseInt(dim);
          page.setViewport({
            width: dim,
            height: dim
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function img_main() {
  var i;
  return regeneratorRuntime.async(function img_main$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          removeAndCreateDir(dir);
          _context3.next = 3;
          return regeneratorRuntime.awrap(setup());

        case 3:
          // launch sketch page
          serve_file_path = "../index_tokenhashtool.html"; // queue.enqueue(startServer);

          for (i = 0; i < imgN; i++) {
            queue.enqueue(generate_img);
          }

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function video_main() {
  var i;
  return regeneratorRuntime.async(function video_main$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          removeAndCreateDir(dir2);
          _context4.next = 3;
          return regeneratorRuntime.awrap(setup());

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: "./video"
          }));

        case 5:
          serve_file_path = "../capture.html"; // queue.enqueue(startServer);

          for (i = 0; i < imgN; i++) {
            queue.enqueue(generate_video);
          }

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}

if (isImage === "true") {
  img_main();
} else {
  video_main();
}

function startServer() {
  return new Promise(function _callee2(resolve) {
    return regeneratorRuntime.async(function _callee2$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            server = http.createServer(function (req, res) {
              res.writeHead(200, {
                "content-type": "text/html"
              });
              fs.createReadStream(serve_file_path).pipe(res);
            });
            server.listen(port);
            resolve();

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
}

function generate_video() {
  return new Promise(function _callee3(resolve) {
    var hash;
    return regeneratorRuntime.async(function _callee3$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            hash = "0x" + keccak256(Date.now()).toString("hex");
            _context6.next = 4;
            return regeneratorRuntime.awrap(page["goto"]("http://127.0.0.1:".concat(port, "/index_tokenhashtool.html?hash=").concat(hash)));

          case 4:
            _context6.next = 6;
            return regeneratorRuntime.awrap(sleep(5000 * 20));

          case 6:
            exec("cd video;mkdir ".concat(hash, ";tar -xf ").concat(hash, ".tar -C ").concat(hash), function (error, stdout, stderr) {
              console.error(stderr);
              exec("cd video/".concat(hash, ";ffmpeg -r 30 -f image2 -s ").concat(dim, "x").concat(dim, " -i \"%07d.png\" -vcodec libx264 -crf 17 -pix_fmt yuv420p ").concat(hash, ".mp4;mv ").concat(hash, ".mp4 ../;cd ../;rm -rf ").concat(hash, ";rm ").concat(hash, ".tar"), function (error, stdout, stderr) {
                console.error(stderr);
                doneCount++;
                resolve();
              });
            });
            _context6.next = 13;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            // console.log("error processing.. start new job");
            queue.enqueue(generate_video);
            resolve();

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 9]]);
  });
}

function generate_img() {
  return new Promise(function _callee4(resolve, reject) {
    var alphabet, hash, features, canvasImage;
    return regeneratorRuntime.async(function _callee4$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            // console.log(page);
            alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
            hash = "oo" + Array(49).fill(0).map(function (_) {
              return alphabet[Math.random() * alphabet.length | 0];
            }).join(''); // const hash = "0x" + keccak256(Date.now()).toString("hex");
            // `http://127.0.0.1:${port}/public/index.html?hash=${hash}`

            _context7.next = 5;
            return regeneratorRuntime.awrap(page["goto"]("http://127.0.0.1:".concat(port, "/index_tokenhashtool.html?hash=").concat(hash)));

          case 5:
            _context7.next = 7;
            return regeneratorRuntime.awrap(page.waitForSelector("#defaultCanvas0"));

          case 7:
            _context7.next = 9;
            return regeneratorRuntime.awrap(page.waitForTimeout(pageWaitTime));

          case 9:
            _context7.next = 11;
            return regeneratorRuntime.awrap(page.evaluate('$fxhashFeatures'));

          case 11:
            features = _context7.sent;
            _context7.next = 14;
            return regeneratorRuntime.awrap(page.$("#defaultCanvas0"));

          case 14:
            canvasImage = _context7.sent;
            _context7.next = 17;
            return regeneratorRuntime.awrap(canvasImage.screenshot({
              path: "img/".concat(hash, ".png")
            }));

          case 17:
            doneCount++;
            resolve({
              hash: hash,
              features: features
            });
            _context7.next = 27;
            break;

          case 21:
            _context7.prev = 21;
            _context7.t0 = _context7["catch"](0);
            console.log(_context7.t0);
            console.log("error processing.. start new job");
            queue.enqueue(generate_img);
            resolve({});

          case 27:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[0, 21]]);
  });
}

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}