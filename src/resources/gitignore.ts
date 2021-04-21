export function getGitIgnore() {
  return (
    'node_modules/' // Any node_modules dir
  + '\n/dist/' // Only top level dist dir.
  + '\n/lib/'  // If dev opts to use lib instead of dist.
  + '\n.env'
  + '\n.log'
  + '\ncoverage' // jest
  )
}