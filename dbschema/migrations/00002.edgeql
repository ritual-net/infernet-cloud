CREATE MIGRATION m1ntfngp3jp7dg6rvddsujssuqta7zzn42yqyfldww2nmaifzsl2ya
    ONTO m1a7erskwy7mn3uz3n2s3v2wpy4s677f7yt2ksd55ri3ldznl6xsnq
{
  ALTER TYPE default::Container {
      ALTER LINK node {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::InfernetNode {
      ALTER LINK cluster {
          ON TARGET DELETE ALLOW;
      };
  };
};
