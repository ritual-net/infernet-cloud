import { google } from 'googleapis';
import * as AWS_SDK from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

export type Machine = {
    id: string;
    name: string;
    description: string;
    link: string;
};

class CloudProvider {
    async getRegions(): Promise<string[]> {
        return [];
    }

    async getZones(region: string): Promise<string[]> {
        return [];
    }

    async getMachines(region: string): Promise<Machine[]> {
        return [];
    }
}


export class GCP extends CloudProvider {
    googleCompute: any;
    projectId: string = '';
    authPromise: Promise<void>;

    constructor() {
        super();
        this.authPromise = this.auth();
    }

    async auth() {
        const authObj = new google.auth.GoogleAuth({
            keyFilename: process.env.GCLOUD_CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const authClient = await authObj.getClient();
        this.projectId = await authObj.getProjectId();
        this.googleCompute = google.compute({ version: 'v1', auth: authClient });
    }

	async getRegions(): Promise<string[]> {
        await this.authPromise;
        const response = await this.googleCompute.regions.list({
            project: this.projectId
        });
        return response.data.items.map((region: any) => region.name);
	}

    async getZones(region: string): Promise<string[]> {
        await this.authPromise;
        const response = await this.googleCompute.zones.list({
            project: this.projectId
        });
        return response.data.items
            .filter((zone: any) => zone.region.endsWith(`/regions/${region}`))
            .map((zone: any) => zone.name);
    }

    async getMachines(region: string): Promise<Machine[]> {
        await this.authPromise;
        const zones = await this.getZones(region);
    
        const machines: Machine[] = [];
        for (const zone of zones) {
            const response = await this.googleCompute.machineTypes.list({
                project: this.projectId,
                zone: zone
            });
            const zoneMachines = response.data.items
                .map((machine: any) => ({
                    id: machine.id,
                    name: machine.name,
                    description: machine.description,
                    link: machine.selfLink
                } as Machine));
            machines.push(...zoneMachines);
        }
        return machines;
    }
}

export class AWS extends CloudProvider {
    amazonCompute: any;
    authPromise: Promise<void>;

    constructor() {
        super();
        this.authPromise = this.auth();
    }

    async auth() {
        this.amazonCompute = new AWS_SDK.EC2({
            apiVersion: '2016-11-15',
            region: "us-east-1" // initial region does not matter
        });
    }

    async getRegions(): Promise<string[]> {
        await this.authPromise;
        const response = await this.amazonCompute.describeRegions().promise();
        return response.Regions.map((region: any) => region.RegionName);
    }

    async getZones(region:string): Promise<string[]> {
        await this.authPromise;
        this.amazonCompute = new AWS_SDK.EC2({
            apiVersion: '2016-11-15',
            region: region
        });
        const response = await this.amazonCompute.describeAvailabilityZones().promise();
        return response.AvailabilityZones.map((zone: any) => zone.ZoneName);
    }

    async getMachines(region:string): Promise<Machine[]> {
        await this.authPromise;
        this.amazonCompute = new AWS_SDK.EC2({
            apiVersion: '2016-11-15',
            region: region
        });
        const response = await this.amazonCompute.describeInstanceTypeOfferings().promise();
        return response.InstanceTypeOfferings.map((offering: any) => ({
            id: offering.InstanceType,
            name: offering.InstanceType,
            description: offering.InstanceType,
            link: "https://aws.amazon.com/ec2/instance-types/"
            } as Machine));
    }
}
