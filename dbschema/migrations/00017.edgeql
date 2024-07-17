CREATE MIGRATION m1r7zkkr7wcsdmxdahw3rq45bman2wtej6v23ytpagnhycn2mq2oua
    ONTO m1q4pbboiopqkgedbb36fqu32obocvwndzntyqhcpk652thwt5sw7q
{
  ALTER TYPE default::Container {
      DROP PROPERTY accepted_payments;
  };
  CREATE SCALAR TYPE default::BigIntString EXTENDING std::str {
      CREATE CONSTRAINT std::regexp('^[0]|[1-9][0-9]*$');
  };
};
