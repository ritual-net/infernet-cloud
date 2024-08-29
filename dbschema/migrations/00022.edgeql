CREATE MIGRATION m1d7jl63tszogprntj4qkhfnaglziheyyhw2hg3g2vg3fqtesckk6q
    ONTO m1c7u6uhtybqpwyisnxi363bxucgnoojbponcnw7fxgracgetrmonq
{
  ALTER TYPE default::TerraformDeployment {
      ALTER LINK cluster {
          SET REQUIRED USING (SELECT
              default::Cluster 
          LIMIT
              1
          );
      };
  };
  CREATE SCALAR TYPE default::TerraformAction EXTENDING enum<Apply, Destroy>;
  ALTER TYPE default::TerraformDeployment {
      CREATE REQUIRED PROPERTY action: default::TerraformAction {
          SET REQUIRED USING (<default::TerraformAction>default::TerraformAction.Apply);
      };
      ALTER PROPERTY timestamp {
          SET REQUIRED USING (<std::datetime>std::datetime_current());
      };
  };
  ALTER TYPE default::Cluster {
      ALTER PROPERTY status {
          USING (('updating' IF .locked ELSE ('unhealthy' IF EXISTS (.latest_deployment.error) ELSE ('destroyed' IF (.latest_deployment.action = default::TerraformAction.Destroy) ELSE ('healthy' IF EXISTS (.latest_deployment.tfstate) ELSE 'unknown')))));
      };
  };
};
