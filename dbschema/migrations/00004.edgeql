CREATE MIGRATION m12rinjngxumxu64raira73q4yjuwmwcf2cgsapklst5ryatoiqvza
    ONTO m1kkgga4khjjqaduu7plbu6jevzokvuo5clzv2y6hn324hpgftvaqq
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY provider_id {
          RESET default;
      };
  };
};
