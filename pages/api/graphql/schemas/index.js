import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Delegator {
    nodeID: String
    txID: String
    startTime: Float
    endTime: Float
    stakeAmount: Float
    rewardOwner: String
    potentialReward: Float
  }

  type Delegators {
    items: [Delegator]
    pagination: Pagination
    totalStaked: Float
  }

  type Node {
    nodeID: ID
    txID: String
    startTime: Float
    endTime: Float
    stakeAmount: Float
    potentialReward: Float
    rewardOwner: String
    delegators: Delegators
    isPartner: Boolean
    isSponsored: Boolean
    delegationFee: Float
    uptime: String
    connected: Boolean
    country_code: String
    latitude: Float
    longitude: Float
    country_flag: String
    maxYield: Float
    totalStacked: Float
    leftToStack: Float
    stackedPercent: Float
    leftToStackPercent: Float
    networkShare: Float
    grossRewards: Float
    netRewards: Float
    uptimePercent: String
    version: String
    publicIP: String
    country: String
    city: String
  }

  type Stats {
    totalNodes: Int
    totalTransactions: Int
    totalProviders: Int
    totalDelegations: Int
    totalBlocks: Int
    totalParticipation: Float
  }

  type NotifierStats {
    users: Int
    total: Int
  }

  scalar Date

  type Transaction {
    transactionID:String,
    from: String,
    to:String,
    age:Float,
    avax_amount:Float,
    status:String,
    createdAt:Date
  }
  
  type Block {
    blockID: String,
    height: Float,
    age: Float,
    createdAt: Date,
    transactions: Float,
    total_burned: Float,
    volume: Float,
    size: Float,
    gasUsed:Float,
    gasTotal:Float,
  }
  
  type Token {
    name:String,
    tokenID: String,
    createdAt: Date,
    supply_amount:Float,
    supply_unit:String
  }

  input NodesFilter {
    filter: String
    freeSpace: Int
    maxYield: Float
    page: Int
    perPage: Int
    sorting: String,
  }

  input TransactionsFilter {
    page:Int
    perPage:Int
  }
  
  input BlocksFilter {
    page:Int
    perPage:Int
  }
  
  input TokensFilter {
    page:Int
    perPage:Int
  }

  input NodeFilter {
    nodeID: ID!
    page: Int
    perPage: Int
    sorting: String
  }

  input TransactionFilter {
    transactionID: String!
  }
  
  input BlockFilter {
    blockID: String!
  }
  
  input TokenFilter {
    tokenID: String!
  }

  type Pagination {
    page: Int
    perPage: Int
    count: Int
  }

  type NodesResponse {
    items: [Node]
    pagination: Pagination
  }

  type TransactionsResponse {
    items: [Transaction]
    pagination: Pagination
  }
  
  type BlocksResponse {
    items: [Block]
    pagination: Pagination
  }
  
  type TokensResponse {
    items: [Token]
    pagination: Pagination
  }

  type Query {
    stats: Stats!
    notifierStats: NotifierStats!
    nodes(filter: NodesFilter!): NodesResponse!
    node(filter: NodeFilter!): Node!
    transaction(filter: TransactionFilter!): Transaction!
    transactions(filter:TransactionsFilter!):TransactionsResponse!
    block(filter: BlockFilter!): Block!
    blocks(filter:BlocksFilter!):BlocksResponse!
    token(filter: TokenFilter!): Token!
    tokens(filter:TokensFilter!):TokensResponse!
  }`
