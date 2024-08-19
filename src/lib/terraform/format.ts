import { ARN } from 'link2aws'

export const getAwsConsoleLink = (arn: string) => {
	try {
		return new ARN(arn).consoleLink
	} catch (error) {
		return `https://console.aws.amazon.com/go/view?arn=${encodeURIComponent(arn)}`
	}
}

export const getGcpConsoleLink = (selfLink: string): string => {
	const regex = /\/projects\/(?<project>[^/]+)\/(?:global|zones\/(?<zone>[^/]+)|regions\/(?<region>[^/]+))\/(?<resourceType>[^/]+)\/(?<resourceName>[^/]+)/

	const match = selfLink.match(regex)
	if (!match?.groups)
		return ''

	const { project, region, zone, resourceType, resourceName } = match.groups

	return (
		resourceType === 'addresses' ?
			`https://console.cloud.google.com/networking/addresses/list?project=${project}&pageState=%28%22allAddressesTable%22%3A%28%22f%22%3A%22%255B%257B_22k_22_3A_22Name_22_2C_22t_22_3A10_2C_22v_22_3A_22_5C_22${resourceName}_5C_22_22_2C_22s_22_3Atrue_2C_22i_22_3A_22name_22%257D%255D%22%29%29`
		: resourceType === 'firewalls' ?
			`https://console.cloud.google.com/networking/firewalls/details/${resourceName}?project=${project}`
		: resourceType === 'networks' ?
			`https://console.cloud.google.com/networking/networks/details/${resourceName}?project=${project}`
		: resourceType === 'subnetworks' ?
			`https://console.cloud.google.com/networking/subnetworks/details/${region}/${resourceName}?project=${project}`
		: resourceType === 'instances' ?
			`https://console.cloud.google.com/compute/instancesDetail/zones/${zone}/instances/${resourceName}?project=${project}`
		: resourceType === 'disks' ?
			`https://console.cloud.google.com/compute/disksDetail/zones/${zone}/disks/${resourceName}?project=${project}`
		:
			''
	)
}

export const formatResourceType = (resourceType: string) => (
	resourceType
		.split('_')
		.map((word, i) => (
			word.length <= 3 && i <= 1
				? word.toUpperCase()
				: `${word[0].toUpperCase()}${word.slice(1)}`
		))
		.join(' ')
)
