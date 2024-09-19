CREATE MIGRATION m1bibwrkamidfkymjaw6737iegz72lkrf4wgs5sedh7ipfuj4khrlq
    ONTO m1kludjiohxdlzt5pyierfuqfqpho5gpruhc5avyhqkl7f552dm35a
{
  ALTER FUNCTION default::uuid_to_base36(uuid: std::uuid) USING (WITH
      num := 
          <std::int64>std::str_trim_start(std::str_replace(<std::str>uuid, '-', ''), '0')
      ,
      base36 := 
          '0123456789abcdefghijklmnopqrstuvwxyz'
      ,
      digits := 
          std::array_agg((FOR i IN std::range_unpack(std::range(0, 25))
          UNION 
              (SELECT
                  (base36)[<std::int64>((num // (36 ^ i)) % 36)]
              )))
  SELECT
      std::to_str(digits, '')
  );
};
