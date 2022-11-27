export const prepareNewSorting = (sorting, field) => {
  const newSorting = sorting.includes(field)
    ? (sorting.includes(`-${field}`)
      ? [`+${field}`, ...`${sorting}`.split(',').filter(i => i !== `-${field}`)].join(',')
      : [`-${field}`, ...`${sorting}`.split(',').filter(i => i !== `+${field}`)].join(','))
    : [`-${field}`, ...(`${sorting}`.split(',') || [])].join(',')
  return newSorting
}
