const fs = require("fs");
const dotenv = require("dotenv");
const mime = require("mime");

dotenv.config();

const saveBase64Image = (base64String, destinationFolder, filename = null) => {
  const decodedImg = decodeBase64Image(base64String);
  const imageBuffer = decodedImg.data;
  const type = decodedImg.type;
  const extension = mime.getExtension(type);
  filename = filename !== null ? filename : getRandomString(20);

  const imageDir = process.env.PUBLIC_FOLDER + destinationFolder;
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const file = `${destinationFolder}${filename}.${extension}`;

  try {
    fs.writeFileSync(process.env.PUBLIC_FOLDER + file, imageBuffer, "utf8");
    return process.env.STATIC_FILES_SERVER + file;
  } catch (err) {
    console.error(err);
  }
};

function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], "base64");

  return response;
}

function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

module.exports = saveBase64Image;
