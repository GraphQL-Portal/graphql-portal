/* eslint-disable camelcase */
export default interface RedisConnectionOptions {
  is_cluster?: boolean;
  connection_string?: string;
  cluster_nodes?: string[];
}
