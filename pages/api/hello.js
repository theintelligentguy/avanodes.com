// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}


// fetch nodes ips
// curl -X POST --data '{
//   "jsonrpc":"2.0",
//   "id"     :1,
//   "method" :"info.peers"
// }' -H 'content-type:application/json;' https://api.avax.network/ext/info


// https://ipstack.com/product - nodes coordinates from ips


// aggregate data from public indexer

// curl 'https://explorerapi.avax.network/x/transactions/aggregates?startTime=2020-12-13T20:06:13.378Z&endTime=2020-12-14T20:06:13.378Z&assetID=FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z' \
//   -H 'authority: explorerapi.avax.network' \
//   -H 'pragma: no-cache' \
//   -H 'cache-control: no-cache' \
//   -H 'sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"' \
//   -H 'accept: application/json, text/plain, */*' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' \
//   -H 'origin: https://explorer.avax.network' \
//   -H 'sec-fetch-site: same-site' \
//   -H 'sec-fetch-mode: cors' \
//   -H 'sec-fetch-dest: empty' \
//   -H 'referer: https://explorer.avax.network/' \
//   -H 'accept-language: en-US,en;q=0.9,uk;q=0.8,uk-UA;q=0.7,ru-RU;q=0.6,ru;q=0.5' \
//   --compressed


// current supply
// curl 'https://api.avax.network/ext/bc/P' \
//   -H 'authority: api.avax.network' \
//   -H 'pragma: no-cache' \
//   -H 'cache-control: no-cache' \
//   -H 'sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"' \
//   -H 'accept: application/json, text/plain, */*' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' \
//   -H 'content-type: application/json;charset=UTF-8' \
//   -H 'origin: https://explorer.avax.network' \
//   -H 'sec-fetch-site: same-site' \
//   -H 'sec-fetch-mode: cors' \
//   -H 'sec-fetch-dest: empty' \
//   -H 'referer: https://explorer.avax.network/' \
//   -H 'accept-language: en-US,en;q=0.9,uk;q=0.8,uk-UA;q=0.7,ru-RU;q=0.6,ru;q=0.5' \
//   --data-binary '{"id":1,"method":"platform.getCurrentSupply","params":{},"jsonrpc":"2.0"}' \
//   --compressed


// transactions count
// curl 'https://explorerapi.avax.network/x/transactions?sort=timestamp-desc&offset=0&limit=25' \
//   -H 'authority: explorerapi.avax.network' \
//   -H 'pragma: no-cache' \
//   -H 'cache-control: no-cache' \
//   -H 'sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"' \
//   -H 'accept: application/json, text/plain, */*' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' \
//   -H 'origin: https://explorer.avax.network' \
//   -H 'sec-fetch-site: same-site' \
//   -H 'sec-fetch-mode: cors' \
//   -H 'sec-fetch-dest: empty' \
//   -H 'referer: https://explorer.avax.network/' \
//   -H 'accept-language: en-US,en;q=0.9,uk;q=0.8,uk-UA;q=0.7,ru-RU;q=0.6,ru;q=0.5' \
//   --compressed

// last block height
// https://docs.avax.network/build/avalanchego-apis/platform-chain-p-chain-api#platform-getheight

// total current stake
// https://docs.avax.network/build/avalanchego-apis/platform-chain-p-chain-api#platform-gettotalstake

// min avax toekn https://docs.avax.network/#avalanche-avax-token