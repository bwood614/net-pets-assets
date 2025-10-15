const fs = require("fs");

const args = process.argv;

// Arguments
// arg1 -> file path to json
// arg2 -> name of the png file the json describes
const customArgs = args.slice(2);

const jsonFilePath = customArgs[0];
const data = require(jsonFilePath);

const oldFrames = data.frames;
const newFrames = {};
const oldFrameKeys = Object.keys(oldFrames);

const animations = {};

oldFrameKeys.forEach((frameKey) => {
  if (!frameKey.includes("#")) {
    // frames with tags in aseprite have a '#'
    return;
  }
  // ex. poodle #sleep 56.aseprite -> sleep 56.aseprite -> sleep 56
  const [baseName, frameNumber] = frameKey
    .split("#")[1]
    .split(".")[0]
    .split(" ");

  if (!animations[baseName]) {
    animations[baseName] = [];
  }

  const newFrameKey = baseName.concat(frameNumber);
  animations[baseName].push(newFrameKey);
  newFrames[newFrameKey] = oldFrames[frameKey];
});

const oldMeta = data.meta;
const newMeta = {
  ...oldMeta,
  frameTags: undefined,
  scale: "0.5",
  image: customArgs[1],
};

try {
  fs.writeFileSync(
    jsonFilePath,
    JSON.stringify({frames: newFrames, animations, meta: newMeta})
  );
  console.log("Synchronous file write successful!");
} catch (err) {
  console.error("Error writing file synchronously:", err);
}
