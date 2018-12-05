const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { debug, cross, check } = require('../util');

const action = async () => {
  const prompts = [
    {
      type: 'text',
      name: 'clientId',
      message: 'What is dAPP UUID?',
      default: '',
      filter: x => x.trim(),
      validate: x => {
        if (!x) {
          return 'clientId should not be empty';
        }

        // TODO: validate UUID format
        return true;
      },
    },
    {
      type: 'editor',
      name: 'sessionInfo',
      default: '',
      message: 'What is the dapp session info',
      filter: x => x.trim(),
      validate: x => {
        if (!x) {
          return 'DApp session info must not be empty';
        }

        return true;
      }
    },
    {
      type: 'text',
      name: 'fileName',
      message: 'What is the filename for generated config file',
      default: `config_${Date.now()}.js`,
      filter: x => x.trim(),
      validate: x => {
        if (!x) {
          return 'fileName for generated config file must not be empty!';
        }

        return true;
      },
    },
  ];

  const args = await inquirer.prompt(prompts);
  debug('genConfig.args', args);

  process.exit(0);
};

module.exports = program => {
  program
    .command('genConfig')
    .description('Generate mixin-node-client config from a newly generated DApp session info')
    .action(action);
};
