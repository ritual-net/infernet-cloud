CREATE MIGRATION m1hnag7rkfxf6wrd5orgz5bhulbpi7hxzklwktzwyn5wtejqxbtloq
    ONTO m17hatybrltjlkt4fywcq46kdmzso6pia6njqj64rw6ivcweqjmlbq
{
  ALTER TYPE default::TerraformDeployment {
      CREATE PROPERTY command: std::str;
  };
};
