import { exec, type ExecException } from 'child_process'
import { promises as fs } from 'fs'

/**
 * Removes a directory and all of its contents.
 *
 * @param directory The path to the directory.
 */
export const removeDir = async (directory: string): Promise<void> => {
	await fs.rm(directory, { recursive: true })
}

/**
 * Reads a JSON file and returns as an object.
 *
 * @param filePath The path to the JSON file.
 * @returns The parsed JSON object.
 */
export const readJsonFromFile = async <T>(filePath: string) => {
	return JSON.parse(await fs.readFile(filePath, { encoding: 'utf8' })) as T
}

/**
 * Writes a JSON object to a file.
 *
 * @param filePath The path to the file.
 * @param data The JSON object to write.
 */
export const writeJsonToFile = async (filePath: string, data: object): Promise<void> => {
	await fs.writeFile(filePath, JSON.stringify(data, null, '\t'), { encoding: 'utf8' })
}

/**
 * Executes a command in a given directory.
 *
 * @param directory The directory to execute the command in.
 * @param command The command to execute.
 * @returns The stdout of the command.
 */
export const executeCommands = async (
	directory: string,
	command: string,
): Promise<{
	error: ExecException | null
	stdout: string
	stderr: string
}> => {
	console.log(`Executing command in directory "${directory}":`)
	console.log(command)

	return new Promise((resolve, reject) => {
		const process = exec(command, { cwd: directory }, (error, stdout, stderr) => {
			resolve({
				error,
				stdout: removeAnsiEscapeCodes(stdout),
				stderr: removeAnsiEscapeCodes(stderr),
			})
		})

		process.on('message', (message) => {
			console.log(directory, command, message)
		})

		process.on('error', (message) => {
			console.error(directory, command, message)
		})
	})
}

// https://github.com/chalk/ansi-regex/blob/main/index.js
export const removeAnsiEscapeCodes = (string: string): string => (
	string
		.replace(
			new RegExp(
				[
					'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
					'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
				].join('|'),
				'g'
			),
			''
		)
)
