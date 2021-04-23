# genera

Creating every single Typescript project environment is a real pain. Takes lots of minutes, sufferings and procrastinations to leave it functional and in the way I feel confortable to work with. We know how boring it really is.

Also, not knowing if my ones have my latest eslint config also causes some anxiety.

This `npx` package saves me some good hours of life, so I can watch more videos of cute dogs before I die.

Made it for me and my projects, but can also work really well for you. It's fast, simple and good.

# Usage:

`npx genera` to use the current directory as destination and package name (directory must be empty).

or

`npx genera <packageName>` to create a new directory and use it as the package name.

As it accepts scoped package names like `npx genera @yourUsername/coolPackage`, it **is not** possible to specify a path in the package name, like `... deep/dir/coolPackage`.

# It will

* Check if the package name [is valid](https://www.npmjs.com/package/validate-npm-package-name)
* `npm init -y`
* `npm i -D typescript [eslint packages]`
* Use my [`@srbrahma/elint-config`](https://github.com/SrBrahma/eslint-config) I've been configuring through some years
* `rimraf` as dev dep for cross-platform erasing the `dist` dir, in `clean` npm script. It's a common practice.
* `tsc --init` for the latest options
* Change some tsconfigs (source map, declaration files, outDir=dist etc) via uncomment if needed and change (no duplicate properties)
* Create basic .gitignore, .eslintignore
* package.json:
  * Change `main` value to `dist/index.js`
  * Add common `scripts`
  * [Whitelist publish files](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d) with `"files": ["/dist"]`
* Create src/index.ts


# Future

* `--react` and `--react-native` flavors as arguments, for further options to the eslint and tsconfig.

* Add Paypal donate button to the end of READMEs (or as a badge). Money! It could check if I am the npx caller. Else, *maybe* shouldn't be a good idea to add that button with my link.

* Interactive menu to add other badges and the paypal button to the README.

* typedoc support, with markdown output. I hate writing READMEs!

* Allow custom setups. It could be something like `npx genera -u githubUsername`. This could really be a good way for people to have their own environment setup without too much work.

# [Changelog](CHANGELOG.md)

# Etc
It could use the [npm initializer](https://docs.npmjs.com/cli/v7/commands/npm-init), like `npm init genera`. But for now I will stick to the `npx genera`. Shorter!