# mixin-cli

[![build status](https://img.shields.io/travis/wangshijun/mixin-cli.svg)](https://travis-ci.org/wangshijun/mixin-cli)
[![code coverage](https://img.shields.io/codecov/c/github/wangshijun/mixin-cli.svg)](https://codecov.io/gh/wangshijun/mixin-cli)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/wangshijun/mixin-cli.svg)](LICENSE)

> Command line tool set that easy DApp development in [Mixin Network](https://mixin.one).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)

## Install

```sh
yarn add mixin-cli --global
# OR npm install mixin-cli -g
```

## Usage

**Please note that currently only `mixin dapp:config` works.**

```bash
$ mixin
Usage: mixin [options] [command]

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  dapp:config    Generate mixin-node-client config from a newly generated DApp session info
  dapp:create    Bootstrap a new DAPP that have mixin-client-sdk integrated
  dapp:start     Start an DApp bootstrapped with `mixin dapp:create`
  dapp:build     Build an DApp bootstrapped with `mixin dapp:create`
```

### Generate DApp Config

See follow screen cast in action:

[![asciicast](https://asciinema.org/a/215574.svg)](https://asciinema.org/a/215574)

Please note that the generated config still missing 2 important pieces of info to be used with [mixin-node-sdk](https://github.com/wangshijun/mixin-node-sdk). As shown below:

```javascript
// Generated with awesome https://github.com/wangshijun/mixin-cli
module.exports = {
  clientId: '<PUT YOUR DAPP CLIENT_ID HERE>',
  clientSecret: '<PUT YOUR DAPP CLIENT_SECRET HERE>',
  assetPin: '310012',
  sessionId: '621c905b-1739-45e7-b668-b5531dd83646',
  aesKey: '******s2EFHBPV2Xsb/OiwLdgjGt3q53JcFeLmbUutEk=',
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCsNaGbDx1UeKrTux01nC6R7/bu2GUELe6Q2mBSPymkZW2fpiaO
vr3RYbwfcFEuBDA9GQQoTiMYe/TUiYLGIycvpR5oifBQjgsTvxnwxqThD0VkrDKM
CA2ezXSb3e5yD0fn6X5HrkfVfYmNKwSbr7Yes/rYsVHCbZgq49omzitHwQIDAQAB
AoGANSsRzBfsjEn9JAXfTM/9qN0XtkJlXdb4kwx5NKt/pdwS7nmT6fqGDIFKXcKF
rdlpM1Pn7rHBMCwFOSGDmLz9ubxvXaLrViWNf50eUWEWlIYsGolChDWquG+LRXEx
BtdaJrzA1DucS/MlirQ4nGnnQ4jRXzbs/lIyuqph8T5rh0kCQQDTXfKcBtwa4u0s
0VG7Fz0tSm+8uW9FVZfRAlR+dMlllBnDaQT6FvVik1lfObli3+RLPeJYfyONmsuO
yMRvtboTAkEA0JLppAMZfwdkgfanzsyM+SAeiw3BIfn302G+K0rlkJAgJbv5zDKa
BTtpFtPO6SsuPKWuqDlQRA21MycmfsmxWwJAWh+s2qpyH2SzDHEUEFoQU8dxbV8D
-----END RSA PRIVATE KEY-----`,
};
```

`clientId` and `clientSecret` can be obtained from [Mixin Developer Dashboard](https://developers.mixin.one/dashboard).

### Debugging

If you are curious what happened during each command, try run following command:

```bash
DEBUG=mixin-cli:* mixin
```

## Contributors

| Name           |
| -------------- |
| **wangshijun** |

## License

[MIT](LICENSE) © wangshijun
