CREATE MIGRATION m15s32fi42nrzllcpfwi6urhdtfhmjvnw6it3cqr723oma2zfu6wlq
    ONTO m16l2iewezebb6z7a6azcwawqcnvvgmryodjn2lhc4jgzxoxj2rbcq
{
  ALTER TYPE default::Cluster {
      CREATE PROPERTY error: std::str;
  };
};
