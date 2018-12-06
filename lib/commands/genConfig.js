const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const clipboard = require('clipboardy');
const os = require('os');
const pem = require('pem-file');
const util = require('util');

const { oaepDecrypt } = require('../crypto');
const { repository, bugs } = require('../../package.json');
const { debug, cross, check, validateUUID } = require('../util');

const action = async () => {
  const FORMAT_PLAIN_JS = 'Plain Javascript';
  const FORMAT_DOT_ENV = '.env File';
  const prompts = [
    // {
    //   type: 'text',
    //   name: 'clientId',
    //   message: 'What is the DAPP clientId? (must be valid UUID format)',
    //   default: '',
    //   filter: x => x.trim(),
    //   validate: x => {
    //     if (!x) {
    //       return 'clientId should not be empty';
    //     }

    //     if (!validateUUID(clientId)) {
    //       return 'clientId should be a valid uuid';
    //     }

    //     return true;
    //   },
    // },
    // {
    //   type: 'text',
    //   name: 'clientSecret',
    //   message: 'What is the DAPP clientSecret?',
    //   default: '',
    //   filter: x => x.trim(),
    //   validate: x => {
    //     if (!x) {
    //       return 'clientSecret should not be empty';
    //     }

    //     return true;
    //   },
    // },
    {
      type: 'editor',
      name: 'sessionInfo',
      default: '',
      message: 'What is the DAPP session info',
      filter: x => x.trim(),
      validate: x => {
        if (!x) {
          return 'DAPP session info must not be empty';
        }

        return true;
      },
    },
    {
      type: 'list',
      name: 'fileFormat',
      message: 'Which config format do you prefer?',
      choices: [
        {
          value: FORMAT_PLAIN_JS,
          name: `[${FORMAT_PLAIN_JS}] can be required from any js code`,
        },
        {
          value: FORMAT_DOT_ENV,
          name: `[${FORMAT_DOT_ENV}] loaded with "dotenv" and accessed from "process.env.XXX`,
        },
      ],
      default: FORMAT_PLAIN_JS,
    },
    {
      type: 'text',
      name: 'fileNameJs',
      message: 'What is the filename for generated config file',
      when: args => args.fileFormat === FORMAT_PLAIN_JS,
      default: `config_mixin_${Date.now()}.js`,
      filter: x => x.trim(),
      validate: x => {
        if (!x) {
          return 'fileName for generated config file must not be empty!';
        }

        return true;
      },
    },
    {
      type: 'text',
      name: 'fileNameEnv',
      message: 'What is the filename for generated env file',
      when: args => args.fileFormat === FORMAT_DOT_ENV,
      default: `.env_mixin_${Date.now()}`,
      filter: x => x.trim(),
      validate: x => {
        if (!x) {
          return 'fileName for generated env file must not be empty!';
        }

        return true;
      },
    },
  ];

  const args = await inquirer.prompt(prompts);
  const { sessionInfo, fileNameJs, fileNameEnv, fileFormat } = args;
  debug('genConfig.args', args);

  const [assetPin, sessionId, encryptedAESKey, ...privateKeyParts] = sessionInfo.split(os.EOL);
  if (!assetPin || !sessionId || !encryptedAESKey || !privateKeyParts.length) {
    console.log(`${cross} Invalid sessionInfo, make sure you copy paste from mixin developer console`);
    return process.exit(1);
  }

  const privateKeyStr = privateKeyParts.join(os.EOL).trim();
  const privateKeyBytes = pem.decode(Buffer.from(privateKeyStr));
  let aesKey = '';
  try {
    const aesKeyBuffer = await oaepDecrypt(
      Buffer.from(encryptedAESKey, 'base64'),
      privateKeyBytes,
      'SHA-256',
      Buffer.from(sessionId)
    );
    aesKey = Buffer.from(aesKeyBuffer).toString('base64');
    console.log(`${check} sessionInfo was successfully decoded!`);
    // console.log('sessionInfo', { assetPin, aesKey, sessionId, privateKey: privateKeyStr });
  } catch (err) {
    console.log(
      `${cross} sessionInfo decode failed with error: ${err.message || err.toString()}, submit an issue at ${bugs.url}`
    );
    return process.exit(1);
  }

  if (fileFormat === FORMAT_PLAIN_JS) {
    const filePath = path.join(process.cwd(), fileNameJs);
    fs.writeFileSync(
      filePath,
      `// Generated with awesome ${repository.url}
module.exports = {
  clientId: '<PUT YOUR DAPP CLIENT_ID HERE>',
  clientSecret: '<PUT YOUR DAPP CLIENT_SECRET HERE>',
  assetPin: '${assetPin}',
  sessionId: '${sessionId}',
  aesKey: '${aesKey}',
  privateKey: \`${privateKeyStr}\`,
};`
    );
    console.log(`${check} Config file written to ${filePath}`);
    console.log(`${check} Press ctrl+v and then enter to view file content`);
    clipboard.writeSync(`cat ${filePath}`);
  }

  if (fileFormat === FORMAT_DOT_ENV) {
    const filePath = path.join(process.cwd(), fileNameEnv);
    fs.writeFileSync(
      filePath,
      `# Generated with awesome ${repository.url}
MIXIN_CLIENT_ID="<PUT YOUR DAPP CLIENT_ID HERE>"
MIXIN_CLIENT_SECRET="<PUT YOUR DAPP CLIENT_SECRET HERE>"
MIXIN_ASSET_PIN="${assetPin}"
MIXIN_SESSION_ID="${sessionId}"
MIXIN_AES_KEY="${aesKey}"
MIXIN_PRIVATE_KEY="${privateKeyStr}"`
    );
    console.log(`${check} Config file written to ${filePath}`);
    console.log(`${check} Press ctrl+v and then enter to view file content`);
    clipboard.writeSync(`cat ${filePath}`);
  }

  console.log('');
  console.log(chalk.yellow('Warning: please keep the config file safe since it contains sensitive information'));
  console.log('');

  process.exit(0);
};

module.exports = program => {
  program
    .command('genConfig')
    .description('Generate mixin-node-client config from a newly generated DApp session info')
    .action(action);
};
