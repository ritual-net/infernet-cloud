CREATE MIGRATION m1kraussd3bcjmcbfpirab7uveaqwh254dje7jzddx7deo7yoclalq
    ONTO m1w64lhyi6325mg5wcoioxwnwp3ppsvtdir4zxdfcret5hohpf7nwa
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY coordinator_address {
          RENAME TO registry_address;
      };
  };
};
