import { exec } from 'child_process';
import { promises as fs } from 'fs';

/**
 * Removes a directory and all of its contents.
 *
 * @param directory The path to the directory.
 */
export const removeDir = async (directory: string): Promise<void> => {
	await fs.rm(directory, { recursive: true });
};

/**
 * Reads a JSON file and returns as an object.
 *
 * @param filePath The path to the JSON file.
 * @returns The parsed JSON object.
 */
export const readJsonFromFile = async (filePath: string): Promise<object> => {
	return JSON.parse(await fs.readFile(filePath, { encoding: 'utf8' }));
};

/**
 * Writes a JSON object to a file.
 *
 * @param filePath The path to the file.
 * @param data The JSON object to write.
 */
export const writeJsonToFile = async (filePath: string, data: object): Promise<void> => {
	await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

/**
 * Executes a command in a given directory.
 *
 * @param directory The directory to execute the command in.
 * @param command The command to execute.
 * @returns The stdout of the command.
 */
export const executeCommands = async (directory: string, command: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: directory }, (error, stdout, stderr) => {
			if (error) {
				reject({ error, stderr });
			} else {
				resolve(stdout);
			}
		});
	});
};