CREATE MIGRATION m1a7erskwy7mn3uz3n2s3v2wpy4s677f7yt2ksd55ri3ldznl6xsnq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::Cluster {
      CREATE PROPERTY tfstate: std::str;
  };
  CREATE TYPE default::InfernetNode {
      CREATE REQUIRED LINK cluster: default::Cluster;
      CREATE REQUIRED PROPERTY config: std::json;
  };
  ALTER TYPE default::Cluster {
      CREATE LINK nodes := (.<cluster[IS default::InfernetNode]);
  };
  CREATE SCALAR TYPE default::CloudProvider EXTENDING enum<AWS, GCP>;
  CREATE TYPE default::ServiceAccount {
      CREATE REQUIRED PROPERTY credentials: std::json;
      CREATE REQUIRED PROPERTY provider: default::CloudProvider;
  };
  ALTER TYPE default::Cluster {
      CREATE REQUIRED LINK serviceAccount: default::ServiceAccount;
  };
  ALTER TYPE default::ServiceAccount {
      CREATE MULTI LINK cluster := (.<serviceAccount[IS default::Cluster]);
  };
  CREATE TYPE default::Container {
      CREATE REQUIRED LINK node: default::InfernetNode;
      CREATE REQUIRED PROPERTY config: std::json;
  };
  ALTER TYPE default::InfernetNode {
      CREATE LINK containers := (.<node[IS default::Container]);
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::ServiceAccount {
      CREATE REQUIRED LINK user: default::User;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK serviceAccounts := (.<user[IS default::ServiceAccount]);
  };
};
