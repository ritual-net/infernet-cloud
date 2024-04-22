CREATE MIGRATION m16zzuntahl2wkgrzcpfqcox7caquypwotadm5aire4vz6jlqtbkoa
    ONTO m12owc2vfsgrgv3r74clpzr2gkjzihtyex4tpft5tnhhgghkd24rda
{
  ALTER TYPE default::User {
      ALTER ACCESS POLICY only_owner SET errmessage := 'You do not have access to this user.';
  };
};
