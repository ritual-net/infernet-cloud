CREATE MIGRATION m1sz7qho2gyzhii6y222ofovze46yclzwidal752u3lhxu66qogcea
    ONTO m1ufhbhykhe55bewhkmn4ns6o6zrg4od3vckuf4wxcxwjjsfievbva
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY provider_id: std::str;
  };
};
