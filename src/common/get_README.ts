// Add github stars badge to encourage people to give a star!
// research later https://github.com/matiassingers/awesome-readme
// "Give it a star!" ?

import type { Core } from '../core';


type Badges = {
  prWelcome?: boolean;
  /** Types included */
  typescript?: boolean;
  /** npm package version and downloads/week */
  npm?: boolean;
}

export type get_README_Options = {
  /** All badges default to false. */
  badges?: Badges
}

// Be sure when changing the defaults.
export function get_README(core: Core, options?: get_README_Options): string {

  const projectName = core.consts.projectName;

  function getBadgesString() {
    const badges = options?.badges;
    const badgesStrings = [];
    if (badges?.prWelcome) badgesStrings.push(
      `[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)`,
    );
    if (badges?.typescript) badgesStrings.push(
      `[![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)`,
    );
    if (badges?.npm) badgesStrings.push(...[
      `[![npm](https://img.shields.io/npm/v/${projectName})](https://www.npmjs.com/package/${projectName})`,
      `[![npm](https://img.shields.io/npm/dw/${projectName})](https://www.npmjs.com/package/${projectName})`,
    ]);

    if (!badgesStrings.length)
      return '';
      // Must have an empty line between html tags and markdown.
    return (`<div align="center">\n\n${badgesStrings.join('\n')}\n</div>`);
  }


  return (
    `
<h1 align="center">
  <!-- <img src=".logo.png" alt=${projectName}/><br/> -->
  ${projectName}
</h1>

${getBadgesString()}

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