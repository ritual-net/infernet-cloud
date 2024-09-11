CREATE MIGRATION m1455xs5htqirclxre72jt37fkwb76q5o6dx77ukkkkplr5kvcthoq
    ONTO m1avjffo6znpzo5wqtyr2eehki7kmfdvn4h344hxyu3ip7vm25ulha
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY state {
          USING (SELECT
              ((
                  id := <std::str>std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', (<std::str>default::InfernetNode.cluster@node_index ?? '0'), 'id'),
                  ip := <default::IpAddress>std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', (<std::str>default::InfernetNode.cluster@node_index ?? '0'), 'ip')
              ) IF EXISTS (default::InfernetNode.cluster.latest_deployment.tfstate) ELSE {})
          );
      };
  };
};
