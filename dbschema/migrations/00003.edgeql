CREATE MIGRATION m1ufhbhykhe55bewhkmn4ns6o6zrg4od3vckuf4wxcxwjjsfievbva
    ONTO m1jdi46lxl4mmrcjhoxhh62qwbbb6kzqdjhldsks5ybmd6zrsjhqaa
{
  ALTER TYPE default::AWSServiceAccount {
      ALTER PROPERTY provider {
          SET REQUIRED;
      };
  };
  ALTER TYPE default::GCPServiceAccount {
      ALTER PROPERTY provider {
          SET REQUIRED;
      };
  };
};
