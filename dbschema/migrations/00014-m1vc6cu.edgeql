CREATE MIGRATION m1vc6cudx2zv3sidpcfipvd4xpwmjf7dljrottvxzdny2npon6h2ta
    ONTO m1fzhzdvgduvd63pxvd3tv7gikpymbgnj4le47qzs7qivxts3zvvfa
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY allowed_sim_errors: array<std::str>;
      CREATE PROPERTY payment_address: default::Address;
  };
};
