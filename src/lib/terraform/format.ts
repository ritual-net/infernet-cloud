import { ARN } from 'link2aws'

export const getAwsConsoleLink = (arn: string) => {
	try {
		return new ARN(arn).consoleLink
	} catch (error) {
		return `https://console.aws.amazon.com/go/view?arn=${encodeURIComponent(arn)}`
	}
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
