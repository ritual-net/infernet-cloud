CREATE MIGRATION m1vaytp2e2cflesvehjrltkpwb5yjwrh2g4jv4vwdrjtdueflnei7q
    ONTO m1ymddqec56gqa4wrscgrhsyc6vbl2rarpmhskgnhescsc27l3lyra
{
  ALTER TYPE default::ContainerTemplate {
      CREATE LINK docker_account: default::DockerAccount;
      CREATE PROPERTY chain_enabled: std::bool;
  };
};
