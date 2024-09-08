CREATE MIGRATION m1dp327htwzp53cpmhd2gmf75zpw2wag4yiw6r7nczwclwbhm622ra
    ONTO m1dkpdnodiu7ewjrl6hr4e2vnbvsasvzqykjf5u4fewl2pcbwpdq3q
{
  ALTER TYPE default::InfernetNode {
      CREATE PROPERTY provider := (.cluster.service_account.provider);
  };
};
