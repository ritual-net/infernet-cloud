CREATE MIGRATION m1mbqkx6yy4m2a4saqk23xes2zcrgldexc2jdkkjslcpzxhnpqs4qa
    ONTO m1cisycbypauv35qa5ddel3gwpo3pkesnjqpqgxmjtmdo3dmodtmaa
{
  ALTER TYPE default::InfernetNode {
      CREATE LINK cluster := (.<nodes[IS default::Cluster]);
  };
};
