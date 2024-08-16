CREATE MIGRATION m1avjffo6znpzo5wqtyr2eehki7kmfdvn4h344hxyu3ip7vm25ulha
    ONTO m1cpzr36gcaxacw6ln4lejgony4kt35ylc2rsernqo632gbfhnnmcq
{
  ALTER TYPE default::Cluster {
      ALTER LINK nodes {
          ALTER PROPERTY node_index {
              DROP CONSTRAINT std::exclusive;
          };
      };
  };
};
