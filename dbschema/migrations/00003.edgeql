CREATE MIGRATION m1kkgga4khjjqaduu7plbu6jevzokvuo5clzv2y6hn324hpgftvaqq
    ONTO m1jdi46lxl4mmrcjhoxhh62qwbbb6kzqdjhldsks5ybmd6zrsjhqaa
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY provider_id: std::str {
          SET default := '';
      };
  };
};
