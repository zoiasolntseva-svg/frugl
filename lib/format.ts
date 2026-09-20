export function currency(n: number) {
  return `R${n.toFixed(2)}`;
}

/** Trim to at most two decimals without trailing zeros (0.10 -> "0.1"). */
export function formatAmount(n: number) {
  return `${Number(n.toFixed(2))}`;
}
