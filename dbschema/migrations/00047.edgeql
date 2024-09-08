CREATE MIGRATION m15mv36fjk3xw6ok2zx7ullu7hhifjrcoxnbhauisse3pfsc5fvkfq
    ONTO m1lg5yptp7fa7uktdwi5n27dhqhum7pn3x23hriaxe76seacxomz3q
{
  ALTER TYPE default::InfernetNode {
      CREATE REQUIRED PROPERTY machine_image: std::str {
          SET REQUIRED USING ((<std::str>'ubuntu-2004-focal-v20231101' IF (.provider = default::CloudProvider.GCP) ELSE 'ami-0b4750268a88e78e0'));
      };
  };
};
