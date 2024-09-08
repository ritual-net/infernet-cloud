CREATE MIGRATION m15u2sababblbziljti6jrei3swij2iuc77ee3tkg4l772uhbc6poa
    ONTO m1kraussd3bcjmcbfpirab7uveaqwh254dje7jzddx7deo7yoclalq
{
  ALTER TYPE default::Container {
      CREATE PROPERTY rate_limit_num_requests: std::int64;
      CREATE PROPERTY rate_limit_period: std::float32;
  };
};
