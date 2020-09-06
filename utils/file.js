const fs = require("fs");

module.exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("deleteFile: ", err);
    } else {
      console.log("file " + filePath + " removed!");
    }
  });
};
