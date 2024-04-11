CREATE MIGRATION m1cisycbypauv35qa5ddel3gwpo3pkesnjqpqgxmjtmdo3dmodtmaa
    ONTO m14sgkleudxvur535yyz6dv7z2xwnxlebwydbfklskxhwz6vabqzca
{
  ALTER TYPE default::InfernetNode {
      CREATE LINK docker_account: default::DockerAccount;
  };
};
