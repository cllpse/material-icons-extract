const { resolve } = require("path");
const { readdir } = require("fs").promises;
const fs = require("fs").promises;
const shell = require("shelljs");

const generateCss = (id) => `.${id} { mask-image: url("./assets/${id}.svg"); }\n`;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);

    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  const inDir = "src";
  const outDir = "assets";
  const outCss = `${outDir}/all.css`;

  try {
    await fs.mkdir(outDir);
  } catch (error) {
    // ...
  }

  let files = [];
  let css = "";

  for await (const f of getFiles(inDir)) {
    if (f.toString().lastIndexOf("twotone") !== -1 && f.lastIndexOf("24px") !== -1) {
      const a = f.split("/");

      const id = `${a[a.length - 3]}`;
      const destination = `${outDir}/${id}.svg`;

      css += generateCss(id);

      try {
        fs.copyFile(f, destination);
        console.info(`copied ${destination}`);
      } catch (error) {
        throw error;
      }
    }
  }

  try {
    fs.writeFile(outCss, css);
    console.info(`generated ${outCss}`);
  } catch (error) {
    throw error;
  }
})();
