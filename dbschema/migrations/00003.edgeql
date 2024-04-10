CREATE MIGRATION m14sgkleudxvur535yyz6dv7z2xwnxlebwydbfklskxhwz6vabqzca
    ONTO m16zzuntahl2wkgrzcpfqcox7caquypwotadm5aire4vz6jlqtbkoa
{
  CREATE TYPE default::DockerAccount {
      CREATE REQUIRED LINK user: default::User {
          SET readonly := true;
      };
      CREATE ACCESS POLICY only_owner
          ALLOW ALL USING ((.user ?= GLOBAL default::current_user));
      CREATE REQUIRED PROPERTY username: std::str;
      CREATE CONSTRAINT std::exclusive ON ((.username, .user));
      CREATE REQUIRED PROPERTY password: std::str;
  };
};
