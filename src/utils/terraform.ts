import { promises as fs } from 'fs';
import path from 'path';
import tar from 'tar';
import type { InfernetNode } from '$schema/interfaces';

/**
 * Utility functions for interacting with Terraform, such as creating and managing
 * temporary directories, formatting tfvars and config files, and parsing Terraform
 * output.
 *
 * All functions are static and provider-agnostic.
 */
export class TerraformUtils {
	/**
	 * Creates a temporary directory for deployment files. Copies the deployment files
	 * from the src/lib/deploy/ directory, and untars the provider-specific Terraform
	 * files.
	 *
	 * @param provider The cloud provider.
	 * @returns The path to the temporary directory.
	 */
	public static async createTempDir(provider: string): Promise<string> {
		const srcDir = `${process.cwd()}/src/lib/deploy`;

		// Create a temporary directory
		const tempDir = await fs.mkdtemp(path.join(`${process.cwd()}`, '/tmp/ic-'));

		// Untar the provider-specific Terraform files
		await tar.x({
			file: `${srcDir}/${provider.toLowerCase()}.tar.gz`,
			C: tempDir
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
	public static async createTerraformVarsFile(tempDir: string, tfVars: object): Promise<void> {
		const varsFile = path.join(tempDir, 'terraform.tfvars');
		const varsString = TerraformUtils.formatTfVars(tfVars);
		await fs.writeFile(varsFile, varsString);
	}

	/**
	 * Creates node config files from an array of InfernetNode objects.
	 *
	 * @param tempDir The path to the temporary directory.
	 * @param nodes The array of InfernetNode objects.
	 */
	public static async createNodeConfigFiles(tempDir: string, nodes: InfernetNode[]): Promise<void> {
		// Create configs/ directory
		await fs.mkdir(path.join(tempDir, 'configs'), { recursive: true });

		// Create node config files under configs/
		for (let i = 0; i < nodes.length; i++) {
			const jsonConfig = TerraformUtils.formatNodeConfig(nodes[i]);
			await fs.writeFile(
				path.join(tempDir, `configs/${i}.json`),
				JSON.stringify(jsonConfig, null, 2)
			);
		}
	}

	/**
	 * Parses the output of a Terraform command into an array of objects.
	 *
	 * @param output The output of the Terraform command.
	 * @returns An array of objects.
	 */
	public static parseTerraformOutput(output: string): object[] {
		const nodesSectionMatch = output
			// Isolate the "outputs" section
			.slice(output.lastIndexOf('Outputs:'))
			// Extract the "nodes" array
			.match(/nodes\s*=\s*\[(.|\s)*?\]/);

		if (!nodesSectionMatch) return []; // Return an empty array if no match is found

		let nodesSection = nodesSectionMatch[0];
		nodesSection = nodesSection.substring(
			nodesSection.indexOf('['),
			nodesSection.lastIndexOf(']') + 1
		);

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
	public static formatNodeConfig(node: InfernetNode): object {
		let port = 4999;

		return {
			chain: {
				enabled: node.chain_enabled,
				trail_head_blocks: node.trail_head_blocks,
				rpc_url: node.rpc_url,
				coordinator_address: node.coordinator_address,
				wallet: {
					max_gas_limit: node.max_gas_limit,
					private_key: node.private_key
				}
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
				port: port--
			})),
			// defaulted
			log_path: 'infernet_node.log',
			server: {
				port: 4000
			},
			redis: {
				host: 'redis',
				port: 6379
			}
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
	public static formatTfVars(config: object): string {
		const vars: string[] = [];

		for (const [key, value] of Object.entries(config)) {
			if (Array.isArray(value)) {
				// Format array as a list of strings
				const arrayValue = `[${value.map((v) => `"${v}"`).join(', ')}]`;
				vars.push(`${key} = ${arrayValue}`);
			} else if (typeof value === 'string') {
				// Wrap string values in quotes
				vars.push(`${key} = "${value}"`);
			} else {
				// For non-string, non-array types (e.g., numbers, booleans)
				vars.push(`${key} = ${value}`);
			}
		}
		// each key-value pair is "key = value" on a separate line
		return vars.join('\n');
	}
}
