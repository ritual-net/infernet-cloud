CREATE MIGRATION m1rutrpnt664fat7ws2kisovt5kiajshuxadobz3qpamh37353ejwa
    ONTO m1qahibqjsxc2zpfh5s2psqvjhmbx6k2prfbqqudexr4egfermzpja
{
  ALTER TYPE default::AWSCluster {
      CREATE REQUIRED PROPERTY zone: std::str {
          SET readonly := true;
          SET REQUIRED USING (<std::str>'');
      };
  };
};
