CREATE MIGRATION m1dvk3virpv7evi6b4orn7evqoiprs23ktmqz6aecsmlkzxwxsvhsq
    ONTO m1zchyjdoghpaxhnqo7kgbckpgqhm77nhtra7fuf4pfau5ltgac6ca
{
  ALTER TYPE default::Cluster {
      ALTER PROPERTY region {
          RESET readonly;
      };
      ALTER PROPERTY zone {
          RESET readonly;
      };
  };
};
