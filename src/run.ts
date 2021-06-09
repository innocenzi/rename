import { promisify } from 'util'
import { exec } from 'child_process'

export async function run(command: string) {
	return promisify(exec)(command)
}
