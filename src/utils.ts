import { access } from 'fs/promises'

export async function invoke(fn: Function, handleError?: (error: Error) => void) {
	try {
		return await fn()
	} catch (error) {
		handleError?.(error)
	}
}

export async function tap<T>(value: T, callback: (value: T) => Promise<void>): Promise<T> {
	await callback(value)
	return value
}

export async function ensureExists(path: string) {
	try {
		await access(path)
	} catch (error) {
		throw new Error(`Could not access ${path}.`)
	}
}
