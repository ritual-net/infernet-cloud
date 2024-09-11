CREATE MIGRATION m1dx4r4vcqfldphqlkewjq7rpl22dbpx7zh5x25wph74knjduwu4sq
    ONTO m1reptn72fq3bpzng7qslnqzkm3ssh56u5j7hn6nyzlyizsdxcvaxq
{
  ALTER TYPE default::Cluster {
      CREATE PROPERTY provider_id := (('ic-' ++ <std::str>.id));
  };
};
