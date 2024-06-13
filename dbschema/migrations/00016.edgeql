CREATE MIGRATION m1q4pbboiopqkgedbb36fqu32obocvwndzntyqhcpk652thwt5sw7q
    ONTO m1csqlzmwvs6whx3rxxrjg5wctb33ypbz5asot62covjqcglpbacoq
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY max_gas_limit {
          RESET default;
      };
  };
  CREATE SCALAR TYPE default::Secp256k1PrivateKey EXTENDING std::str {
      CREATE CONSTRAINT std::expression ON ((__subject__ != '0x0000000000000000000000000000000000000000000000000000000000000000'));
      CREATE CONSTRAINT std::regexp('^0x[[:xdigit:]]{64}$');
  };
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY private_key {
          RESET default;
          SET TYPE default::Secp256k1PrivateKey;
      };
      ALTER PROPERTY rpc_url {
          RESET default;
      };
      ALTER PROPERTY trail_head_blocks {
          RESET default;
      };
  };
};
