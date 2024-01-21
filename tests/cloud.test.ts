import { test } from 'vitest'
import { GCP, AWS } from '$structs/cloud'

test("GCP fetching works.", async () => {
    const gcp = new GCP();
    console.log("Regions:", await gcp.getRegions());
    console.log("Zones:", await gcp.getZones("asia-east2"));
    console.log("Machines:", await gcp.getMachines("us-central1-a"));
});


test("AWS fetching works.", async () => {
    const aws = new AWS();
    console.log("Regions:", await aws.getRegions());
    console.log("Zones:", await aws.getZones("ap-south-1"));
    console.log("Machines:", await aws.getMachines("ap-south-1"));
});

