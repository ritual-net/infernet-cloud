CREATE MIGRATION m1vmw7p667rau2zpaw73i5jwcsqesjfchu22d2lrywfyxncfad7ira
    ONTO m1owa3hl2sybdorv4nkerctvrqi4c6zcjhr2nyren3scf7pnsd4laq
{
  ALTER TYPE default::User {
      DROP ACCESS POLICY only_owner;
  };
};
