const { defaultLocale } = require('./i18n')

const routes = require('next-routes-with-locale')

module.exports = routes({ locale: defaultLocale, hideDefaultLocale: true })
  .add('home', 'en', '{/}?{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/filter/:filter}?{/sorting/:sorting}?{/freespace/:freeSpace}?', 'home')
  .add('home', 'nl', '{/}?{/bladzijde/:page([\\d]+)}?{/per-pagina/:perPage([\\d]+)}?{/filter/:filter}?{/sorteren/:sorting}?{/freespace/:freeSpace}?', 'home')
  // .add('home', 'ja', '{/}?{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/filter/:filter}?{/sorting/:sorting}?{/freespace/:freeSpace}?', 'home')
  // .add('home', 'ko', '{/}?{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/filter/:filter}?{/sorting/:sorting}?{/freespace/:freeSpace}?', 'home')
  // .add('home', 'zh', '{/}?{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/filter/:filter}?{/sorting/:sorting}?{/freespace/:freeSpace}?', 'home')

  .add('node', 'en', '/node/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/sorting/:sorting}?', 'node')
  .add('node', 'nl', '/knooppunt/:id{/bladzijde/:page([\\d]+)}?{/per-pagina/:perPage([\\d]+)}?{/sorting/:sorting}?', 'node')
  // .add('node', 'ja', '/node/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/sorting/:sorting}?', 'node')
  // .add('node', 'ko', '/node/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/sorting/:sorting}?', 'node')
  // .add('node', 'zh', '/node/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?{/sorting/:sorting}?', 'node')

  .add('404', 'en', '/404', '404')
  .add('404', 'nl', '/404', '404')
  // .add('404', 'ja', '/404', '404')
  // .add('404', 'ko', '/404', '404')
  // .add('404', 'zh', '/404', '404')

  // .add('en-providers', '/:locale(en)?/providers', 'providers')
  // .add('ja-providers', '/:locale(ja)/providers', 'providers')
  // .add('ko-providers', '/:locale(ko)/providers', 'providers')
  // .add('nl-providers', '/:locale(nl)/providers', 'providers')
  // .add('zh-providers', '/:locale(zh)/providers', 'providers')

  // .add('en-delegations', '/:locale(en)?/delegations', 'delegations')
  // .add('ja-delegations', '/:locale(ja)/delegations', 'delegations')
  // .add('ko-delegations', '/:locale(ko)/delegations', 'delegations')
  // .add('nl-delegations', '/:locale(nl)/delegations', 'delegations')
  // .add('zh-delegations', '/:locale(zh)/delegations', 'delegations')

  // .add('en-x-chain', '/:locale(en)?/x-chain', 'x-chain')
  // .add('ja-x-chain', '/:locale(ja)/x-chain', 'x-chain')
  // .add('ko-x-chain', '/:locale(ko)/x-chain', 'x-chain')
  // .add('nl-x-chain', '/:locale(nl)/x-chain', 'x-chain')
  // .add('zh-x-chain', '/:locale(zh)/x-chain', 'x-chain')

  // .add('en-c-chain', '/:locale(en)?/c-chain', 'c-chain')
  // .add('ja-c-chain', '/:locale(ja)/c-chain', 'c-chain')
  // .add('ko-c-chain', '/:locale(ko)/c-chain', 'c-chain')
  // .add('nl-c-chain', '/:locale(nl)/c-chain', 'c-chain')
  // .add('zh-c-chain', '/:locale(zh)/c-chain', 'c-chain')

  .add('c-chain', 'en', '/c-chain{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'c-chain')
  .add('c-chain', 'nl', '/c-chain{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'c-chain')

  .add('c-chain/transactions', 'en', '/c-chain/transactions{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'c-chain')
  .add('c-chain/blocks', 'en', '/c-chain/blocks{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'c-chain')
  .add('c-chain/tokens', 'en', '/c-chain/tokens{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'c-chain')

  .add('c-chain/transaction', 'en', '/c-chain/transaction/:id', 'transaction')
  .add('c-chain/transaction', 'nl', '/c-chain/transaction/:id', 'transaction')
  
  .add('c-chain/block', 'en', '/c-chain/block/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'block')
  .add('c-chain/block', 'nl', '/c-chain/block/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'block')

  
  .add('c-chain/token', 'en', '/c-chain/token/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'token')
  .add('c-chain/token', 'nl', '/c-chain/token/:id{/page/:page([\\d]+)}?{/per-page/:perPage([\\d]+)}?', 'token')

  .add('notifier', 'en', '/notifier', 'notifier')
  .add('notifier', 'nl', '/notifier', 'notifier')
  // .add('notifier', 'ja', '/notifier', 'notifier')
  // .add('notifier', 'ko', '/notifier', 'notifier')
  // .add('notifier', 'zh', '/notifier', 'notifier')
