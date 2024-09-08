CREATE MIGRATION m1ylwubsd6rr2cyypbqkbuwzal5lhzqgr7bmubq56kxfchicczepha
    ONTO m1yacnahkj43ycb466jsczzdyquqjveh2exxiyzrbrbk762yxpl2zq
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY state {
          USING (WITH
              node := 
                  (SELECT
                      std::json_get(default::InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', default::InfernetNode.provider_id)
                  )
          SELECT
              ((
                  id := <std::str>std::json_get(node, 'id'),
                  ip := (<std::str>std::json_get(node, 'ip') ?? '')
              ) IF EXISTS (default::InfernetNode.cluster.latest_deployment.tfstate) ELSE {})
          );
      };
  };
};
