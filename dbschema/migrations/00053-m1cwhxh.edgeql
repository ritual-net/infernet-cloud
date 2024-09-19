CREATE MIGRATION m1cwhxhtv3fbh755wo63dl6gzqrbddzynjec4r3nkzqhfmzyj3ntda
    ONTO m1ump3pbjjudbedkwfmxjqj32uqqhnry4lkaaqvv4kh7mo5u6yfqza
{
  ALTER TYPE default::Cluster {
      ALTER PROPERTY provider_id {
          USING (('icc-' ++ default::uuid_to_base36(.id)));
      };
  };
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY provider_id {
          USING (('icn-' ++ default::uuid_to_base36(.id)));
      };
  };
};
