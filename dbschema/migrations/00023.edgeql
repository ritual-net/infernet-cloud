CREATE MIGRATION m1q55rshkj7ts7j6y6vxrmkkebgap2foui73te4g4dg46nyg223i4a
    ONTO m1d7jl63tszogprntj4qkhfnaglziheyyhw2hg3g2vg3fqtesckk6q
{
  ALTER TYPE default::TerraformDeployment {
      ALTER LINK cluster {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
