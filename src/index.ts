import * as core from "@actions/core";
import fs from "fs";
import util from "util";
const readFileAsync = util.promisify(fs.readFile);

async function run() {
  const file_path: string = core.getInput("file_path");
  const prop_path: string = core.getInput("prop_path");
  const fail_if_not_found: string = core.getInput("fail_if_not_found");
  let pathArr: string[] = [];

  if (prop_path) {
    pathArr = prop_path.split(".");
  }

  try {
    const buffer = await readFileAsync(file_path);
    let json = JSON.parse(buffer.toString());

    if (pathArr.length > 0) {
      json = pathArr.reduce(
        (obj, key) =>{
          const idxStrReg = key.match(/(\[)[0-9]+(])/);
          if(idxStrReg){
            const arrKey = key.replace(/(\[)[0-9]+(])/, "");
            const idxReg = idxStrReg[0].match(/[0-9]+/);
            if (idxReg){
              const idx = idxReg[0];
              return key && obj && obj[arrKey] !== "undefined" && obj[arrKey][idx] !== "undefined" ? obj[arrKey][idx] : undefined;
            }
          }
          return key && obj && obj[key] !== "undefined" ? obj[key] : undefined;
        },
        json
      );
    }
    if (json && typeof json === "object") {
      for (const key in json) {
        core.setOutput(key, json[key]);
      }
    } else if (json) {
      core.setOutput("value", json);
    } else {
      if (fail_if_not_found == 'true') {
        core.setFailed(`can not find prop_path: ${prop_path} in json file.`);
      } else {
        core.setOutput("value", "");
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      core.setFailed(error);
    }
  }
}

run();
