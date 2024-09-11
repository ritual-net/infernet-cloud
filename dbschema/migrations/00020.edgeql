CREATE MIGRATION m1dj4exrxownobty4nzkzevvqt3xteupg7hjzmlmzagrk47tnl6ooa
    ONTO m1nryq4tv7mws2fur2aucnbcuwzikhmlafadashoqmu7wu5v5ysdfq
{
  CREATE TYPE default::TerraformDeployment {
      CREATE LINK cluster: default::Cluster {
          ON SOURCE DELETE DELETE TARGET;
          SET readonly := true;
      };
      CREATE PROPERTY timestamp: std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE INDEX ON ((.cluster, .timestamp));
      CREATE PROPERTY config: std::json;
      CREATE PROPERTY error: std::str;
      CREATE PROPERTY stderr: array<std::json>;
      CREATE PROPERTY stdout: array<std::json>;
      CREATE PROPERTY tfstate: std::json;
  };
  ALTER TYPE default::Cluster {
      CREATE MULTI LINK deployments := (.<cluster[IS default::TerraformDeployment]);
  };
  ALTER TYPE default::Cluster {
      CREATE LINK latest_deployment := (SELECT
          .deployments ORDER BY
              .timestamp DESC
      LIMIT
          1
      );
  };
  ALTER TYPE default::Cluster {
      DROP PROPERTY terraform_logs;
  };
  ALTER TYPE default::Cluster {
      DROP PROPERTY tfstate;
  };
};
