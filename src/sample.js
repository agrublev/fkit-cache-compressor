import fkCompressor from "../dist/index.js";

let json = require("./sample.json");

(async () => {
  let Compressor = new fkCompressor();
  // Compressor.setBucket("KIT");
  await Compressor.set("test52", json);


  console.warn(await Compressor.get("test52"));
  // Compressor.flush();
})();
