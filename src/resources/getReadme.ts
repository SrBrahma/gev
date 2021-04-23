// Named getReadme instead of readme so it won't appear as a readme in github.

// Add github stars badge to encourage people to give a star!
// research later https://github.com/matiassingers/awesome-readme

// "Give it a star!" ?

export function getReadmeData(packageName: string): string {
  return (
    `
<h1 align="center">
  <!-- <img src=".logo.png" alt=${packageName}/><br/> -->
  ${packageName}
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
npm install ${packageName}
# or
yarn add ${packageName}
\`\`\`

# Usage

# [Changelog](CHANGELOG.md)`
  );
}

// [![npm](https://img.shields.io/npm/v/react-native-shadow-2)](https://www.npmjs.com/package/react-native-shadow-2)
// [![npm](https://img.shields.io/npm/dt/react-native-shadow-2)](https://www.npmjs.com/package/react-native-shadow-2)