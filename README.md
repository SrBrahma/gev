# gev

Creating every single Typescript project environment is a real pain. Takes lots of minutes, sufferings and procrastinations to leave it functional and in the way I feel confortable to work with. We know how boring it really is.

Also, having to manage the **eslint** of each project and not knowing which one I've updated last, also causes some anxiety.

This `npx` package saves me some good hours of life, so I can watch more videos of cute dogs before I die.

Made it for me and my projects, but can also work really well for you. It's fast, simple and good.

# Usage:

```bash
npx gev # To use the current directory as destination and package name. Directory emptiness will be checked.

# or

npx gev <packageName> # To create a new directory and use it as the package name. Directory existence will be checked.
```

# It will

* Check if the package name [is valid](https://www.npmjs.com/package/validate-npm-package-name)
* `npm init -y` and do some changes on package.json:
  * Set version to 0.1.0, as 1.0.0 on stable release
  * Change `main` value to `dist/index.js`
  * Add common `scripts`
  * [Whitelist publish files](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d) with `"files": ["/dist"]`
* `npm i -D typescript [...eslint packages] rimraf`
* Set the **.eslintrc** and use my [`@srbrahma/elint-config`](https://github.com/SrBrahma/eslint-config) I've been configuring through some years
* `rimraf` as dev dep for cross-platform erasing the `dist` dir, in `clean` npm script. Common practice.
* `tsc --init` for the latest options
* Change some tsconfigs (source map, declaration files, outDir=dist, resolveJsonModule etc)
* Create basic .gitignore, .eslintignore
* README.md and CHANGELOG.md with template and some initial infos
* Create src/index.ts

You may want to read each file in [src/resources](./src/resources), or just initialize a project to see the final files.

# Future

* `--react` and `--react-native` flavors as arguments, for further options to the eslint and tsconfig.

* Add Paypal donate button to the end of READMEs (or as a badge). Money! It could check if I am the npx caller. Else, *maybe* shouldn't be a good idea to add that button with my link.

* Interactive menu to add other badges and the paypal button to the README.

* typedoc support, with markdown output. I hate writing READMEs!

* jest integration

* Allow custom setups. It could be something like `npx gev -u githubUsername`. This could really be a good way for people to have their own environment setup without too much work.

* Use `npm get` and `set` for local configs. Could store Github username, donation link, some **package.json** defaults and custom gev scripts to be used as default.

* `npx gev` would open an interactive menu to choose the desired initializer or change user options.

* `npx gev ts coolPackage` would start a TS package without going through the menu above.

# [Changelog](CHANGELOG.md)

# Etc
It could use the [npm initializer](https://docs.npmjs.com/cli/v7/commands/npm-init), like `npm init gev`. But for now I will stick to the `npx gev`. Shorter!

As it accepts scoped package names like `npx gev @yourUsername/coolPackage`, it **is not** possible to specify a path in the package name, like `... deep/dir/coolPackage`.