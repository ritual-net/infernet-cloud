CREATE MIGRATION m1gm5sb23dy3hzh2bgqxoi5e3ellqq3aedk4xdhbu3pujg6uuh6bbq
    ONTO m15mv36fjk3xw6ok2zx7ullu7hhifjrcoxnbhauisse3pfsc5fvkfq
{
  ALTER TYPE default::Cluster {
      ALTER PROPERTY router {
          SET TYPE tuple<region: std::str, zone: std::str, machine_type: std::str, machine_image: std::str> USING ((
              region := .router.region,
              zone := .router.zone,
              machine_type := .router.machine_type,
              machine_image := ('ami-0b4750268a88e78e0' IF (.service_account.provider = default::CloudProvider.AWS) ELSE 'ubuntu-2004-focal-v20231101')
          ));
      };
  };
};
