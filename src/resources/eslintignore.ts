export function eslintignoreData(): string {
  return (
    `node_modules/
/lib/
/dist/`
+ '\ncoverage' // jest
+ '\n.eslintrc.js' // Else error will be throw when reading the .eslintrc.js. https://stackoverflow.com/a/66260842/10247962
  );
}