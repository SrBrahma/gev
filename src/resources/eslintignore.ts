export function eslintignoreData() {
  return (
`node_modules/
/lib/
/dist/`
+ '\ncoverage' // jest
  )
}