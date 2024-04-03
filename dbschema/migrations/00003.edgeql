CREATE MIGRATION m13sfh2apbrlcnkfaple62w73ggakjidzxfqzuy5yijy6zleaucmea
    ONTO m16zzuntahl2wkgrzcpfqcox7caquypwotadm5aire4vz6jlqtbkoa
{
  ALTER TYPE default::User {
      DROP ACCESS POLICY only_owner;
      DROP ACCESS POLICY signup;
  };
};
