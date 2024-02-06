import { promises as fs } from 'fs';
import path from 'path';
import tar from 'tar';
import type { InfernetNode } from '$schema/interfaces';

/**
 * Creates a temporary directory for deployment files. Copies the deployment files
 * from the src/lib/deploy/ directory, and untars the provider-specific Terraform
 * files.
 *
 * @param provider The cloud provider.
 * @returns The path to the temporary directory.
 */
export async function createTempDir(provider: string): Promise<string> {
	const srcDir = `${process.cwd()}/src/lib/deploy`;

	// Create a temporary directory
	const tempDir = await fs.mkdtemp(path.join(`${process.cwd()}`, '/tmp/ic-'));

	// Untar the provider-specific Terraform files
	await tar.x({
		file: `${srcDir}/${provider.toLowerCase()}.tar.gz`,
		C: tempDir,
	});

	// Copy the deployment tarball
	await fs.copyFile(`${srcDir}/compose.tar.gz`, `${tempDir}/deploy.tar.gz`);
	return tempDir;
}

/**
 * Creates a terraform.tfvars file from an object.
 *
 * @param tempDir The path to the temporary directory.
 * @param tfVars The object to write to the file.
 */
export async function createTerraformVarsFile(
	tempDir: string,
	tfVars: Record<string, string[] | string | number | boolean | Record<string, string>>
): Promise<void> {
	const varsFile = path.join(tempDir, 'terraform.tfvars');
	const varsString = formatTfVars(tfVars);
	await fs.writeFile(varsFile, varsString);
}

/**
 * Creates node config files from an array of InfernetNode objects.
 *
 * @param tempDir The path to the temporary directory.
 * @param nodes The array of InfernetNode objects.
 */
export async function createNodeConfigFiles(tempDir: string, nodes: InfernetNode[]): Promise<void> {
	// Create configs/ directory
	await fs.mkdir(path.join(tempDir, 'configs'), { recursive: true });

	// Create node config files under configs/
	for (const node of nodes) {
		const jsonConfig = formatNodeConfig(node);
		await fs.writeFile(
			path.join(tempDir, `configs/${node.id}.json`),
			JSON.stringify(jsonConfig, null, 2)
		);
	}
}

/**
 * Parses the output of a Terraform command into an array of objects.
 *
 * @param output The output of the Terraform command.
 * @returns An array of Record<string, string[] | string | number | boolean> objects.
 */
export function parseTerraformOutput(
	output: string
): Record<string, string[] | string | number | boolean>[] {
	const nodesSectionMatch = output
		// Isolate the "outputs" section
		.slice(output.lastIndexOf('Outputs:'))
		// Extract the "nodes" array
		.match(/nodes\s*=\s*\[[^\]]*?\]/);

	if (!nodesSectionMatch) return []; // Return an empty array if no match is found

	let nodesSection = nodesSectionMatch[0];
	nodesSection = nodesSection.substring(
		nodesSection.indexOf('['),
		nodesSection.lastIndexOf(']') + 1
	);
	console.log(output);
	// Replace Terraform syntax with JSON syntax
	const jsonString = nodesSection
		.replace(/=\s*"/g, ': "') // Replace '=' with ':' for string values
		.replace(/(\w+)\s*:/g, '"$1":') // Add quotes to keys
		.replace(/"\n/g, '", ') // add comma after each line
		.replace(/\s*([{}])\s*/g, '$1') // Remove whitespace around '{' and '}'
		.replace(/,}/g, '}') // Remove trailing comma in objects
		.replace(/},[^{]/g, '}'); // Remove trailing comma in arrays

	// Parse JSON
	return JSON.parse(jsonString);
}

/**
 * Format an InfernetNode object into a JSON object that can be used as a
 * config.json file for an Infernet Node deployment.
 *
 * Some fields are defaulted, such as log_path, server.port, and redis.host/port,
 * and that container ports are auto-assigned. These are not configurable by the
 * user.
 *
 * @param node An InfernetNode object.
 * @returns The formatted JSON object to be used as a config.json file.
 */
function formatNodeConfig(node: InfernetNode) {
	// Auto-assign container ports in reverse order
	let port = 4999;

	return {
		chain: {
			enabled: node.chain_enabled,
			trail_head_blocks: node.trail_head_blocks,
			rpc_url: node.rpc_url,
			coordinator_address: node.coordinator_address,
			wallet: {
				max_gas_limit: node.max_gas_limit,
				private_key: node.private_key,
			},
		},
		forward_stats: node.forward_stats,
		containers: node.containers?.map((container) => ({
			image: container.image,
			id: container.container_id,
			description: container.description,
			external: container.external,
			allowed_addresses: container.allowed_addresses,
			allowed_delegate_addresses: container.allowed_delegate_addresses,
			allowed_ips: container.allowed_ips,
			command: container.command,
			env: container.env,
			gpu: container.gpu,
			port: port--,
		})),
		// defaulted
		log_path: 'infernet_node.log',
		server: {
			port: 4000,
		},
		redis: {
			host: 'redis',
			port: 6379,
		},
	};
}

/**
 * Format an arbitrary, flat (non-nested) object into a string that can be
 * written as a terraform.tfvars file. This is used to generate the terraform
 * variables file for a deployment.
 *
 * @param config Generic object to format. Should be flat (non-nested).
 * @returns Terraform variables file as a formatted string.
 */

function formatTfVars(
	config: Record<string, string[] | string | number | boolean | Record<string, unknown>>
): string {
	const formatValue = (value: unknown): string => {
		if (Array.isArray(value)) {
			// Format array, recursively format each element
			return `[${value.map((v) => formatValue(v)).join(', ')}]`;
		} else if (typeof value === 'object' && value !== null) {
			// Format object as a map, recursively format each value
			const objectValue = `{${Object.entries(value)
				.map(([k, v]) => `"${k}" = ${formatValue(v)}`)
				.join(', ')}}`;
			return objectValue;
		} else if (typeof value === 'string') {
			// Wrap string values in quotes
			return `"${value}"`;
		} else {
			// Return non-string, non-array, non-object types (e.g., numbers, booleans)
			return `${value}`;
		}
	};

	const vars: string[] = Object.entries(config).map(
		([key, value]) => `${key} = ${formatValue(value)}`
	);
	return vars.join('\n');
}
