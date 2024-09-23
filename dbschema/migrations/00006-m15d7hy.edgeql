CREATE MIGRATION m15d7hyzbh4vpzq4wjoj6qbu3ioc6z2kiatk5qfqiid5p7dpdispsa
    ONTO m1mbqkx6yy4m2a4saqk23xes2zcrgldexc2jdkkjslcpzxhnpqs4qa
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY snapshot_sync: tuple<sleep: std::float32, batch_size: std::int16>;
  };
};
