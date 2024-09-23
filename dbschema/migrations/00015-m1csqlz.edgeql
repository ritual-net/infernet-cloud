CREATE MIGRATION m1csqlzmwvs6whx3rxxrjg5wctb33ypbz5asot62covjqcglpbacoq
    ONTO m1vc6cudx2zv3sidpcfipvd4xpwmjf7dljrottvxzdny2npon6h2ta
{
  ALTER TYPE default::ContainerTemplate {
      CREATE PROPERTY chain_id: std::int64;
  };
};
