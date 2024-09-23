CREATE MIGRATION m1w64lhyi6325mg5wcoioxwnwp3ppsvtdir4zxdfcret5hohpf7nwa
    ONTO m1vaytp2e2cflesvehjrltkpwb5yjwrh2g4jv4vwdrjtdueflnei7q
{
  ALTER TYPE default::Cluster {
      CREATE MULTI PROPERTY terraform_logs: std::json;
  };
};
