CREATE MIGRATION m1zc5fdhkwhxjwjwmwsslph6ux26gh5wnnh2nxmpfek4gbojg44p5a
    ONTO m15d7hyzbh4vpzq4wjoj6qbu3ioc6z2kiatk5qfqiid5p7dpdispsa
{
  ALTER TYPE default::InfernetNode {
      ALTER PROPERTY snapshot_sync {
          SET default := ((1.0, 200));
      };
  };
};
