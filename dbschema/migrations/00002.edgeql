CREATE MIGRATION m1di4rhc7xcigy7qwjtghylue7igyfry36mest4lwbt2zvkoddd33q
    ONTO m1bybnr4paioo673pwrlzjyxl734exryj7x7oi7owg2ou3366watwq
{
  ALTER TYPE default::Cluster {
      DROP PROPERTY router_ip;
  };
};
