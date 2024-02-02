CREATE MIGRATION m1ko4z7j2nmkcihhxk6eu5ztrpkqcwa6errynubdfb3yvsaeopcr2a
    ONTO m1gn4icurtyvybl5rghulgp7zax3omejuh7wgrromlcqgkdrmnu26q
{
  ALTER TYPE default::User {
      DROP ACCESS POLICY allow_insert;
      DROP ACCESS POLICY only_owner;
  };
};
