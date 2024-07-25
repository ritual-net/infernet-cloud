CREATE MIGRATION m1apgiif6rj7lwom7mencrbeyxrq4amnkixaaplqmpvzipjam62aya
    ONTO m13swj5736rrqbxmbdtumnznaaa7ryb2e4qh53zma6hbrddrltmxxq
{
  ALTER TYPE default::Cluster {
      DROP PROPERTY deploy_router;
  };
};
