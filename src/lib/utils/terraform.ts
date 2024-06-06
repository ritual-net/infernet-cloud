import { promises as fs } from 'fs';
import path from 'path';
import type { InfernetNode } from '$schema/interfaces';

const BASE_TEMP_DIR = `${process.cwd()}/tmp/`;

// Touch temporary directory to ensure it exists
await fs.mkdir(BASE_TEMP_DIR, { recursive: true });

/**
 * Creates a temporary directory for deployment files.
 * @returns The path to the temporary directory.
 */
export const createTempDir = async (): Promise<string> => {
	// Create a temporary directory
	const tempDir = await fs.mkdtemp(BASE_TEMP_DIR);

	return tempDir;
};

/**
 * Creates a terraform.tfvars file from an object.
 *
 * @param tempDir The path to the temporary directory.
 * @param tfVars The object to write to the file.
 */
export const createTerraformVarsFile = async (
	tempDir: string,
	tfVars: Record<string, string[] | string | number | boolean | Record<string, string>>
): Promise<void> => {
	const varsFile = path.join(tempDir, 'terraform.tfvars');
	const varsString = formatTfVars(tfVars);
	await fs.writeFile(varsFile, varsString);
};

/**
 * Creates node config files from an array of InfernetNode objects.
 *
 * @param tempDir The path to the temporary directory.
 * @param nodes The array of InfernetNode objects.
 */
export const createNodeConfigFiles = async (
	tempDir: string,
	nodes: InfernetNode[]
): Promise<void> => {
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
};

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
const formatNodeConfig = (node: InfernetNode) => {
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
		...(node.docker_account && {
			docker: {
				username: node.docker_account.username,
				password: node.docker_account.password,
			},
		}),
		...((node.snapshot_sync_batch_size || node.snapshot_sync_sleep) && {
			snapshot_sync: {
				...(node.snapshot_sync_batch_size && {
					batch_size: node.snapshot_sync_batch_size,
				}),
				...(node.snapshot_sync_sleep && {
					sleep: node.snapshot_sync_sleep,
				}),
			},
		}),
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
};

/**
 * Format an arbitrary, flat (non-nested) object into a string that can be
 * written as a terraform.tfvars file. This is used to generate the terraform
 * variables file for a deployment.
 *
 * @param config Generic object to format. Should be flat (non-nested).
 * @returns Terraform variables file as a formatted string.
 */

const formatTfVars = (
	config: Record<string, string[] | string | number | boolean | Record<string, unknown>>
): string => {
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
};
