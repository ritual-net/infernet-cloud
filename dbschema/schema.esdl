using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id, name }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  scalar type CloudProvider extending enum<AWS, GCP>;

  scalar type Address extending str {
    constraint regexp(r'^0x[[:xdigit:]]{40}$');
  }

  scalar type IpAddress extending str {
    constraint regexp(r'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
  }

  scalar type IpWithAddressMask extending str {
    constraint regexp(r'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/(3[0-2]|[1-2]?[0-9]))?$');
  }

  type User {
    required name: str;
    required email: str;
    required identity: ext::auth::Identity;

    access policy only_owner
      allow all
      using (.id ?= global current_user.id) {
        errmessage := 'You do not have access to this user.'
      };

    access policy signup
      allow insert
  }

  type DockerAccount {
    constraint exclusive on ((.username, .user));

    required username: str;
    required password: str;

    required user: User {
      readonly := true;
    };

    access policy only_owner
      allow all
      using (.user ?= global current_user);
  }

  abstract type ServiceAccount {
    required name: str;
    required user: User {
      readonly := true;
    };
    required provider: CloudProvider;

    constraint exclusive on ((.name, .user));
    access policy only_owner
      allow all
      using (.user ?= global current_user);
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
    allowed_addresses: array<Address>;
    allowed_delegate_addresses: array<Address>;
    allowed_ips: array<IpAddress>;
    command: str;
    env: json;
    required gpu: bool {
      default := false;
    }
    rate_limit_num_requests: int64;
    rate_limit_period: float32;
    accepted_payments: array<tuple<address: Address, amount: bigint>>;
    required generates_proofs: bool {
      default := false;
    }

    access policy only_owner
      allow all
      using (.<containers[is InfernetNode].<nodes[is Cluster].service_account.user ?= global current_user);

    access policy insertion
      allow insert
  }

  type ContainerTemplate extending Container {
    required name: str;
    required user: User {
      readonly := true;
    };

    chain_enabled: bool;
    chain_id: int64;
    docker_account: DockerAccount;

    constraint exclusive on ((.name, .user));
    access policy only_template_owner
      allow all
      using (.user ?= global current_user);
  }

  type InfernetNode {
    required chain_enabled: bool {
      default := false;
    }

    required forward_stats: bool {
      default := true;
    }

    trail_head_blocks: int16;

    rpc_url: str;

    registry_address: Address;

    max_gas_limit: int64;

    private_key: str;

    payment_address: Address;

    allowed_sim_errors: array<str>;

    provider_id: str;

    snapshot_sync_sleep: float32;

    snapshot_sync_batch_size: int16;

    docker_account: DockerAccount;

    cluster := .<nodes[is Cluster];

    multi containers: Container {
      constraint exclusive;
      on source delete delete target;
    }

    access policy only_owner
      allow all
      using (.<nodes[is Cluster].service_account.user ?= global current_user);
  
    access policy insertion
      allow insert
  }

  abstract type Cluster {
    required name: str;
    required deploy_router: bool {
      default := false;
    }
    ip_allow_http: array<IpWithAddressMask>;
    ip_allow_ssh: array<IpWithAddressMask>;
    required healthy: bool {
      default := true;
    }
    required locked: bool {
      default := false;
    }
    tfstate: str;
    multi terraform_logs: json;
    router: tuple<id: str, ip: str>;
    error: str;

    required service_account: ServiceAccount {
      readonly := true;
    };
    multi nodes: InfernetNode {
      constraint exclusive;
      on source delete delete target;
    }

    constraint exclusive on ((.name, .service_account));
    access policy only_owner
      allow all
      using (.service_account.user ?= global current_user);
  }

  type GCPCluster extending Cluster {
    required region: str {
      # e.g. "us-east2"
      readonly := true;
    }
    required zone: str {
      # e.g. "us-east2-a"
      readonly := true;
    }
    required machine_type: str {
      # e.g. "e2-standard-2"
      readonly := true;
    }
  }

  type AWSCluster extending Cluster {
    required region: str {
      # e.g. "us-east-2"
      readonly := true;
    }
    required machine_type: str {
      # e.g. "t2.medium"
      readonly := true;
    }
  }
}
