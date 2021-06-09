import { access } from 'fs/promises'
import { resolve } from 'path'

export async function invoke(fn: Function, handleError?: (error: Error) => void) {
	try {
		return await fn()
	} catch (error) {
		handleError?.(error)
	}
}

export function tap<T>(value: T, callback: (value: T) => void): T {
	callback(value)
	return value
}

export async function findDirectory(directory: string) {
	if (!directory?.length) {
		return process.cwd()
	}

	try {
		await access(resolve(directory))
		return resolve(directory)
	} catch {
		throw new Error(`Can not access ${directory}.`)
	}
}
