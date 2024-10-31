"use strict";

const fs = require("fs");
const path = require("path");
const File = require("vinyl");
const glob = require("glob");
const SVGSpriter = require("svg-sprite");

// CONFIG
// https://github.com/svg-sprite/svg-sprite/blob/HEAD/docs/configuration.md
const config = {
  dest: "assets/svg-sprite",
  shape: {
    id: {
      generator: "icon-%s",
    },
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false,
    namespaceIDs: true,
    namespaceClassnames: true,
    dimensionAttributes: true,
  },
  mode: {
    symbol: true,
  },
};

const spriter = new SVGSpriter(config);

// INPUT
const cwd = path.resolve("svg-sprite/icons");
const files = glob.sync("**/*.svg", { cwd });

for (const file of files) {
  spriter.add(
    new File({
      path: path.join(cwd, file),
      base: cwd,
      contents: fs.readFileSync(path.join(cwd, file)),
    })
  );
}

// OUTPUT
spriter.compile((error, result, data) => {
  for (const type of Object.values(result.symbol)) {
    fs.mkdirSync(path.dirname(type.path), { recursive: true });
    fs.writeFileSync(type.path, type.contents);
  }
});
