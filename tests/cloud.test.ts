import { test } from 'vitest'
import { GCP, AWS } from '$structs/cloud'
import { GET as getRegions } from "$api/providers/[provider]/regions/+server"
import { GET as getZones } from "$api/providers/[provider]/regions/[region]/zone/+server"
import { GET as getMachines } from "$api/providers/[provider]/regions/[region]/machine/+server"

/*
test("GCP fetching works.", async () => {
    const gcp = new GCP();
    console.log("Regions:", await gcp.getRegions());
    console.log("Zones:", await gcp.getZones("asia-east2"));
    console.log("Machines:", await gcp.getMachines("asia-east2"));
}, { timeout: 10000 });
*/
/*
test("AWS fetching works.", async () => {
    const aws = new AWS();
    console.log("Regions:", await aws.getRegions());
    console.log("Zones:", await aws.getZones("ap-south-1"));
    console.log("Machines:", await aws.getMachines("ap-south-1"));
}, { timeout: 10000 });
*/

test("Region fetching works.", async () => {
    console.log("Regions:", await getRegions({
        params: {
            provider: "aws"
        }
    }));
});

test("Zone fetching works.", async () => {
    console.log("Zones:", await getZones({
        params: {
            provider: "gcp",
            region: "asia-east2"
        }
    }));
});

test("Machine fetching works.", async () => {
    console.log("Machines:", await getMachines({
        params: {
            provider: "gcp",
            region: "asia-east2"
        }
    }));
});