# Changelog


If the change is related to the gev internal workings and files (not the project template), it will have a [gev] preceding the change, to avoid misunderstandings.


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



## 1.2.4 (2021-04-23)

### Changed

* [gev] **typescript** as dep instead of devDep. Will now use `npx tsc --init` instead of `tsc --init`, to allow it to work on machines without TS globally installed.



## 1.2.1~3 (2021-04-23)

### Fixed

* [gev] Changed **genera** to **gev** in package.json name. Whoops!
* [gev] **rimraf** as dep instead of devDep
* [gev] Added the `gev` to `"bin"` in **package.json**
* [gev] Added `#!/usr/bin/env node` to the index start
* [gev] Fixed **rimraf** for current folder on errors, if files were created.



## 1.2.0 (2021-04-23)

### Added

* `major`, `minor` and `patch` scripts.
* `"noUncheckedIndexedAccess": true` to tsconfig
### Changed

* [gev] Renamed package name from **genera** to **gev**. Found it was available by trial and error. Shorter!

### Fixed

* [gev] **gev** version output on error.



## 1.1.0 (2021-04-23)

* General changes, working version