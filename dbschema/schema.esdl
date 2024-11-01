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

  scalar type Secp256k1PrivateKey extending str {
    constraint regexp(r'^0x[[:xdigit:]]{64}$');
    constraint expression on (
      __subject__ != '0x0000000000000000000000000000000000000000000000000000000000000000'
    );
  }

  scalar type IpAddress extending str {
    constraint regexp(r'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
  }

  scalar type IpAddressWithMask extending str {
    constraint regexp(r'^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/(3[0-2]|[1-2]?[0-9]))?$');
  }

  scalar type BigIntString extending str {
    constraint regexp(r'^[0]|[1-9][0-9]*$');
  }

  function uuid_to_base36(uuid: uuid) -> str {
    using (
      WITH
        num := <bigint>('0x' ++ str_trim_start(str_replace(<str>uuid, '-', ''), '0')),
        base36 := '0123456789abcdefghijklmnopqrstuvwxyz',
        digits := array_agg((
          for i in range_unpack(range(0, 25))
          union (
            select base36[<int64>((num // (<bigint>36 ^ <bigint>i)) % 36)]
          )
        ))
      SELECT
        to_str(digits, '')
    );
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
    allowed_ips: array<IpAddressWithMask>;
    command: str;
    env: json;
    required gpu: bool {
      default := false;
    }
    rate_limit_num_requests: int64;
    rate_limit_period: float32;
    # accepted_payments: array<tuple<address: Address, amount: bigint>>;
    accepted_payments: array<tuple<address: Address, amount: BigIntString>>;
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
    cluster := .<nodes[is Cluster];

    required region: str {
      # default := .cluster.region;
    }

    required zone: str {
      # default := .cluster.zone;
    }

    required machine_type: str;

    required machine_image: str;

    required chain_enabled: bool {
      default := false;
    }

    required forward_stats: bool {
      default := true;
    }

    trail_head_blocks: int16;

    rpc_url: str;

    chain_id: int64;

    registry_address: Address;

    max_gas_limit: int64;

    private_key: Secp256k1PrivateKey;

    payment_address: Address;

    allowed_sim_errors: array<str>;

    snapshot_sync_sleep: float32;

    snapshot_sync_batch_size: int16;

		snapshot_sync_starting_sub_id: int32;

		snapshot_sync_sync_period: float32;

    docker_account: DockerAccount;

    multi containers: Container {
      constraint exclusive;
      on source delete delete target;
    }

    provider := (
      .cluster.service_account.provider
    );

    provider_id := 'icn-' ++ uuid_to_base36(.id);

    state := (
      with node := (
        select json_get(InfernetNode.cluster.latest_deployment.tfstate, 'outputs', 'nodes', 'value', InfernetNode.provider_id)
      )
      select (
        id := <str>json_get(node, 'id'),
        ip := <str>json_get(node, 'ip') ?? ''
        # ip := <IpAddress>json_get(node, 'ip')
      )
      if exists(InfernetNode.cluster.latest_deployment.tfstate)
      else {}
    );

    access policy only_owner
      allow all
      using (.<nodes[is Cluster].service_account.user ?= global current_user);
  
    access policy insertion
      allow insert
  }

  abstract type Cluster {
    required name: str;

    required service_account: ServiceAccount {
      readonly := true;
    };

    required region: str;

    required zone: str;

    ip_allow_http: array<IpAddressWithMask>;

    ip_allow_ssh: array<IpAddressWithMask>;

    router: tuple<region: str, zone: str, machine_type: str, machine_image: str>;

    multi nodes: InfernetNode {
      constraint exclusive;
      on source delete delete target;
    }

    multi deployments := .<cluster[is TerraformDeployment];
    latest_deployment := (
      select .deployments
      order by .timestamp desc
      limit 1
    );

    required locked: bool {
      default := false;
    }

    provider_id := 'icc-' ++ uuid_to_base36(.id);

    status := (
      'updating' if .locked else
      'unhealthy' if exists(.latest_deployment) and .latest_deployment.status = 'failed' else
      'destroyed' if exists(.latest_deployment) and .latest_deployment.status = 'succeeded' and .latest_deployment.action = TerraformAction.Destroy else
      'healthy' if exists(.latest_deployment) and .latest_deployment.status = 'succeeded' else
      'unknown'
    );

    router_state := (
      with router := json_get(Cluster.latest_deployment.tfstate, 'outputs', 'router', 'value')
      select (
        id := <str>json_get(router, 'id'),
        ip := <str>json_get(router, 'ip') ?? ''
        # ip := <IpAddress>json_get(router_data, 'ip')
      )
      if exists(Cluster.latest_deployment.tfstate)
      else {}
    );

    constraint exclusive on ((.name, .service_account));
    access policy only_owner
      allow all
      using (.service_account.user ?= global current_user);
  }

  type GCPCluster extending Cluster {
    # e.g. "us-east2"
    # overloaded required region: str;

    # e.g. "us-east2-a"
    # overloaded required zone: str;
  }

  type AWSCluster extending Cluster {
    # e.g. "us-east-2"
    # overloaded required region: str;

    # e.g. "us-east-2a"
    # overloaded required zone: str;
  }

  type TerraformDeployment {
    index on ((.cluster, .timestamp));

    status := (
      'failed' if exists(.error) else
      'failed' if(.action = TerraformAction.Apply and not exists(.tfstate)) else
      'succeeded' if(.action = TerraformAction.Apply and exists(.tfstate)) else
      'succeeded'
    );

    required action: TerraformAction;

    required timestamp: datetime {
      readonly := true;
      default := std::datetime_current();
    }

    required cluster: Cluster {
      readonly := true;
      on target delete delete source;
    }

    config: json;
    command: str;
    tfvars: str;
    error: str;
    tfstate: json;
    stdout: array<json>;
    stderr: array<json>;
  }

  scalar type TerraformAction extending enum<
    Init,
    Plan,
    Apply,
    Destroy
  >;
}
