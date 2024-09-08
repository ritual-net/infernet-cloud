CREATE MIGRATION m1lp6fnzfryrd34whusaudjcib4p5scteafnprgxe6dqkqvw6f2kra
    ONTO m16xyvgckeyqw6vuzxvurnipxrlnhag6yceixce2tv5xbutpvacc7a
{
  ALTER TYPE default::TerraformDeployment {
      CREATE PROPERTY status := (('unhealthy' IF EXISTS (.error) ELSE ('destroyed' IF (.action = default::TerraformAction.Destroy) ELSE ('healthy' IF EXISTS (.tfstate) ELSE 'unknown'))));
  };
  ALTER TYPE default::Cluster {
      ALTER PROPERTY status {
          USING (('updating' IF .locked ELSE (.latest_deployment.status IF EXISTS (.latest_deployment) ELSE 'unknown')));
      };
  };
};
