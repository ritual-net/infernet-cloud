CREATE MIGRATION m1bx2m6wafbtn52y6ye4vp4ds37ue3p3ji5hbmcwgt6lwjnzma7pga
    ONTO m1r7zkkr7wcsdmxdahw3rq45bman2wtej6v23ytpagnhycn2mq2oua
{
  ALTER TYPE default::Container {
      CREATE PROPERTY accepted_payments: array<tuple<address: default::Address, amount: default::BigIntString>>;
  };
};
