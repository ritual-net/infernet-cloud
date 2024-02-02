CREATE MIGRATION m1gn4icurtyvybl5rghulgp7zax3omejuh7wgrromlcqgkdrmnu26q
    ONTO m15e4vtw5pzyegm3r3b3kfukdczy5eedp5kszxwj36r4pmgybne4sq
{
  ALTER TYPE default::User {
      CREATE ACCESS POLICY allow_insert
          ALLOW INSERT ;
  };
};
