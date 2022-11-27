import node from "./node";
import nodes from "./nodes";
import stats from "./stats";
import notifierStats from "./notifierStats";
import transaction from './transaction';
import transactions from "./transactions";
import block from './block';
import blocks from "./blocks";
import token from './token';
import tokens from "./tokens";

export const resolvers = {
  Query: {
    stats: stats,
    nodes: nodes,
    node: node,
    notifierStats: notifierStats,
    transaction:transaction,
    transactions:transactions,
    block:block,
    blocks:blocks,
    token:token,
    tokens:tokens,
  }
};
