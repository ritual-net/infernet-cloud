// npm install @google-cloud/compute
// npm install @types/google-cloud__compute

import compute, { InstancesClient } from '@google-cloud/compute';
import { BaseClient } from "./base";

import { ProviderTypeEnum } from './types';

/**
 * 
 * NOTE to future self.
 * 
 * In AWS deployments, terraform outputs:
    nodes = [
      {
        "id" = "projects/prod-frug/zones/us-east5-a/instances/infernet-0"
        "ip" = "34.162.226.196"
        "name" = "infernet-0"
      },
      {
        "id" = "projects/prod-frug/zones/us-east5-a/instances/infernet-1"
        "ip" = "34.162.108.60"
        "name" = "infernet-1"
      },
    ]

  Here, we need to extract the "name" field, get the "zone" from the Cluster object,
  in db, and get the "project" from GCPServiceAccount.creds. Then we can call:

  GCPClient.startNodes(["infernet-0"], {zone: "us-east5-a", project: "prod-frug"})
  GCPClient.stopNodes(["infernet-0"], {zone: "us-east5-a", project: "prod-frug"})
  GCPClient.getNodesStatus(["infernet-0"], {zone: "us-east5-a", project: "prod-frug"})
 */

interface GoogleCredentials {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

export class GCPClient implements BaseClient {
  client: InstancesClient;

  constructor(credentials: GoogleCredentials) {
    this.client = new compute.InstancesClient({
      projectId: credentials.projectId,
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey,
      },
    });
  }

  type(): ProviderTypeEnum {
    return ProviderTypeEnum.GCP;
  }

  async startNodes(ids: string[], args: object): Promise<void> {
    for (const id of ids) {
      // Start the instance
      await this.client.start({
        ...args,
        instance: id // I think this might have to be gcp name, not id
      });
    }
  }

  async stopNodes(ids: string[], args: object): Promise<void> {
    for (const id of ids) {
      // Stop the instance
      await this.client.stop({
        ...args,
        instance: id // I think this might have to be gcp name, not id
      });
    }
  }

  async getNodesStatus(ids: string[], args: object): Promise<Map<string, any>> {
    const statusMap = new Map<string, any>();
    for (const id of ids) {
      // Get the instance info
      const result = await this.client.get({
        ...args,
        instance: id // I think this might have to be gcp name, not id
      });
      statusMap.set(id, result[0].status);
    }
    return statusMap;
  }
}



async function main() {
  const client = new GCPClient({
    projectId: 'random',
    clientEmail: 'random',
    privateKey: 'random'
  });

  // console.log(await client.startNodes(["infernet-0"], {zone: "us-east5-a", project: "prod-frug"}))
  // console.log(await client.stopNodes(["infernet-0"], {zone: "us-east5-a", project: "prod-frug"}))
  // console.log(await client.getNodesStatus(["infernet-0"], {zone: "us-east5-a", project: "prod-frug"}))

  // 'RUNNING', 'TERMINATED', 'STOPPING'
}
main();
