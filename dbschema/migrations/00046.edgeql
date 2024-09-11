CREATE MIGRATION m1lg5yptp7fa7uktdwi5n27dhqhum7pn3x23hriaxe76seacxomz3q
    ONTO m1dvk3virpv7evi6b4orn7evqoiprs23ktmqz6aecsmlkzxwxsvhsq
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY chain_id: std::int64;
  };
};
