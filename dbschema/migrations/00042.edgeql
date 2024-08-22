CREATE MIGRATION m1dkpdnodiu7ewjrl6hr4e2vnbvsasvzqykjf5u4fewl2pcbwpdq3q
    ONTO m1dx4r4vcqfldphqlkewjq7rpl22dbpx7zh5x25wph74knjduwu4sq
{
  ALTER TYPE default::TerraformDeployment {
      CREATE PROPERTY tfvars: std::str;
  };
};
