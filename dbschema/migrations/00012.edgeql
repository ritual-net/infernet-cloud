CREATE MIGRATION m12phhu7k3nizo4j5e2oxrk5ovop4xt5miwnsukr6bs3xonj2hpivq
    ONTO m15u2sababblbziljti6jrei3swij2iuc77ee3tkg4l772uhbc6poa
{
  CREATE SCALAR TYPE default::Address EXTENDING std::str {
      CREATE CONSTRAINT std::regexp('^0x[[:xdigit:]]{40}$');
  };
  ALTER TYPE default::Container {
      ALTER PROPERTY allowed_addresses {
          RESET default;
          RESET OPTIONALITY;
          SET TYPE array<default::Address>;
      };
      ALTER PROPERTY allowed_delegate_addresses {
          RESET default;
          RESET OPTIONALITY;
          SET TYPE array<default::Address>;
      };
  };
  CREATE SCALAR TYPE default::IpAddress EXTENDING std::str {
      CREATE CONSTRAINT std::regexp(r'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
  };
  ALTER TYPE default::Container {
      ALTER PROPERTY allowed_ips {
          RESET default;
          RESET OPTIONALITY;
          SET TYPE array<default::IpAddress>;
      };
      ALTER PROPERTY command {
          RESET default;
          RESET OPTIONALITY;
      };
      ALTER PROPERTY env {
          RESET default;
          RESET OPTIONALITY;
      };
  };
  CREATE SCALAR TYPE default::IpWithAddressMask EXTENDING std::str {
      CREATE CONSTRAINT std::regexp(r'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/(3[0-2]|[1-2]?[0-9]))?$');
  };
  ALTER TYPE default::Cluster {
      ALTER PROPERTY ip_allow_http {
          RESET default;
          RESET OPTIONALITY;
          SET TYPE array<default::IpWithAddressMask>;
      };
      ALTER PROPERTY ip_allow_ssh {
          RESET default;
          RESET OPTIONALITY;
          SET TYPE array<default::IpWithAddressMask>;
      };
  };
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY registry_address {
          RESET default;
          SET TYPE default::Address;
      };
  };
};
