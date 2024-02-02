CREATE MIGRATION m1t57bxqbvppcsi5rmdqcv33lqqieh5atshgznx4zalcfnbnhcev3q
    ONTO m1ko4z7j2nmkcihhxk6eu5ztrpkqcwa6errynubdfb3yvsaeopcr2a
{
  ALTER TYPE default::Cluster {
      CREATE PROPERTY router_ip: std::str;
  };
  ALTER TYPE default::InfernetNode {
      CREATE ACCESS POLICY allow_insert
          ALLOW INSERT ;
  };
};
