# gev

An lightly opinionated central way to fastly create new projects with a single command.

Creating every single Typescript project environment is a real pain. Takes lots of minutes, sufferings and procrastinations to leave it functional and in the way I feel confortable to work with. We know how boring it really is.

Also, having to manage the **eslint** of each project and not knowing which one I've updated last, also causes some anxiety.

Made it mainly for me, but it's walking towards being a tool to be widely used.

## Currently supports creating:

### **Typescript packages**

### **Expo projects** - I started to use react-native-web for faster and simpler development, and Expo is a nice wrapper.

# Usage:

```bash
npx gev@latest <flavor> # To use the current directory as destination and package name. Directory emptiness will be checked.

# or

npx gev@latest <flavor> <newPackageName> # To create a new directory and use it as the package name. Directory existence will be checked.
```

Current available flavors are: **`ts`**, **`expo`**

This @latest is to ensure you aren't running a old cached version, as I am updating it with some frequency and npm won't always use latest packages on npx. I already have some ideas to avoid writing this @latest.

To supress the npm@7 npx confirmation message, you can use `npx -y gev@latest`.


# It will

## Check [templates directory](./templates) to see what is done for each flavor.

<details><summary><b>Typescript</b></summary>

* Check if the package name [is valid](https://www.npmjs.com/package/validate-npm-package-name)
* `npm init -y` and do some changes on package.json:
  * Set version to 0.1.0, as 1.0.0 on stable release
  * Change `main` value to `dist/index.js`
  * Add common `scripts`
  * [Whitelist publish files](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d) with `"files": ["/dist"]`
* `npm i -D typescript [...eslint packages] rimraf`
* Set the **.eslintrc** and use my [`elint-config-gev`](https://github.com/SrBrahma/eslint-config-gev) I've been configuring through some years
* `rimraf` as dev dep for cross-platform erasing the `dist` dir, in `clean` npm script. Common practice.
* `tsc --init` for the latest options
* Change some tsconfigs (source map, declaration files, outDir=dist, resolveJsonModule etc)
* Create basic .gitignore, .eslintignore
* README.md and CHANGELOG.md with template and some initial infos
* Create src/index.ts

</details>

<br/>

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
* It could use the [npm initializer](https://docs.npmjs.com/cli/v7/commands/npm-init), like `npm init gev`. But for now I will stick to the `npx gev`. Shorter!

* It doesn't currently use templates due to a initial decision. I may change my mind. By programatically creating and changing files, I don't really need to keep the changes up-to-date. If `tsc --init` or the **blank typescript** template of **expo** add something good new to their defaults, I don't have to add them to a template and update it.

  To see how the project files, see examples dir. Well, they are actually templates.

* As it accepts scoped package names like `npx gev @yourUsername/coolPackage`, it **is not** possible to specify a path in the package name, like `... deep/dir/coolPackage`.

* On errors or process exit during the project generation, it will remove any written file.