# Changelog

<!-- # for major version, ## for minor and patch -->
<!--
## 1.0.1 (YYYY-MM-DD)
### Added
*
### Changed
*
### Fixed
*
-->

## 2.1.7 (2021-05-06)

### Changed

* [ts] Added `--respawn --transpile-only` to the **ts-node-dev** in **watch** script.


## 2.1.6 (2021-05-05)

### Added

* [ts] Added **ts-node-dev** for **watch** script. **start** will call **watch**.
* [ts] **rootDir** and **outDir** set in tsconfig.json. I forgot to set them there :~


## 2.1.5 (2021-05-05)

### Fixed

* **.gitignore** wasn't being included in the generated templates. (Really fixed this time!)
* [expo, ts] Await to the now async `applyTemplate`.
* [ts] Added **lint** script. It will `eslint --fix src/**`. It is now run at `deploy` script.


## 2.1.4 (2021-05-05)

### Fixed

* **.gitignore** wasn't being included in the generated templates. (Really fixed this time!)


## 2.1.3 (2021-05-05)

### Added

* [ts] Added the package name validation. I forgot to add it when changed the code in **2.0.0**

### Changed

* [ts] Changed the order of the **devDependencies** and added an empty **dependencies** to the **package.json**. The addition of the **dependencies** is for when the user calls a `npm i`, it isn't added to the end of the package.json.

### Fixed

* **.gitignore** wasn't being included in the generated templates.



## 2.1.2 (2021-04-27)

### Fixed

* [expo] .eslintrc wrong **extends**

## 2.1.0~1 (2021-04-27)

### Added

* **templates** directory, so you can see the generated boilerplate for each flavor. They are programatically updated for each relevant **gev** version. It isn't added in the package.

* [expo] Added `*.env` to **.gitignore**

### Changed

* Faster check of installed global packages (currently for **expo-cli** package, for **expo** flavor)

### Fixed

* `--no-install` option fixed.

* [ts] Fixed `.env` and `.log` in **.gitignore**. `*` was missing.



# 2.0.0~1 (2021-04-25)

### Added

* **`expo`** flavor added

### Changed

* The command has changed from `npx gev [projectName]` to `npx gev <flavor> [projectName]`
* Now creates the boilerplates differently. Instead of creating everything programatically, some files will just be copied. Faster, simpler.
* The shared eslint-config is now `eslint-config-gev`, instead my previous personal `@srbrahma/eslint-config`.
* Code structure had major improvements and changes.
* Lots of minor changes


## 1.2.4 (2021-04-23)

### Changed

* **typescript** as dep instead of devDep. Will now use `npx tsc --init` instead of `tsc --init`, to allow it to work on machines without TS globally installed.



## 1.2.1~3 (2021-04-23)

### Fixed

* Changed **genera** to **gev** in package.json name. Whoops!
* **rimraf** as dep instead of devDep
* Added the `gev` to `"bin"` in **package.json**
* Added `#!/usr/bin/env node` to the index start
* Fixed **rimraf** for current folder on errors, if files were created.



## 1.2.0 (2021-04-23)

### Added

* `major`, `minor` and `patch` scripts.
* `"noUncheckedIndexedAccess": true` to tsconfig
### Changed

* Renamed package name from **genera** to **gev**. Found it was available by trial and error. Shorter!

### Fixed

* **gev** version output on error.



## 1.1.0 (2021-04-23)

* General changes, working version