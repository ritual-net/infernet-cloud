CREATE MIGRATION m1qlreusb3oxaosnkt5im777v6om5ba4xbzw6t52llzuo2bwhmqchq
    ONTO m1ntfngp3jp7dg6rvddsujssuqta7zzn42yqyfldww2nmaifzsl2ya
{
  ALTER TYPE default::Container {
      ALTER LINK node {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::InfernetNode {
      ALTER LINK cluster {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
