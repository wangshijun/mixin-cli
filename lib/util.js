/* eslint no-console:"off" */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exec, spawn } = require('child_process');

const debug = require('debug')(require('../package.json').name);
const cross = chalk.red('✘');
const check = chalk.green('✔︎');

const delay = (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout));

function ensurePackageJson() {
  const filePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(filePath) === false) {
    console.log(`${cross} Oops package.json file not found on this directory`);
    process.exit(0);
  }

  return JSON.parse(fs.readFileSync(filePath));
}

function ensureCommand(commandName, installCommand, { forceLatest = false } = {}) {
  return new Promise((resolve, reject) => {
    exec(`which ${commandName}`, {}, async (err, stdout, stderr) => {
      if (err || forceLatest) {
        if (err) {
          console.log(`${cross} ${commandName} not found, installing with: ${installCommand}...`);
        }
        if (forceLatest) {
          console.log(`⏳ installing latest ${commandName}: ${installCommand}...`);
        }
        if (!installCommand) {
          return reject(err);
        }

        const parts = installCommand.split(' ');
        const child = spawn(parts.shift(), parts, {
          cwd: process.cwd(),
          detached: false,
          stdio: 'inherit',
        });

        child.on('close', () => {
          exec(`which ${commandName}`, {}, async (__err, __stdout, __stderr) => {
            if (__stderr) {
              console.error(__stderr);
              return reject(__stderr);
            }

            console.log(`${check} ${commandName} is installed successfully!`);
            await delay(2000);
            resolve();
          });
        });

        child.on('error', reject);
        return;
      }

      debug('ensureCommand', { stdout, stderr, commandName, installCommand });
      if (stderr) {
        console.error(stderr);
        return reject(stderr);
      }

      console.log(`${check} ${commandName} is already installed!`);
      await delay(2000);
      resolve();
    });
  });
}

module.exports = {
  ensurePackageJson,
  ensureCommand,
  debug,
  cross,
  check,
  delay,
};
