import minify from 'minify';
import tryToCatch from 'try-to-catch';
import fs from 'fs';
import path from 'path';

import configs from './minfu.config.js';

// We need to define __dirname because it is not defined for type: module
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

const options = {
  html: {
      removeAttributeQuotes: false,
      removeOptionalTags: false,
  },
};

async function doMinification(script) {
  const [error, data] = await tryToCatch(minify, path.join(__dirname, script), options);
  if(error) {
    console.error(error);
    return '';
  }
  return data;
}

function run() {
  configs.forEach(async (config) => {
    console.log('Building ' + config.name + '...');
    // Check if output directory exists first
    if(!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir);
    }
    // Minify all js files for that config, then write them to the specified file
    if(config.js && config.outputJS) {
      Promise.all(config.js.map((script) => doMinification(script)))
      .then((array) => {
        const minifiedScripts = array.join('');
        fs.writeFileSync(path.join(config.outputDir, config.outputJS), minifiedScripts);
      });
    }

    // Minify all css files for that config, then write them to the specified file
    if(config.css && config.outputCSS) {
      Promise.all(config.css.map((script) => doMinification(script)))
      .then((array) => {
        const minifiedScripts = array.join('');
        fs.writeFileSync(path.join(config.outputDir, config.outputCSS), minifiedScripts);
      });
    }
  });
}

run();

