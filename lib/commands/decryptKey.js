const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const { debug, cross, check } = require('../util');

const action = async () => {
  const prompts = [
    {
      type: 'text',
      name: 'RSAPrivateKey',
      default: '',
      message: 'Which kind of wallet do you want to generate',
      validate: x => {
        if (fs.existsSync(x)) {
          return true;
        }

        return 'RSAPrivateKey must be a valid file path';
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'Please enter the password for keystore',
      filter: x => x.trim(),
      when: args => args.type === TYPE_KEY_STORE,
      validate: x => {
        if (!x) {
          return 'password should not be empty';
        }
        if (!passwordValidator.validate(x)) {
          return 'password should be 8~20 chars long, and must contain at least one uppercase/lowercase/digit';
        }

        return true;
      },
    },
  ];

  const args = await inquirer.prompt(prompts);
  debug('genWallet.args', args);

  if (args.type === TYPE_HD_WALLET) {
    const mnemonic = BIP39.generateMnemonic(128);
    console.log('');
    console.log(chalk.red('Please keep the following mnemonic words to somewhere safe'));
    console.log('='.repeat(80));
    console.log(mnemonic);
    console.log('='.repeat(80));
    console.log('');
  } else {
    const wallet = EthWallet.generate();
    if (args.type === TYPE_PRIVATE_KEY) {
      printWallet(wallet, true);
    }
    if (args.type === TYPE_KEY_STORE) {
      saveKeystore(wallet, args.password);
    }
  }

  process.exit(0);
};

module.exports = program => {
  program
    .command('decryptKey')
    .description('Decrypt AES key for generating encrypted asset pin')
    .action(action);
};
