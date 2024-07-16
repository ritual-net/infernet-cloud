CREATE MIGRATION m1qahibqjsxc2zpfh5s2psqvjhmbx6k2prfbqqudexr4egfermzpja
    ONTO m1hnag7rkfxf6wrd5orgz5bhulbpi7hxzklwktzwyn5wtejqxbtloq
{
  ALTER TYPE default::TerraformDeployment {
      ALTER PROPERTY status {
          USING (('failed' IF EXISTS (.error) ELSE ('failed' IF ((.action = default::TerraformAction.Apply) AND NOT (EXISTS (.tfstate))) ELSE ('succeeded' IF ((.action = default::TerraformAction.Apply) AND EXISTS (.tfstate)) ELSE 'succeeded'))));
      };
  };
};
