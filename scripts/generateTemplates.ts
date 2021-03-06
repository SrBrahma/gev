import { execa } from 'execa';
import Path, { dirname } from 'path';
import fse from 'fs-extra';
import {oraPromise} from 'ora';
import { globby } from 'globby'
import { availableFlavors } from '../src/core/flavors.js'
import { fileURLToPath } from 'url';
import { Program } from '../src/main/consts.js';



const __dirname = dirname(fileURLToPath(import.meta.url));



/** Will build, to use the dist code */
export async function generateTemplates(): Promise<void> {

  const templatesPath = Path.join(__dirname, '..', 'templates');
  const templatesReadmePath = Path.join(templatesPath, 'README.md');

  // Ensure the project is built with latest code.
  await oraPromise(async () => {
    await fse.emptyDir(templatesPath);
    await fse.writeFile(templatesReadmePath, readmeContent);
    await execa('npm', ['run', 'build'], { cwd: Path.join(__dirname, '..') });
  }, 'Building project before generating templates');

  for (const flavor of availableFlavors) {
    await oraPromise(async () => {

      let projectName = flavor;
      // [expo error on expo named project] `Cannot create an app named "expo" because it would conflict with a dependency of the same name.`
      if (['expo'].includes(flavor))
        projectName += '-'
      await execa('node', ['..', '--no-install', flavor, projectName], { cwd: templatesPath });

      // Remove possible ".git" in the generated template. It would mess git-pushing it.
      const gitPaths = await globby('**/.git', {
        onlyFiles: false, cwd: Path.join(templatesPath, projectName), absolute: true
      })
      for (const gitPath of gitPaths)
        await fse.remove(gitPath)

    }, `Generating template "${flavor}"`)
  }
}


generateTemplates().catch(err => {
  let msg;
  if (typeof err === 'object' && err !== null)
    msg = err.message;
  else
    msg = err;
  console.error('Error generating templates:');
  console.error(msg);
  process.exit(1);
});

const readmeContent = `# Those templates were generated by an automated use of **\`gev\`**,

## so you can see the actual result of each flavor boilerplate.

<br/>

### While you may use those templates directly, it's recommended to generate the desired flavor by the use of the \`gev\` command, so the latest packages are installed and the configurations related to you and your project are used.

#### Some flavors, like \`expo\`, may have a '-' at its name ending. Expo, as example, would complain the name conflicted with the dependency with the same name.
<br/>

## Generated at: **${new Date().toUTCString()}**

## Gev version: **${Program.}**
`