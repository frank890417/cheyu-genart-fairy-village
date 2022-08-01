const Queue = require("queue-promise");
const puppeteer = require("puppeteer");
const keccak256 = require("keccak256");
const cliProgress = require("cli-progress");
const {
  exec
} = require("child_process");

var fs = require("fs");
const http = require("http");

var dir = "./img";
var dir2 = "./video";

const port = 5501;

let imgN = process.argv[2];
let dim = process.argv[3];
let deletePrevious = process.argv[4];
let isImage = process.argv[5];

let pageWaitTime = 60000;
let doneCount = 0;

let renderedFeatureList = []

let browser, page, serve_file_path, server;

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
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


const queue = new Queue({
  concurrent: 5,
  interval: 100,
  // start: false,
});

// queue.on("start", () => {
//   console.log("start");
// });
// queue.on("stop", () => /* … */);
// queue.on("end", () => /* … */);

queue.on("resolve", async (data) => {
  if (data.hash) renderedFeatureList.push(data)
  bar1.update(doneCount);
  fs.writeFileSync('img/features.json', JSON.stringify(renderedFeatureList, null, 2));
  if (doneCount == imgN) {
    bar1.stop();
    await browser.close();
    // await server.close();
    process.exit();
  }
});
queue.on("reject", (error) => console.error(error));

async function setup() {
  browser = await puppeteer.launch({
    headless: false
  });
  // browser = await puppeteer.launch();
  page = await browser.newPage();
  dim = parseInt(dim);
  page.setViewport({
    width: dim,
    height: dim
  });
}

async function img_main() {
  removeAndCreateDir(dir)
  await setup();

  // launch sketch page
  serve_file_path = "../index_tokenhashtool.html";
  // queue.enqueue(startServer);

  for (let i = 0; i < imgN; i++) {
    queue.enqueue(generate_img);
  }
}

async function video_main() {
  removeAndCreateDir(dir2)
  await setup();
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "./video",
  });

  serve_file_path = "../capture.html";
  // queue.enqueue(startServer);

  for (let i = 0; i < imgN; i++) {
    queue.enqueue(generate_video);
  }
}

if (isImage === "true") {
  img_main();
} else {
  video_main();
}

function startServer() {
  return new Promise(async (resolve) => {
    server = http.createServer((req, res) => {
      res.writeHead(200, {
        "content-type": "text/html"
      });
      fs.createReadStream(serve_file_path).pipe(res);
    });
    server.listen(port);
    resolve();
  });
}

function generate_video() {
  return new Promise(async (resolve) => {
    try {
      const hash = "0x" + keccak256(Date.now()).toString("hex");

      await page.goto(`http://127.0.0.1:${port}/index_tokenhashtool.html?hash=${hash}`);

      await sleep(5000 * 20);

      exec(`cd video;mkdir ${hash};tar -xf ${hash}.tar -C ${hash}`, (error, stdout, stderr) => {
        console.error(stderr)
        exec(`cd video/${hash};ffmpeg -r 30 -f image2 -s ${dim}x${dim} -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p ${hash}.mp4;mv ${hash}.mp4 ../;cd ../;rm -rf ${hash};rm ${hash}.tar`, (error, stdout, stderr) => {
          console.error(stderr)
          doneCount++;
          resolve();
        });
      });
    } catch (e) {
      // console.log("error processing.. start new job");
      queue.enqueue(generate_video);
      resolve();
    }

  });
}

function generate_img() {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(page);
      let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
      var hash = ("oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet
          .length) |
        0]).join(''))
      // const hash = "0x" + keccak256(Date.now()).toString("hex");
      // `http://127.0.0.1:${port}/public/index.html?hash=${hash}`
      await page.goto(
        `http://127.0.0.1:${port}/index_tokenhashtool.html?hash=${hash}`
      );
      // console.log(`http://127.0.0.1:${port}/public/index.html?hash=${hash}`)
      await page.waitForSelector("#defaultCanvas0");
      await page.waitForTimeout(pageWaitTime);
      //get feature
      let features = await page.evaluate('$fxhashFeatures');
      // console.log(features)

      const canvasImage = await page.$("#defaultCanvas0");
      await canvasImage.screenshot({
        path: `img/${hash}.png`,
      });
      doneCount++;

      resolve({
        hash,
        features
      });
    } catch (e) {
      console.log(e)
      console.log("error processing.. start new job");
      queue.enqueue(generate_img);
      resolve({});
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}