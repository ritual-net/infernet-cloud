CREATE MIGRATION m1cpzr36gcaxacw6ln4lejgony4kt35ylc2rsernqo632gbfhnnmcq
    ONTO m1hxybonzvyfmoih542avxkixggxbzemq67l4pkndr43yqrxxhcduq
{
  CREATE SCALAR TYPE default::ClusterNodeIndex EXTENDING std::sequence;
  ALTER TYPE default::Cluster {
      ALTER LINK nodes {
          CREATE PROPERTY node_index: default::ClusterNodeIndex {
              CREATE CONSTRAINT std::exclusive;
          };
      };
  };
  ALTER TYPE default::Cluster {
      CREATE PROPERTY router_state := (SELECT
          ((
              id := <std::str>std::json_get(default::Cluster.latest_deployment.tfstate, 'outputs', 'router', 'value', 'id'),
              ip := <default::IpAddress>std::json_get(default::Cluster.latest_deployment.tfstate, 'outputs', 'router', 'value', 'ip')
          ) IF EXISTS (default::Cluster.latest_deployment.tfstate) ELSE {})
      );
  };
  ALTER TYPE default::Cluster {
      DROP PROPERTY router_status;
  };
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY state := (SELECT
          ((
              id := <std::str>std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', <std::str>default::InfernetNode.cluster@node_index, 'id'),
              ip := <default::IpAddress>std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', <std::str>default::InfernetNode.cluster@node_index, 'ip')
          ) IF EXISTS (default::InfernetNode.cluster.latest_deployment.tfstate) ELSE {})
      );
  };
};
