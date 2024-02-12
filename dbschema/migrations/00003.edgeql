CREATE MIGRATION m1auquduvcp6xj5g2xsafocvsgunqixzqimwvngij3fwort3e4j6za
    ONTO m15s32fi42nrzllcpfwi6urhdtfhmjvnw6it3cqr723oma2zfu6wlq
{
  CREATE TYPE default::ContainerTemplate EXTENDING default::Container {
      CREATE REQUIRED LINK user: default::User {
          SET readonly := true;
      };
      CREATE ACCESS POLICY only_template_owner
          ALLOW ALL USING ((.user ?= GLOBAL default::current_user));
      CREATE REQUIRED PROPERTY name: std::str;
  };
};
