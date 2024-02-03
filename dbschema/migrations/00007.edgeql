CREATE MIGRATION m1l75er3fuaopyzsnmclbzvc2yc4joyxicmazrwka7wuqv4ykzxxuq
    ONTO m1t57bxqbvppcsi5rmdqcv33lqqieh5atshgznx4zalcfnbnhcev3q
{
  ALTER TYPE default::Container {
      CREATE ACCESS POLICY allow_insert
          ALLOW INSERT ;
  };
};
