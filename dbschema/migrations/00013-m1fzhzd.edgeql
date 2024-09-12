CREATE MIGRATION m1fzhzdvgduvd63pxvd3tv7gikpymbgnj4le47qzs7qivxts3zvvfa
    ONTO m12phhu7k3nizo4j5e2oxrk5ovop4xt5miwnsukr6bs3xonj2hpivq
{
  ALTER TYPE default::Container {
      CREATE PROPERTY accepted_payments: array<tuple<address: default::Address, amount: std::bigint>>;
      CREATE REQUIRED PROPERTY generates_proofs: std::bool {
          SET default := false;
      };
  };
};
