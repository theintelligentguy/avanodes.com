module.exports = {
  defaultRouteParams: {
    common: {
      page: 1,
      perPage: 25,
    },
    home: {
      filter: '',
      sorting: '-max-yield,+fee',
      freeSpace: 0,
    },
    node: {
      sorting: '-started-on',
    }
  }
}
