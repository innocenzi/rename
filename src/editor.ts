import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { run } from './run'

export const EDITOR_FILE_NAME = '.BATCH_RENAME'

/**
 * Gets an absolute path to the editor path.
 */
export function getEditorFilePath(directory: string) {
	return join(directory, EDITOR_FILE_NAME)
}

/**
 * Deletes the editor file.
 */
export async function deleteEditorFile(directory: string) {
	await unlink(getEditorFilePath(directory))
}

/**
 * Writes the files in the editor file.
 */
export async function writeEditorFile(directory: string, files: string[]) {
	await writeFile(getEditorFilePath(directory), files.join('\n'))
}

/**
 * Gets the files from the editor file.
 */
export async function readEditorFile(directory: string) {
	const result = await readFile(getEditorFilePath(directory), { encoding: 'utf-8' })

	return result.split('\n').filter((line) => line.length > 0)
}

/**
 * Opens the configured editor with the editor file.
 */
export async function openEditor(directory: string) {
	await run(`code -w ${getEditorFilePath(directory)}`)
}
