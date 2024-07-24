CREATE MIGRATION m144k7wpimzowov2gxz4cu5ge6nsxh3ud2w23ydekmhjldkcwvozpa
    ONTO m1rutrpnt664fat7ws2kisovt5kiajshuxadobz3qpamh37353ejwa
{
  ALTER TYPE default::Cluster {
      CREATE REQUIRED PROPERTY machine_type: std::str {
          SET readonly := true;
          SET REQUIRED USING (<std::str>'');
      };
      CREATE REQUIRED PROPERTY region: std::str {
          SET readonly := true;
          SET REQUIRED USING (<std::str>'');
      };
      CREATE REQUIRED PROPERTY zone: std::str {
          SET readonly := true;
          SET REQUIRED USING (<std::str>'');
      };
  };
  ALTER TYPE default::InfernetNode {
      CREATE REQUIRED PROPERTY machine_type: std::str {
          SET REQUIRED USING (<std::str>'');
      };
      CREATE REQUIRED PROPERTY region: std::str {
          SET REQUIRED USING (<std::str>'');
      };
      CREATE REQUIRED PROPERTY zone: std::str {
          SET REQUIRED USING (<std::str>'');
      };
  };
};
