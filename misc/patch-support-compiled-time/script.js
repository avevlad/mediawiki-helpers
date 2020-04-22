const path = require("path");
const crypto = require("crypto");
const fs = require("fs").promises;

const createHash = (data) => {
  return crypto.createHash("sha512").update(data).digest("hex");
};

const node_modules = "../../node_modules";
const storeJsPath = "next/dist/build/output/store.js";
const storeJsFinalPath = path.join(node_modules, storeJsPath);

/**
 * next@9.3.5
 * April, 22, 2020
 */
const storeJsHash =
  "ccac2335966aab984362f3b161eb3a655af42b4d94b68aa28eb0b17797a89f98e2308506e169c28d3621f754e0f68344cbdc76c21fc1b0605df9701ca62e6790";

let storeJsCode = null;
async function go() {
  try {
    storeJsCode = await fs.readFile(storeJsFinalPath, "utf8");
  } catch (e) {
    console.error(e.message);
  }

  if (!storeJsCode) {
    return;
  }

  const sha512 = createHash(storeJsCode);

  if (sha512 !== storeJsHash) {
    console.log("sha512 = ", sha512);
    console.log("storeJsHash = ", storeJsHash);
    console.log("Warning !!!");
  } else {
    console.log("sha512 = ", sha512);
  }

  try {
    await fs.copyFile("./code/store-patched.js", storeJsFinalPath);
    console.log("File copy successfully");
  } catch (e) {
    console.log("e = ", e);
  }
}

go();
