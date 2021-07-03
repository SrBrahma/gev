import execa from 'execa';
import { flavorsArray } from '../src/typesAndConsts';
import Path from 'path';
import fs from 'fs-extra';


/** Will build, to use the dist code */
export async function generateTemplates(): Promise<void> {

  console.log('Building project before generating templates...');

  const distPath = Path.join(__dirname, '..', 'dist');
  const templatesPath = Path.join(__dirname, '..', 'templates');
  const templatesReadmePath = Path.join(templatesPath, 'README.md');

  // Build
  await fs.emptyDir(distPath);
  await execa('npx', ['tsc'], { cwd: Path.join(__dirname, '..') });

  await fs.emptyDir(templatesPath);

  await fs.writeFile(templatesReadmePath,
    `# Those templates were generated by an automated use of **\`gev\`**,

## so you can see the actual result of each flavor boilerplate.

<br/>

### While you may use those templates directly, it's recommended to generate the desired flavor by the use of the \`gev\` command, so the latest packages are installed and the configurations related to you and your project are used.

<br/>

## Generated at: **${new Date().toUTCString()}**
`);

  // Run from dist each flavor
  for (const flavor of flavorsArray) {
    console.log(`Generating template "${flavor}"...`);
    await execa('node', ['..', flavor, flavor, '--no-install'], { cwd: templatesPath });
    // Remove possible ".git" in the generated template. It would mess pushing it to git and GitHub.
    const gitPath = Path.join(templatesPath, flavor, '.git')
    await fs.remove(gitPath)
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