CREATE MIGRATION m1ec3q72kxv6b3qwgxwj3otzbwdpcdkzsfl67gdu55n2w3wqmwue6a
    ONTO m144k7wpimzowov2gxz4cu5ge6nsxh3ud2w23ydekmhjldkcwvozpa
{
  ALTER TYPE default::Cluster {
      ALTER PROPERTY router {
          RENAME TO router_status;
      };
  };
};
