CREATE MIGRATION m1reptn72fq3bpzng7qslnqzkm3ssh56u5j7hn6nyzlyizsdxcvaxq
    ONTO m1ylwubsd6rr2cyypbqkbuwzal5lhzqgr7bmubq56kxfchicczepha
{
  ALTER TYPE default::Cluster {
      ALTER PROPERTY router_state {
          USING (WITH
              router := 
                  std::json_get(default::Cluster.latest_deployment.tfstate, 'outputs', 'router', 'value')
          SELECT
              ((
                  id := <std::str>std::json_get(router, 'id'),
                  ip := (<std::str>std::json_get(router, 'ip') ?? '')
              ) IF EXISTS (default::Cluster.latest_deployment.tfstate) ELSE {})
          );
      };
  };
};
