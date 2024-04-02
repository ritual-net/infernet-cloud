CREATE MIGRATION m1rz34j7724zpfytmpljhkcjqnfqe76wt3zbiadjt7pokbskpft44a
    ONTO m12owc2vfsgrgv3r74clpzr2gkjzihtyex4tpft5tnhhgghkd24rda
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY identity_id: std::uuid {
          SET REQUIRED USING (<std::uuid>{});
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER LINK identity {
          USING (SELECT
              ext::auth::Identity
          FILTER
              (ext::auth::Identity.id = default::User.identity_id)
          );
          RESET OPTIONALITY;
      };
      ALTER PROPERTY email {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
