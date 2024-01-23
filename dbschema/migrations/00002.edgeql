CREATE MIGRATION m1jdi46lxl4mmrcjhoxhh62qwbbb6kzqdjhldsks5ybmd6zrsjhqaa
    ONTO m1dzeupvwnbzkwo6zanrwvfj2dqn2lbx5g3a4nojei27c5h46jxcyq
{
  ALTER TYPE default::AWSCluster {
      DROP PROPERTY ami;
  };
};
