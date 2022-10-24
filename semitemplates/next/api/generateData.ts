// Note this is not acting at the moment as an API,
// but just as a function used in getServerSideProps.
export function generateData({ number }: { number: number }): number[] {
  return [...Array(number)].map((_, i) => i);
}
