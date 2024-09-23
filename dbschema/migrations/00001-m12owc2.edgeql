CREATE MIGRATION m12owc2vfsgrgv3r74clpzr2gkjzihtyex4tpft5tnhhgghkd24rda
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE ACCESS POLICY signup
          ALLOW INSERT ;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id,
          name
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE TYPE default::Container {
      CREATE REQUIRED PROPERTY allowed_addresses: array<std::str> {
          SET default := (<array<std::str>>[]);
      };
      CREATE REQUIRED PROPERTY allowed_delegate_addresses: array<std::str> {
          SET default := (<array<std::str>>[]);
      };
      CREATE REQUIRED PROPERTY allowed_ips: array<std::str> {
          SET default := (<array<std::str>>[]);
      };
      CREATE REQUIRED PROPERTY command: std::str {
          SET default := '';
      };
      CREATE REQUIRED PROPERTY container_id: std::str;
      CREATE OPTIONAL PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY env: std::json {
          SET default := (<std::json>{});
      };
      CREATE REQUIRED PROPERTY external: std::bool {
          SET default := true;
      };
      CREATE REQUIRED PROPERTY gpu: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY image: std::str;
      CREATE ACCESS POLICY insertion
          ALLOW INSERT ;
  };
  CREATE TYPE default::InfernetNode {
      CREATE MULTI LINK containers: default::Container {
          ON SOURCE DELETE DELETE TARGET;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE ACCESS POLICY insertion
          ALLOW INSERT ;
      CREATE REQUIRED PROPERTY chain_enabled: std::bool {
          SET default := false;
      };
      CREATE PROPERTY coordinator_address: std::str {
          SET default := '';
      };
      CREATE REQUIRED PROPERTY forward_stats: std::bool {
          SET default := true;
      };
      CREATE PROPERTY max_gas_limit: std::int64 {
          SET default := 0;
      };
      CREATE PROPERTY private_key: std::str {
          SET default := '';
      };
      CREATE PROPERTY provider_id: std::str;
      CREATE PROPERTY rpc_url: std::str {
          SET default := '';
      };
      CREATE PROPERTY trail_head_blocks: std::int16 {
          SET default := 0;
      };
  };
  CREATE SCALAR TYPE default::CloudProvider EXTENDING enum<AWS, GCP>;
  CREATE ABSTRACT TYPE default::ServiceAccount {
      CREATE REQUIRED LINK user: default::User {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY provider: default::CloudProvider;
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.user ?= GLOBAL default::current_user));
      CREATE CONSTRAINT std::exclusive ON ((.name, .user));
  };
  CREATE ABSTRACT TYPE default::Cluster {
      CREATE MULTI LINK nodes: default::InfernetNode {
          ON SOURCE DELETE DELETE TARGET;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED LINK service_account: default::ServiceAccount {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY deploy_router: std::bool {
          SET default := false;
      };
      CREATE PROPERTY error: std::str;
      CREATE REQUIRED PROPERTY healthy: std::bool {
          SET default := true;
      };
      CREATE REQUIRED PROPERTY ip_allow_http: array<std::str> {
          SET default := (['0.0.0.0/0']);
      };
      CREATE REQUIRED PROPERTY ip_allow_ssh: array<std::str> {
          SET default := (['0.0.0.0/0']);
      };
      CREATE REQUIRED PROPERTY locked: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY router: tuple<id: std::str, ip: std::str>;
      CREATE PROPERTY tfstate: std::str;
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.service_account.user ?= GLOBAL default::current_user));
      CREATE CONSTRAINT std::exclusive ON ((.name, .service_account));
  };
  CREATE TYPE default::AWSCluster EXTENDING default::Cluster {
      CREATE REQUIRED PROPERTY machine_type: std::str {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY region: std::str {
          SET readonly := true;
      };
  };
  CREATE TYPE default::AWSServiceAccount EXTENDING default::ServiceAccount {
      CREATE REQUIRED PROPERTY creds: tuple<user_name: std::str, access_key_id: std::str, status: std::str, secret_access_key: std::str, create_date: std::str>;
      ALTER PROPERTY provider {
          SET default := (default::CloudProvider.AWS);
          SET OWNED;
          SET REQUIRED;
      };
  };
  ALTER TYPE default::Container {
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.<containers[IS default::InfernetNode].<nodes[IS default::Cluster].service_account.user ?= GLOBAL default::current_user));
  };
  CREATE TYPE default::ContainerTemplate EXTENDING default::Container {
      CREATE REQUIRED LINK user: default::User {
          SET readonly := true;
      };
      CREATE ACCESS POLICY only_template_owner
          ALLOW ALL USING ((.user ?= GLOBAL default::current_user));
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE CONSTRAINT std::exclusive ON ((.name, .user));
  };
  CREATE TYPE default::GCPCluster EXTENDING default::Cluster {
      CREATE REQUIRED PROPERTY machine_type: std::str {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY region: std::str {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY zone: std::str {
          SET readonly := true;
      };
  };
  CREATE TYPE default::GCPServiceAccount EXTENDING default::ServiceAccount {
      CREATE REQUIRED PROPERTY creds: tuple<type: std::str, project_id: std::str, private_key_id: std::str, private_key: std::str, client_email: std::str, client_id: std::str, auth_uri: std::str, token_uri: std::str, auth_provider_x509_cert_url: std::str, client_x509_cert_url: std::str, universe_domain: std::str>;
      ALTER PROPERTY provider {
          SET default := (default::CloudProvider.GCP);
          SET OWNED;
          SET REQUIRED;
      };
  };
  ALTER TYPE default::InfernetNode {
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.<nodes[IS default::Cluster].service_account.user ?= GLOBAL default::current_user));
  };
  ALTER TYPE default::User {
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.id ?= (GLOBAL default::current_user).id));
  };
};
