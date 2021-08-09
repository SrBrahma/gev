<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/gev)](https://www.npmjs.com/package/gev)
[![npm](https://img.shields.io/npm/dw/gev)](https://www.npmjs.com/package/gev)

</div>

# gev

A slightly opinionated central way to fastly create new projects with a single command.

Creating every single Typescript project environment is a real pain. Takes lots of minutes, sufferings and procrastinations to leave it functional and in the way I feel confortable to work with. We know how boring it really is.

There is a [templates](./templates) directory that contains all flavors boilerplates generated using the latest gev version.


# 📖 Usage:

```bash
npx gev <flavor> # To use the current directory as destination and package name. Directory emptiness will be checked.

npx gev <flavor> <newPackageName> # To create a new directory and use it as the package name. Directory existence will be checked.

npx gev -h # For help and all commands and options available.
```

Current available flavors are:

**`ts`**: Typescript project

**`expo`**: Expo project.

**`expo-pkg`**: React-Native/Expo components package. It's called expo because it will have a expo sandbox directory for testing your component.

All the flavors uses Typescript.

To supress the npm@7 possible npx confirmation message, you can use `npx -y gev`.

# 🔮 Future

* Add Paypal donate button to the end of READMEs (or as a badge). Also funding.yml file.

* Interactive menu to add other badges and the paypal button to the README.

* typedoc support, with markdown output. I hate writing READMEs!

* jest integration

* Allow custom setups. It could be something like `npx gev -u githubUsername`. This could really be a good way for people to have their own environment setup without too much work.

* Use `npm get` and `set` for local configs. Could store Github username, donation link, some **package.json** defaults and custom gev scripts to be used as default.

* `npx gev` would open an interactive menu to choose the desired initializer or change user options.

* `npx gev ts coolPackage` would start a TS package without going through the menu above.

# 📰 [Changelog](CHANGELOG.md)

# 🦔 Etc

* As it accepts scoped package names like `npx gev @yourUsername/coolPackage`, it **is not** possible to specify a path in the package name, like `... deep/dir/coolPackage`.

* On errors or process exit during the project generation, it will remove any written file.
