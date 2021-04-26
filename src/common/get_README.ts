// Add github stars badge to encourage people to give a star!
// research later https://github.com/matiassingers/awesome-readme
// "Give it a star!" ?

import type { Core } from '../core';

export function get_README(core: Core): string {
  return (
    `
<h1 align="center">
  <!-- <img src=".logo.png" alt=${core.consts.projectName}/><br/> -->
  ${core.consts.projectName}
</h1>

<div align="center">

  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  [![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)

</div>

<br/>

<div align="center">
  <h3> 🏗 ❗ Work In Progress ❗🛠 </h3>
</div>

<br/>

# Installation
\`\`\`c
npm install ${core.consts.projectName}
# or
yarn add ${core.consts.projectName}
\`\`\`

# Usage

# [Changelog](CHANGELOG.md)`
  );
}

// [![npm](https://img.shields.io/npm/v/react-native-shadow-2)](https://www.npmjs.com/package/react-native-shadow-2)
// [![npm](https://img.shields.io/npm/dt/react-native-shadow-2)](https://www.npmjs.com/package/react-native-shadow-2)