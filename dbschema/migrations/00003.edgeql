CREATE MIGRATION m15e4vtw5pzyegm3r3b3kfukdczy5eedp5kszxwj36r4pmgybne4sq
    ONTO m1vmw7p667rau2zpaw73i5jwcsqesjfchu22d2lrywfyxncfad7ira
{
  ALTER TYPE default::User {
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.id ?= (GLOBAL default::current_user).id));
  };
};
