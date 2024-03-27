import { ProviderTypeEnum } from '$/types/provider';
import type { ProviderInfo } from '$/types/provider';

export const providerRegionsAndZones = {
	[ProviderTypeEnum.AWS]: {
		regionsInfoLink:
			'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions',
		regions: [
			{
				value: `us-east-2`,
				label: `US East (Ohio)`,
			},
			{
				value: `us-east-1`,
				label: `US East (Virginia)`,
			},
			{
				value: `us-west-1`,
				label: `US West (N. California)`,
			},
			{
				value: `us-west-2`,
				label: `US West (Oregon)`,
			},
			{
				value: `af-south-1`,
				label: `Africa (Cape Town)`,
			},
			{
				value: `ap-east-1`,
				label: `Asia Pacific (Hong Kong)`,
			},
			{
				value: `ap-south-2`,
				label: `Asia Pacific (Hyderabad)`,
			},
			{
				value: `ap-southeast-3`,
				label: `Asia Pacific (Jakarta)`,
			},
			{
				value: `ap-southeast-4`,
				label: `Asia Pacific (Melbourne)`,
			},
			{
				value: `ap-south-1`,
				label: `Asia Pacific (Mumbai)`,
			},
			{
				value: `ap-northeast-3`,
				label: `Asia Pacific (Osaka)`,
			},
			{
				value: `ap-northeast-2`,
				label: `Asia Pacific (Seoul)`,
			},
			{
				value: `ap-southeast-1`,
				label: `Asia Pacific (Singapore)`,
			},
			{
				value: `ap-southeast-2`,
				label: `Asia Pacific (Sydney)`,
			},
			{
				value: `ap-northeast-1`,
				label: `Asia Pacific (Tokyo)`,
			},
			{
				value: `ca-central-1`,
				label: `Canada (Central)`,
			},
			{
				value: `ca-west-1`,
				label: `Canada West (Calgary)`,
			},
			{
				value: `eu-central-1`,
				label: `Europe (Frankfurt)`,
			},
			{
				value: `eu-west-1`,
				label: `Europe (Ireland)`,
			},
			{
				value: `eu-west-2`,
				label: `Europe (London)`,
			},
			{
				value: `eu-south-1`,
				label: `Europe (Milan)`,
			},
			{
				value: `eu-west-3`,
				label: `Europe (Paris)`,
			},
			{
				value: `eu-south-2`,
				label: `Europe (Spain)`,
			},
			{
				value: `eu-north-1`,
				label: `Europe (Stockholm)`,
			},
			{
				value: `eu-central-2`,
				label: `Europe (Zurich)`,
			},
			{
				value: `il-central-1`,
				label: `Israel (Tel Aviv)`,
			},
			{
				value: `me-south-1`,
				label: `Middle East (Bahrain)`,
			},
			{
				value: `me-central-1`,
				label: `Middle East (UAE)`,
			},
			{
				value: `sa-east-1`,
				label: `South America (São Paulo)`,
			},
		],
	},
	[ProviderTypeEnum.GCP]: {
		regionsInfoLink: 'https://cloud.google.com/compute/docs/regions-zones/#available',
		regions: [
			{
				value: 'africa-south1',
				label: 'Johannesburg, South Africa',
				zones: [
					{
						value: 'africa-south1-a',
					},
					{
						value: 'africa-south1-b',
					},
					{
						value: 'africa-south1-c',
					},
				],
			},
			{
				value: 'asia-east1',
				label: 'Changhua County, Taiwan, APAC',
				zones: [
					{
						value: 'asia-east1-a',
					},
					{
						value: 'asia-east1-b',
					},
					{
						value: 'asia-east1-c',
					},
				],
			},
			{
				value: 'asia-east2',
				label: 'Hong Kong, APAC',
				zones: [
					{
						value: 'asia-east2-a',
					},
					{
						value: 'asia-east2-b',
					},
					{
						value: 'asia-east2-c',
					},
				],
			},
			{
				value: 'asia-northeast1',
				label: 'Tokyo, Japan, APAC',
				zones: [
					{
						value: 'asia-northeast1-a',
					},
					{
						value: 'asia-northeast1-b',
					},
					{
						value: 'asia-northeast1-c',
					},
				],
			},
			{
				value: 'asia-northeast2',
				label: 'Osaka, Japan, APAC',
				zones: [
					{
						value: 'asia-northeast2-a',
					},
					{
						value: 'asia-northeast2-b',
					},
					{
						value: 'asia-northeast2-c',
					},
				],
			},
			{
				value: 'asia-northeast3',
				label: 'Seoul, South Korea, APAC',
				zones: [
					{
						value: 'asia-northeast3-a',
					},
					{
						value: 'asia-northeast3-b',
					},
					{
						value: 'asia-northeast3-c',
					},
				],
			},
			{
				value: 'asia-south1',
				label: 'Mumbai, India, APAC',
				zones: [
					{
						value: 'asia-south1-a',
					},
					{
						value: 'asia-south1-b',
					},
					{
						value: 'asia-south1-c',
					},
				],
			},
			{
				value: 'asia-south2',
				label: 'Delhi, India, APAC',
				zones: [
					{
						value: 'asia-south2-a',
					},
					{
						value: 'asia-south2-b',
					},
					{
						value: 'asia-south2-c',
					},
				],
			},
			{
				value: 'asia-southeast1',
				label: 'Jurong West, Singapore, APAC',
				zones: [
					{
						value: 'asia-southeast1-a',
					},
					{
						value: 'asia-southeast1-b',
					},
					{
						value: 'asia-southeast1-c',
					},
				],
			},
			{
				value: 'asia-southeast2',
				label: 'Jakarta, Indonesia, APAC',
				zones: [
					{
						value: 'asia-southeast2-a',
					},
					{
						value: 'asia-southeast2-b',
					},
					{
						value: 'asia-southeast2-c',
					},
				],
			},
			{
				value: 'australia-southeast1',
				label: 'Sydney, Australia, APAC',
				zones: [
					{
						value: 'australia-southeast1-a',
					},
					{
						value: 'australia-southeast1-b',
					},
					{
						value: 'australia-southeast1-c',
					},
				],
			},
			{
				value: 'australia-southeast2',
				label: 'Melbourne, Australia, APAC',
				zones: [
					{
						value: 'australia-southeast2-a',
					},
					{
						value: 'australia-southeast2-b',
					},
					{
						value: 'australia-southeast2-c',
					},
				],
			},
			{
				value: 'europe-central2',
				label: 'Warsaw, Poland, Europe',
				zones: [
					{
						value: 'europe-central2-a',
					},
					{
						value: 'europe-central2-b',
					},
					{
						value: 'europe-central2-c',
					},
				],
			},
			{
				value: 'europe-north1',
				label: 'Hamina, Finland, Europe',
				zones: [
					{
						value: 'europe-north1-a',
					},
					{
						value: 'europe-north1-b',
					},
					{
						value: 'europe-north1-c',
					},
				],
			},
			{
				value: 'europe-southwest1',
				label: 'Madrid, Spain, Europe',
				zones: [
					{
						value: 'europe-southwest1-a',
					},
					{
						value: 'europe-southwest1-b',
					},
					{
						value: 'europe-southwest1-c',
					},
				],
			},
			{
				value: 'europe-west1',
				label: 'St. Ghislain, Belgium, Europe',
				zones: [
					{
						value: 'europe-west1-b',
					},
					{
						value: 'europe-west1-c',
					},
					{
						value: 'europe-west1-d',
					},
				],
			},
			{
				value: 'europe-west10',
				label: 'Berlin, Germany, Europe',
				zones: [
					{
						value: 'europe-west10-a',
					},
					{
						value: 'europe-west10-b',
					},
					{
						value: 'europe-west10-c',
					},
				],
			},
			{
				value: 'europe-west12',
				label: 'Turin, Italy, Europe',
				zones: [
					{
						value: 'europe-west12-a',
					},
					{
						value: 'europe-west12-b',
					},
					{
						value: 'europe-west12-c',
					},
				],
			},
			{
				value: 'europe-west2',
				label: 'London, England, Europe',
				zones: [
					{
						value: 'europe-west2-a',
					},
					{
						value: 'europe-west2-b',
					},
					{
						value: 'europe-west2-c',
					},
				],
			},
			{
				value: 'europe-west3',
				label: 'Frankfurt, Germany, Europe',
				zones: [
					{
						value: 'europe-west3-a',
					},
					{
						value: 'europe-west3-b',
					},
					{
						value: 'europe-west3-c',
					},
				],
			},
			{
				value: 'europe-west4',
				label: 'Eemshaven, Netherlands, Europe',
				zones: [
					{
						value: 'europe-west4-a',
					},
					{
						value: 'europe-west4-b',
					},
					{
						value: 'europe-west4-c',
					},
				],
			},
			{
				value: 'europe-west6',
				label: 'Zurich, Switzerland, Europe',
				zones: [
					{
						value: 'europe-west6-a',
					},
					{
						value: 'europe-west6-b',
					},
					{
						value: 'europe-west6-c',
					},
				],
			},
			{
				value: 'europe-west8',
				label: 'Milan, Italy, Europe',
				zones: [
					{
						value: 'europe-west8-a',
					},
					{
						value: 'europe-west8-b',
					},
					{
						value: 'europe-west8-c',
					},
				],
			},
			{
				value: 'europe-west9',
				label: 'Paris, France, Europe',
				zones: [
					{
						value: 'europe-west9-a',
					},
					{
						value: 'europe-west9-b',
					},
					{
						value: 'europe-west9-c',
					},
				],
			},
			{
				value: 'me-central1',
				label: 'Doha, Qatar, Middle East',
				zones: [
					{
						value: 'me-central1-a',
					},
					{
						value: 'me-central1-b',
					},
					{
						value: 'me-central1-c',
					},
				],
			},
			{
				value: 'me-central2',
				label: 'Dammam, Saudi Arabia, Middle East',
				zones: [
					{
						value: 'me-central2-a',
					},
					{
						value: 'me-central2-b',
					},
					{
						value: 'me-central2-c',
					},
				],
			},
			{
				value: 'me-west1',
				label: 'Tel Aviv, Israel, Middle East',
				zones: [
					{
						value: 'me-west1-a',
					},
					{
						value: 'me-west1-b',
					},
					{
						value: 'me-west1-c',
					},
				],
			},
			{
				value: 'northamerica-northeast1',
				label: 'Montréal, Québec, North America',
				zones: [
					{
						value: 'northamerica-northeast1-a',
					},
					{
						value: 'northamerica-northeast1-b',
					},
					{
						value: 'northamerica-northeast1-c',
					},
				],
			},
			{
				value: 'northamerica-northeast2',
				label: 'Toronto, Ontario, North America',
				zones: [
					{
						value: 'northamerica-northeast2-a',
					},
					{
						value: 'northamerica-northeast2-b',
					},
					{
						value: 'northamerica-northeast2-c',
					},
				],
			},
			{
				value: 'southamerica-east1',
				label: 'Osasco, São Paulo, Brazil, South America',
				zones: [
					{
						value: 'southamerica-east1-a',
					},
					{
						value: 'southamerica-east1-b',
					},
					{
						value: 'southamerica-east1-c',
					},
				],
			},
			{
				value: 'southamerica-west1',
				label: 'Santiago, Chile, South America',
				zones: [
					{
						value: 'southamerica-west1-a',
					},
					{
						value: 'southamerica-west1-b',
					},
					{
						value: 'southamerica-west1-c',
					},
				],
			},
			{
				value: 'us-central1',
				label: 'Council Bluffs, Iowa, North America',
				zones: [
					{
						value: 'us-central1-a',
					},
					{
						value: 'us-central1-b',
					},
					{
						value: 'us-central1-c',
					},
					{
						value: 'us-central1-f',
					},
				],
			},
			{
				value: 'us-east1',
				label: 'Moncks Corner, South Carolina, North America',
				zones: [
					{
						value: 'us-east1-b',
					},
					{
						value: 'us-east1-c',
					},
					{
						value: 'us-east1-d',
					},
				],
			},
			{
				value: 'us-east4',
				label: 'Ashburn, Virginia, North America',
				zones: [
					{
						value: 'us-east4-a',
					},
					{
						value: 'us-east4-b',
					},
					{
						value: 'us-east4-c',
					},
				],
			},
			{
				value: 'us-east5',
				label: 'Columbus, Ohio, North America',
				zones: [
					{
						value: 'us-east5-a',
					},
					{
						value: 'us-east5-b',
					},
					{
						value: 'us-east5-c',
					},
				],
			},
			{
				value: 'us-south1',
				label: 'Dallas, Texas, North America',
				zones: [
					{
						value: 'us-south1-a',
					},
					{
						value: 'us-south1-b',
					},
					{
						value: 'us-south1-c',
					},
				],
			},
			{
				value: 'us-west1',
				label: 'The Dalles, Oregon, North America',
				zones: [
					{
						value: 'us-west1-a',
					},
					{
						value: 'us-west1-b',
					},
					{
						value: 'us-west1-c',
					},
				],
			},
			{
				value: 'us-west2',
				label: 'Los Angeles, California, North America',
				zones: [
					{
						value: 'us-west2-a',
					},
					{
						value: 'us-west2-b',
					},
					{
						value: 'us-west2-c',
					},
				],
			},
			{
				value: 'us-west3',
				label: 'Salt Lake City, Utah, North America',
				zones: [
					{
						value: 'us-west3-a',
					},
					{
						value: 'us-west3-b',
					},
					{
						value: 'us-west3-c',
					},
				],
			},
			{
				value: 'us-west4',
				label: 'Las Vegas, Nevada, North America',
				zones: [
					{
						value: 'us-west4-a',
					},
					{
						value: 'us-west4-b',
					},
					{
						value: 'us-west4-c',
					},
				],
			},
		],
	},
};

/**
 * Returns the human-readable region name.
 *
 * @param regionId technical region id by provider
 * @param provider cloud provider name
 * @returns human-readable region name string
 */
export const getRegionLabel = (regionId: string, provider: ProviderTypeEnum): string => {
	const regions = providerRegionsAndZones[provider].regions;

	const region = regions.find((r) => r.value === regionId);

	if (!region) {
		throw new Error(`Region ${regionId} not found for provider ${provider}`);
	}

	return region.label;
};

/**
 * Returns a human readable provider info object.
 *
 * @param provider cloud provider name
 * @param provider original provider info object
 * @returns human-readable provider info object
 */
export const getProviderInfoWithRegionLabels = (
	provider: ProviderTypeEnum,
	providerInfo: ProviderInfo[]
): ProviderInfo[] => (
	providerInfo.map((providerInfo) => ({
		region: {
			...providerInfo.region,
			label: getRegionLabel(providerInfo.region.id, provider),
		},
		zones: providerInfo.zones,
	}))
);
