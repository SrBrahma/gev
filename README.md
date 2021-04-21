# @srbrahma/ts

Creating every single Typescript project environment is a real pain. Takes lots of minutes, sufferings and procrastinations to leave it functional and in the way I feel confortable to work with. We know how boring it really is.

Also, at the current time I have like ~7 npm packages. Not knowing which ones have my latest eslint config also causes some anxiety.

This `npx` package saves me some good hours of life, so I can watch more videos of cute dogs before I die.

Made it for me and my projects, but can also work really well for you. It's fast, simple and good.

## Usage:

`npx @srbrahma/ts` to use the current directory as destination and package name (directory must be empty)

or

`npx @srbrahma/ts <packageName>` to create a new directory and use it as the package name

## What it will do

* `npm init -y`
* `npm i -D typescript [eslint packages]`
* Use my really good eslint config i've been configuring through those years (via npm package, can be updated)
* `rimraf` as dev dep for cross-platform erasing the `dist` dir, in `clean` npm script. It's a common thing to do.
* `tsc --init` for the latest options
* Change some tsconfigs (source map, declaration files, outDir=dist etc) via uncomment and change (no duplicate properties)
* Create basic .gitignore, .eslintignore
* package.json:
  * Change `main` to `dist/index.js`
  * Add common `scripts`
  * [Whitelist publish files](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d) with `"files": ["/dist"]`
* Create src/index.ts


## Future

* `--react` and `--react-native` flavors as arguments, for further options to the eslint and tsconfig.

* Add Paypal donate button to the end of READMEs. Money! It could check if I am the npx caller. Else, *maybe* shouldn't be a good idea to add that button.

## [Changelog](CHANGELOG.md)


## Etc
It could use the npm initializer, like `npm init @srbrahma/ts`. but leaving under the npx philosophy allows further customized commands.