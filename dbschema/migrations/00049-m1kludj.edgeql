CREATE MIGRATION m1kludjiohxdlzt5pyierfuqfqpho5gpruhc5avyhqkl7f552dm35a
    ONTO m1gm5sb23dy3hzh2bgqxoi5e3ellqq3aedk4xdhbu3pujg6uuh6bbq
{
  CREATE FUNCTION default::uuid_to_base36(uuid: std::uuid) ->  std::str USING (WITH
      num := 
          <std::int64>std::str_replace(<std::str>uuid, '-', '')
      ,
      base36 := 
          '0123456789abcdefghijklmnopqrstuvwxyz'
      ,
      digits := 
          std::array_agg((FOR i IN std::range_unpack(std::range(0, 25))
          UNION 
              (SELECT
                  (base36)[<std::int64>((num // (36 ^ i)) % 36)]
              )))
  SELECT
      std::to_str(digits, '')
  );
  ALTER TYPE default::Cluster {
      ALTER PROPERTY provider_id {
          USING (('ic-cluster-' ++ default::uuid_to_base36(.id)));
      };
  };
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY provider_id {
          USING (('ic-node-' ++ default::uuid_to_base36(.id)));
      };
  };
};
