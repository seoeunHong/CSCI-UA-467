// kaomoji
class Kaomoji {
  constructor(value, emotions) {
    this.value = value;
    this.emotions = emotions;
  }

  isEmotion(emotion) {
    return this.emotions.include(emotion);
  }
}

const fs = require("fs");

module.exports = {
  Kaomoji,
};

module.exports.init = function (dataStore, fn, cb) {
  fs.readFile(fn, (err, data) => {
    if (err) {
      console.log("error", err);
    } else {
      for (const obj of JSON.parse(data + "")) {
        const kao = new Kaomoji(obj.value, obj.emotions);
        dataStore.push(kao);
      }
      cb();
    }
  });
};
