const {Command} = require('commander')

const program = new Command()

program
  .option('-n, --no-install', 'Don\'t install the packages after setting the template.')
  .arguments('<flavor> [projectName]')
  .description('Effortlessly creates slightly opionated projects boilerplates within a single command', {
    flavor: `What kind of project it should be. Accepted: ${['expo', 'ts'].join(', ')}`,
    projectName: 'How should be named the new project. A new directory will be created and used only if it doesn\'t exists. If undefined or is ".", will use the current directory, if empty.',
  })
  .action((flavorArg, projectNameArg) => {
    console.log(program.opts())
    const [a, b] = program.args;
    console.log(a, typeof b)
  })

program.parse()