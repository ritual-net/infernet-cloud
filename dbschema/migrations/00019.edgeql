CREATE MIGRATION m1nryq4tv7mws2fur2aucnbcuwzikhmlafadashoqmu7wu5v5ysdfq
    ONTO m1bx2m6wafbtn52y6ye4vp4ds37ue3p3ji5hbmcwgt6lwjnzma7pga
{
  ALTER SCALAR TYPE default::IpWithAddressMask RENAME TO default::IpAddressWithMask;
  ALTER TYPE default::Container {
      ALTER PROPERTY allowed_ips {
          SET TYPE array<default::IpAddressWithMask>;
      };
  };
};
