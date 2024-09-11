CREATE MIGRATION m13swj5736rrqbxmbdtumnznaaa7ryb2e4qh53zma6hbrddrltmxxq
    ONTO m1ec3q72kxv6b3qwgxwj3otzbwdpcdkzsfl67gdu55n2w3wqmwue6a
{
  ALTER TYPE default::Cluster {
      CREATE PROPERTY router: tuple<region: std::str, zone: std::str, machine_type: std::str> {
          SET readonly := true;
      };
  };
};
