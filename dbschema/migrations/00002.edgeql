CREATE MIGRATION m16tzmbl7lj3u75kztlej7dhml33nxbuzjylvl5lbkidmkmdt6qbfq
    ONTO m12owc2vfsgrgv3r74clpzr2gkjzihtyex4tpft5tnhhgghkd24rda
{
  ALTER TYPE default::Cluster {
      CREATE PROPERTY gpt_error: std::str;
  };
};
