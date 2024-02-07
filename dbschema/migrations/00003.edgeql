CREATE MIGRATION m1nq5noqfabrycyaj2l277nhywywdcynepkeflu3ecnzrvow2hxfkq
    ONTO m1di4rhc7xcigy7qwjtghylue7igyfry36mest4lwbt2zvkoddd33q
{
  ALTER TYPE default::Cluster {
      CREATE PROPERTY router_ip: std::str;
  };
};
