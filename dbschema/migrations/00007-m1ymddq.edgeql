CREATE MIGRATION m1ymddqec56gqa4wrscgrhsyc6vbl2rarpmhskgnhescsc27l3lyra
    ONTO m15d7hyzbh4vpzq4wjoj6qbu3ioc6z2kiatk5qfqiid5p7dpdispsa
{
  ALTER TYPE default::InfernetNode {
      DROP PROPERTY snapshot_sync;
  };
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY snapshot_sync_batch_size: std::int16;
  };
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY snapshot_sync_sleep: std::float32;
  };
};
