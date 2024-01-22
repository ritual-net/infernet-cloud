import { test } from 'vitest'
import { GCP, AWS } from '$structs/cloud'
import { GET as getProviderInfo } from "$api/providers/[provider]/+server"
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config();

test("GCP fetching works.", async () => {
    const gcp = new GCP();
    const credentials = JSON.parse(fs.readFileSync(path.resolve(process.env.GCLOUD_CREDENTIALS_FILE), 'utf8'));
    await gcp.auth(credentials);
    console.log("Regions:", await gcp.getRegions());
    console.log("Zones:", await gcp.getZones("asia-east2"));
    console.log("Machines:", await gcp.getMachines("asia-east2"));
}, { timeout: 10000 });

test("AWS fetching works.", async () => {
    const aws = new AWS();
    await aws.auth({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    console.log("Regions:", await aws.getRegions());
    console.log("Zones:", await aws.getZones("ap-south-1"));
    console.log("Machines:", await aws.getMachines("ap-south-1"));
}, { timeout: 10000 });


/*
test("Get provider info fetching works.", async () => {
    console.log("Regions:", await getProviderInfo({
        params: {
            provider: "aws"
        }
    }));
});
*/
