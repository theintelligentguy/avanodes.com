export default function numberFormat(number, decimals = 2) {
  return number.toLocaleString(
    'en-US',
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }
  )
}
