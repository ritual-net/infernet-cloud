CREATE MIGRATION m1yacnahkj43ycb466jsczzdyquqjveh2exxiyzrbrbk762yxpl2zq
    ONTO m1455xs5htqirclxre72jt37fkwb76q5o6dx77ukkkkplr5kvcthoq
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY provider_id {
          USING (('infernet-node-' ++ <std::str>.id));
      };
      ALTER PROPERTY state {
          USING (SELECT
              ((
                  id := <std::str>std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', default::InfernetNode.provider_id, 'id'),
                  ip := <default::IpAddress>std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', default::InfernetNode.provider_id, 'ip')
              ) IF EXISTS (default::InfernetNode.cluster.latest_deployment.tfstate) ELSE {})
          );
      };
  };
  ALTER TYPE default::Cluster {
      ALTER LINK nodes {
          DROP PROPERTY node_index;
      };
  };
  DROP SCALAR TYPE default::ClusterNodeIndex;
};
