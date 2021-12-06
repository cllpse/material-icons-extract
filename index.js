const { resolve } = require("path");
const { readdir } = require("fs").promises;
const fs = require("fs");

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
  for await (const f of getFiles('./src')) {
    if (f.toString().lastIndexOf("twotone") !== -1) {
      const a = f.split("/");
      const destination = `./out/${a[a.length - 3]}.svg`;

      fs.copyFile(f, destination, (err) => {
        if (err) {
          throw err;
        }

        console.log(destination);
      });
    }
  }
})();
