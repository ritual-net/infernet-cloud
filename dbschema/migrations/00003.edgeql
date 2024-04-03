CREATE MIGRATION m155nihl5lv24yq356a3jxf2nlblcfl6bysy75mpkxzy45fgc3ut7q
    ONTO m1rz34j7724zpfytmpljhkcjqnfqe76wt3zbiadjt7pokbskpft44a
{
  ALTER TYPE default::User {
      ALTER ACCESS POLICY only_owner SET errmessage := 'You do not have access to this user.';
  };
};
