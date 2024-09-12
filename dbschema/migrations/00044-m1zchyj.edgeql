CREATE MIGRATION m1zchyjdoghpaxhnqo7kgbckpgqhm77nhtra7fuf4pfau5ltgac6ca
    ONTO m1dp327htwzp53cpmhd2gmf75zpw2wag4yiw6r7nczwclwbhm622ra
{
  ALTER TYPE default::AWSCluster {
      ALTER PROPERTY region {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
      ALTER PROPERTY zone {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::Cluster {
      ALTER PROPERTY router {
          RESET readonly;
      };
  };
  ALTER TYPE default::GCPCluster {
      ALTER PROPERTY region {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
      ALTER PROPERTY zone {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
};
