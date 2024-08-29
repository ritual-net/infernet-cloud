CREATE MIGRATION m1c7u6uhtybqpwyisnxi363bxucgnoojbponcnw7fxgracgetrmonq
    ONTO m1dj4exrxownobty4nzkzevvqt3xteupg7hjzmlmzagrk47tnl6ooa
{
  ALTER TYPE default::Cluster {
      DROP PROPERTY error;
  };
  ALTER TYPE default::Cluster {
      DROP PROPERTY healthy;
  };
  ALTER TYPE default::Cluster {
      CREATE PROPERTY status := (('updating' IF .locked ELSE ('unhealthy' IF EXISTS (.latest_deployment.error) ELSE ('healthy' IF EXISTS (.latest_deployment.tfstate) ELSE 'unknown'))));
  };
};
