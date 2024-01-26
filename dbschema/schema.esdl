module default {
  scalar type CloudProvider extending enum<AWS, GCP>;

  type User {
    required name: str;
    required email: str;
  }

  abstract type ServiceAccount {
    required name: str;
    required user: User {
      readonly := true;
    };
    required provider: CloudProvider;
  }

  type GCPServiceAccount extending ServiceAccount {
    required creds: tuple<
      type: str,
      project_id: str,
      private_key_id: str,
      private_key: str,
      client_email: str,
      client_id: str,
      auth_uri: str,
      token_uri: str,
      auth_provider_x509_cert_url: str,
      client_x509_cert_url: str,
      universe_domain: str
    >;
 
    overloaded required provider {
      default := CloudProvider.GCP;
    };
  }

  type AWSServiceAccount extending ServiceAccount {
    required creds: tuple<
      user_name: str,
      access_key_id: str,
      status: str,
      secret_access_key: str,
      create_date: str
    >;

    overloaded required provider {
      default := CloudProvider.AWS;
    };
  }

  type Container {
    required image: str;
    required container_id: str;
    optional description: str;
    required external: bool {
      default := true;
    }
    required allowed_addresses: array<str> {
      default := <array<str>>[];
    }
    required allowed_delegate_addresses: array<str> {
      default := <array<str>>[];
    }
    required allowed_ips: array<str> {
      default := <array<str>>[];
    }
    required command: str {
      default := "";
    }
    required env: json {
      default := <json>{};
    }
    required gpu: bool {
      default := false;
    }

  }

  type InfernetNode {
    required chain_enabled: bool {
      default := false;
    }
    required forward_stats: bool {
      default := true;
    }

    trail_head_blocks: int16 {
      default := 0;
    }
    rpc_url: str {
      default := "";
    }
    coordinator_address: str {
      default := "";
    }
    max_gas_limit: int64 {
      default := 0;
    }
    private_key: str {
      default := "";
    }

    provider_id: str {
      default := "";
    }

    multi containers: Container {
      constraint exclusive;
      on source delete delete target;
    }
  }

  abstract type Cluster {
    required name: str;
    required deploy_router: bool {
      default := false;
    }
    required ip_allow_http: array<str> {
      default := ["0.0.0.0/0"];
    }
    required ip_allow_ssh: array<str> {
      default := ["0.0.0.0/0"];
    }
    required tfstate: str {
      default := "";
    }

    required service_account: ServiceAccount {
      readonly := true;
    };
    multi nodes: InfernetNode {
      constraint exclusive;
      on source delete delete target;
    }
  }

  type GCPCluster extending Cluster {
    required region: str {
      readonly := true;
    }
    required zone: str {
      readonly := true;
    }
    required machine_type: str {
      readonly := true;
    }
  }

  type AWSCluster extending Cluster {
    required region: str {
      readonly := true;
    }
    required machine_type: str {
      readonly := true;
    }
  }
}
