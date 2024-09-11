CREATE MIGRATION m17hatybrltjlkt4fywcq46kdmzso6pia6njqj64rw6ivcweqjmlbq
    ONTO m1lp6fnzfryrd34whusaudjcib4p5scteafnprgxe6dqkqvw6f2kra
{
  ALTER TYPE default::TerraformDeployment {
      ALTER PROPERTY status {
          USING (('failed' IF EXISTS (.error) ELSE ('succeeded' IF EXISTS (.tfstate) ELSE 'unknown')));
      };
  };
  ALTER TYPE default::Cluster {
      ALTER PROPERTY status {
          USING (('updating' IF .locked ELSE ('unhealthy' IF (EXISTS (.latest_deployment) AND (.latest_deployment.status = 'failed')) ELSE ('destroyed' IF ((EXISTS (.latest_deployment) AND (.latest_deployment.status = 'succeeded')) AND (.latest_deployment.action = default::TerraformAction.Destroy)) ELSE ('healthy' IF (EXISTS (.latest_deployment) AND (.latest_deployment.status = 'succeeded')) ELSE 'unknown')))));
      };
  };
};
