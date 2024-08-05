CREATE MIGRATION m1hxybonzvyfmoih542avxkixggxbzemq67l4pkndr43yqrxxhcduq
    ONTO m1apgiif6rj7lwom7mencrbeyxrq4amnkixaaplqmpvzipjam62aya
{
  ALTER TYPE default::AWSCluster {
      ALTER PROPERTY machine_type {
          DROP OWNED;
      };
  };
  ALTER TYPE default::GCPCluster {
      ALTER PROPERTY machine_type {
          DROP OWNED;
      };
  };
  ALTER TYPE default::Cluster {
      DROP PROPERTY machine_type;
  };
};
