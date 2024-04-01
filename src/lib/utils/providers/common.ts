import { ProviderTypeEnum } from '$/types/provider';
import type { ProviderInfo } from '$/types/provider';

export const providerRegionsAndZones = {
	[ProviderTypeEnum.AWS]: {
		regionsInfoLink:
			'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions',
		regions: [
			{
				id: `us-east-2`,
				name: `US East (Ohio)`,
			},
			{
				id: `us-east-1`,
				name: `US East (Virginia)`,
			},
			{
				id: `us-west-1`,
				name: `US West (N. California)`,
			},
			{
				id: `us-west-2`,
				name: `US West (Oregon)`,
			},
			{
				id: `af-south-1`,
				name: `Africa (Cape Town)`,
			},
			{
				id: `ap-east-1`,
				name: `Asia Pacific (Hong Kong)`,
			},
			{
				id: `ap-south-2`,
				name: `Asia Pacific (Hyderabad)`,
			},
			{
				id: `ap-southeast-3`,
				name: `Asia Pacific (Jakarta)`,
			},
			{
				id: `ap-southeast-4`,
				name: `Asia Pacific (Melbourne)`,
			},
			{
				id: `ap-south-1`,
				name: `Asia Pacific (Mumbai)`,
			},
			{
				id: `ap-northeast-3`,
				name: `Asia Pacific (Osaka)`,
			},
			{
				id: `ap-northeast-2`,
				name: `Asia Pacific (Seoul)`,
			},
			{
				id: `ap-southeast-1`,
				name: `Asia Pacific (Singapore)`,
			},
			{
				id: `ap-southeast-2`,
				name: `Asia Pacific (Sydney)`,
			},
			{
				id: `ap-northeast-1`,
				name: `Asia Pacific (Tokyo)`,
			},
			{
				id: `ca-central-1`,
				name: `Canada (Central)`,
			},
			{
				id: `ca-west-1`,
				name: `Canada West (Calgary)`,
			},
			{
				id: `eu-central-1`,
				name: `Europe (Frankfurt)`,
			},
			{
				id: `eu-west-1`,
				name: `Europe (Ireland)`,
			},
			{
				id: `eu-west-2`,
				name: `Europe (London)`,
			},
			{
				id: `eu-south-1`,
				name: `Europe (Milan)`,
			},
			{
				id: `eu-west-3`,
				name: `Europe (Paris)`,
			},
			{
				id: `eu-south-2`,
				name: `Europe (Spain)`,
			},
			{
				id: `eu-north-1`,
				name: `Europe (Stockholm)`,
			},
			{
				id: `eu-central-2`,
				name: `Europe (Zurich)`,
			},
			{
				id: `il-central-1`,
				name: `Israel (Tel Aviv)`,
			},
			{
				id: `me-south-1`,
				name: `Middle East (Bahrain)`,
			},
			{
				id: `me-central-1`,
				name: `Middle East (UAE)`,
			},
			{
				id: `sa-east-1`,
				name: `South America (São Paulo)`,
			},
		],
	},
	[ProviderTypeEnum.GCP]: {
		regionsInfoLink: 'https://cloud.google.com/compute/docs/regions-zones/#available',
		regions: [
			{
				id: 'africa-south1',
				name: 'Johannesburg, South Africa',
				zones: [
					{
						id: 'africa-south1-a',
					},
					{
						id: 'africa-south1-b',
					},
					{
						id: 'africa-south1-c',
					},
				],
			},
			{
				id: 'asia-east1',
				name: 'Changhua County, Taiwan, APAC',
				zones: [
					{
						id: 'asia-east1-a',
					},
					{
						id: 'asia-east1-b',
					},
					{
						id: 'asia-east1-c',
					},
				],
			},
			{
				id: 'asia-east2',
				name: 'Hong Kong, APAC',
				zones: [
					{
						id: 'asia-east2-a',
					},
					{
						id: 'asia-east2-b',
					},
					{
						id: 'asia-east2-c',
					},
				],
			},
			{
				id: 'asia-northeast1',
				name: 'Tokyo, Japan, APAC',
				zones: [
					{
						id: 'asia-northeast1-a',
					},
					{
						id: 'asia-northeast1-b',
					},
					{
						id: 'asia-northeast1-c',
					},
				],
			},
			{
				id: 'asia-northeast2',
				name: 'Osaka, Japan, APAC',
				zones: [
					{
						id: 'asia-northeast2-a',
					},
					{
						id: 'asia-northeast2-b',
					},
					{
						id: 'asia-northeast2-c',
					},
				],
			},
			{
				id: 'asia-northeast3',
				name: 'Seoul, South Korea, APAC',
				zones: [
					{
						id: 'asia-northeast3-a',
					},
					{
						id: 'asia-northeast3-b',
					},
					{
						id: 'asia-northeast3-c',
					},
				],
			},
			{
				id: 'asia-south1',
				name: 'Mumbai, India, APAC',
				zones: [
					{
						id: 'asia-south1-a',
					},
					{
						id: 'asia-south1-b',
					},
					{
						id: 'asia-south1-c',
					},
				],
			},
			{
				id: 'asia-south2',
				name: 'Delhi, India, APAC',
				zones: [
					{
						id: 'asia-south2-a',
					},
					{
						id: 'asia-south2-b',
					},
					{
						id: 'asia-south2-c',
					},
				],
			},
			{
				id: 'asia-southeast1',
				name: 'Jurong West, Singapore, APAC',
				zones: [
					{
						id: 'asia-southeast1-a',
					},
					{
						id: 'asia-southeast1-b',
					},
					{
						id: 'asia-southeast1-c',
					},
				],
			},
			{
				id: 'asia-southeast2',
				name: 'Jakarta, Indonesia, APAC',
				zones: [
					{
						id: 'asia-southeast2-a',
					},
					{
						id: 'asia-southeast2-b',
					},
					{
						id: 'asia-southeast2-c',
					},
				],
			},
			{
				id: 'australia-southeast1',
				name: 'Sydney, Australia, APAC',
				zones: [
					{
						id: 'australia-southeast1-a',
					},
					{
						id: 'australia-southeast1-b',
					},
					{
						id: 'australia-southeast1-c',
					},
				],
			},
			{
				id: 'australia-southeast2',
				name: 'Melbourne, Australia, APAC',
				zones: [
					{
						id: 'australia-southeast2-a',
					},
					{
						id: 'australia-southeast2-b',
					},
					{
						id: 'australia-southeast2-c',
					},
				],
			},
			{
				id: 'europe-central2',
				name: 'Warsaw, Poland, Europe',
				zones: [
					{
						id: 'europe-central2-a',
					},
					{
						id: 'europe-central2-b',
					},
					{
						id: 'europe-central2-c',
					},
				],
			},
			{
				id: 'europe-north1',
				name: 'Hamina, Finland, Europe',
				zones: [
					{
						id: 'europe-north1-a',
					},
					{
						id: 'europe-north1-b',
					},
					{
						id: 'europe-north1-c',
					},
				],
			},
			{
				id: 'europe-southwest1',
				name: 'Madrid, Spain, Europe',
				zones: [
					{
						id: 'europe-southwest1-a',
					},
					{
						id: 'europe-southwest1-b',
					},
					{
						id: 'europe-southwest1-c',
					},
				],
			},
			{
				id: 'europe-west1',
				name: 'St. Ghislain, Belgium, Europe',
				zones: [
					{
						id: 'europe-west1-b',
					},
					{
						id: 'europe-west1-c',
					},
					{
						id: 'europe-west1-d',
					},
				],
			},
			{
				id: 'europe-west10',
				name: 'Berlin, Germany, Europe',
				zones: [
					{
						id: 'europe-west10-a',
					},
					{
						id: 'europe-west10-b',
					},
					{
						id: 'europe-west10-c',
					},
				],
			},
			{
				id: 'europe-west12',
				name: 'Turin, Italy, Europe',
				zones: [
					{
						id: 'europe-west12-a',
					},
					{
						id: 'europe-west12-b',
					},
					{
						id: 'europe-west12-c',
					},
				],
			},
			{
				id: 'europe-west2',
				name: 'London, England, Europe',
				zones: [
					{
						id: 'europe-west2-a',
					},
					{
						id: 'europe-west2-b',
					},
					{
						id: 'europe-west2-c',
					},
				],
			},
			{
				id: 'europe-west3',
				name: 'Frankfurt, Germany, Europe',
				zones: [
					{
						id: 'europe-west3-a',
					},
					{
						id: 'europe-west3-b',
					},
					{
						id: 'europe-west3-c',
					},
				],
			},
			{
				id: 'europe-west4',
				name: 'Eemshaven, Netherlands, Europe',
				zones: [
					{
						id: 'europe-west4-a',
					},
					{
						id: 'europe-west4-b',
					},
					{
						id: 'europe-west4-c',
					},
				],
			},
			{
				id: 'europe-west6',
				name: 'Zurich, Switzerland, Europe',
				zones: [
					{
						id: 'europe-west6-a',
					},
					{
						id: 'europe-west6-b',
					},
					{
						id: 'europe-west6-c',
					},
				],
			},
			{
				id: 'europe-west8',
				name: 'Milan, Italy, Europe',
				zones: [
					{
						id: 'europe-west8-a',
					},
					{
						id: 'europe-west8-b',
					},
					{
						id: 'europe-west8-c',
					},
				],
			},
			{
				id: 'europe-west9',
				name: 'Paris, France, Europe',
				zones: [
					{
						id: 'europe-west9-a',
					},
					{
						id: 'europe-west9-b',
					},
					{
						id: 'europe-west9-c',
					},
				],
			},
			{
				id: 'me-central1',
				name: 'Doha, Qatar, Middle East',
				zones: [
					{
						id: 'me-central1-a',
					},
					{
						id: 'me-central1-b',
					},
					{
						id: 'me-central1-c',
					},
				],
			},
			{
				id: 'me-central2',
				name: 'Dammam, Saudi Arabia, Middle East',
				zones: [
					{
						id: 'me-central2-a',
					},
					{
						id: 'me-central2-b',
					},
					{
						id: 'me-central2-c',
					},
				],
			},
			{
				id: 'me-west1',
				name: 'Tel Aviv, Israel, Middle East',
				zones: [
					{
						id: 'me-west1-a',
					},
					{
						id: 'me-west1-b',
					},
					{
						id: 'me-west1-c',
					},
				],
			},
			{
				id: 'northamerica-northeast1',
				name: 'Montréal, Québec, North America',
				zones: [
					{
						id: 'northamerica-northeast1-a',
					},
					{
						id: 'northamerica-northeast1-b',
					},
					{
						id: 'northamerica-northeast1-c',
					},
				],
			},
			{
				id: 'northamerica-northeast2',
				name: 'Toronto, Ontario, North America',
				zones: [
					{
						id: 'northamerica-northeast2-a',
					},
					{
						id: 'northamerica-northeast2-b',
					},
					{
						id: 'northamerica-northeast2-c',
					},
				],
			},
			{
				id: 'southamerica-east1',
				name: 'Osasco, São Paulo, Brazil, South America',
				zones: [
					{
						id: 'southamerica-east1-a',
					},
					{
						id: 'southamerica-east1-b',
					},
					{
						id: 'southamerica-east1-c',
					},
				],
			},
			{
				id: 'southamerica-west1',
				name: 'Santiago, Chile, South America',
				zones: [
					{
						id: 'southamerica-west1-a',
					},
					{
						id: 'southamerica-west1-b',
					},
					{
						id: 'southamerica-west1-c',
					},
				],
			},
			{
				id: 'us-central1',
				name: 'Council Bluffs, Iowa, North America',
				zones: [
					{
						id: 'us-central1-a',
					},
					{
						id: 'us-central1-b',
					},
					{
						id: 'us-central1-c',
					},
					{
						id: 'us-central1-f',
					},
				],
			},
			{
				id: 'us-east1',
				name: 'Moncks Corner, South Carolina, North America',
				zones: [
					{
						id: 'us-east1-b',
					},
					{
						id: 'us-east1-c',
					},
					{
						id: 'us-east1-d',
					},
				],
			},
			{
				id: 'us-east4',
				name: 'Ashburn, Virginia, North America',
				zones: [
					{
						id: 'us-east4-a',
					},
					{
						id: 'us-east4-b',
					},
					{
						id: 'us-east4-c',
					},
				],
			},
			{
				id: 'us-east5',
				name: 'Columbus, Ohio, North America',
				zones: [
					{
						id: 'us-east5-a',
					},
					{
						id: 'us-east5-b',
					},
					{
						id: 'us-east5-c',
					},
				],
			},
			{
				id: 'us-south1',
				name: 'Dallas, Texas, North America',
				zones: [
					{
						id: 'us-south1-a',
					},
					{
						id: 'us-south1-b',
					},
					{
						id: 'us-south1-c',
					},
				],
			},
			{
				id: 'us-west1',
				name: 'The Dalles, Oregon, North America',
				zones: [
					{
						id: 'us-west1-a',
					},
					{
						id: 'us-west1-b',
					},
					{
						id: 'us-west1-c',
					},
				],
			},
			{
				id: 'us-west2',
				name: 'Los Angeles, California, North America',
				zones: [
					{
						id: 'us-west2-a',
					},
					{
						id: 'us-west2-b',
					},
					{
						id: 'us-west2-c',
					},
				],
			},
			{
				id: 'us-west3',
				name: 'Salt Lake City, Utah, North America',
				zones: [
					{
						id: 'us-west3-a',
					},
					{
						id: 'us-west3-b',
					},
					{
						id: 'us-west3-c',
					},
				],
			},
			{
				id: 'us-west4',
				name: 'Las Vegas, Nevada, North America',
				zones: [
					{
						id: 'us-west4-a',
					},
					{
						id: 'us-west4-b',
					},
					{
						id: 'us-west4-c',
					},
				],
			},
		],
	},
} as const;

/**
 * Returns the human-readable region name.
 *
 * @param regionId technical region id by provider
 * @param provider cloud provider name
 * @returns human-readable region name string
 */
export const getRegionName = (regionId: string, provider: ProviderTypeEnum): string => {
	const regions = providerRegionsAndZones[provider].regions;

	const region = regions.find((region) => region.id === regionId);

	if (!region) {
		throw new Error(`Region ${regionId} not found for provider ${provider}`);
	}

	return region.name;
};

/**
 * Returns a human readable provider info object.
 *
 * @param provider cloud provider name
 * @param providerInfo original provider info object
 * @returns human-readable provider info object
 */
export const getProviderInfoWithRegionLabels = (
	provider: ProviderTypeEnum,
	providerInfo: ProviderInfo[]
): ProviderInfo[] =>
	providerInfo.map((providerInfo) => ({
		region: {
			...providerInfo.region,
			name: getRegionName(providerInfo.region.id, provider),
		},
		zones: providerInfo.zones,
	}));
