CREATE MIGRATION m16xyvgckeyqw6vuzxvurnipxrlnhag6yceixce2tv5xbutpvacc7a
    ONTO m1q55rshkj7ts7j6y6vxrmkkebgap2foui73te4g4dg46nyg223i4a
{
  ALTER SCALAR TYPE default::TerraformAction EXTENDING enum<Init, Plan, Apply, Destroy>;
};
