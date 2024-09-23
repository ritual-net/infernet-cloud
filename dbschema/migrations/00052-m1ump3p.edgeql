CREATE MIGRATION m1ump3pbjjudbedkwfmxjqj32uqqhnry4lkaaqvv4kh7mo5u6yfqza
    ONTO m1crtpbogmorvzk26uzlqj5vgubmrdel2yq4ubvyqrl7ydrfa6jsxa
{
  ALTER FUNCTION default::uuid_to_base36(uuid: std::uuid) USING (WITH
      num := 
          <std::bigint>('0x' ++ std::str_trim_start(std::str_replace(<std::str>uuid, '-', ''), '0'))
      ,
      base36 := 
          '0123456789abcdefghijklmnopqrstuvwxyz'
      ,
      digits := 
          std::array_agg((FOR i IN std::range_unpack(std::range(0, 25))
          UNION 
              (SELECT
                  (base36)[<std::int64>((num // (<std::bigint>36 ^ <std::bigint>i)) % 36)]
              )))
  SELECT
      std::to_str(digits, '')
  );
};
