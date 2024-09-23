CREATE MIGRATION m1e6x7zeluepfdp2pucsvahf6ry2zrlfwjvz422c6pqm3snskjmu4a
    ONTO m1cwhxhtv3fbh755wo63dl6gzqrbddzynjec4r3nkzqhfmzyj3ntda
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY snapshot_sync_starting_sub_id: std::int32;
      CREATE PROPERTY snapshot_sync_sync_period: std::float32;
  };
};
