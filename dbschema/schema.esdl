module default {
  scalar type CloudProvider extending enum<AWS, GCP>;

  type User {
    required name: str;
    required email: str;
    multi serviceAccounts := .<user[is ServiceAccount];
  }

  type ServiceAccount {
    required credentials: json;
    multi cluster := .<serviceAccount[is Cluster];

    required user: User;
    required provider: CloudProvider;
  }

  type Container {
    required config: json;

    required node: InfernetNode {
      on target delete delete source
    };
  }

  type InfernetNode {
    required config: json;
    containers := .<node[is Container];

    required cluster: Cluster {
      on target delete delete source;
    };
  }

  type Cluster {
    tfstate: str;
    nodes := .<cluster[is InfernetNode];

    required serviceAccount: ServiceAccount;
  }
}

using extension auth;
