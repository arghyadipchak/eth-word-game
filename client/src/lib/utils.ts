export function truncate(address, front, end) {
  return `${address.slice(0, front)}...${address.slice(-end)}`
}
