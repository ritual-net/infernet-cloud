// Define a custom error type
export interface CommandExecutionError {
	error: Error;
	stderr: string;
}
