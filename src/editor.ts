import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { run } from './run'
import temp from 'temp-dir'

export const EDITOR_FILE_NAME = '.BATCH_RENAME'
export const EDITOR_FILE_PATH = join(temp, EDITOR_FILE_NAME)

/**
 * Deletes the editor file.
 */
export async function deleteEditorFile() {
	await unlink(EDITOR_FILE_PATH)
}

/**
 * Writes the files in the editor file.
 */
export async function writeEditorFile(files: string[]) {
	await writeFile(EDITOR_FILE_PATH, files.join('\n'))
}

/**
 * Gets the files from the editor file.
 */
export async function readEditorFile() {
	const result = await readFile(EDITOR_FILE_PATH, { encoding: 'utf-8' })

	return result.split('\n').filter((line) => line.length > 0)
}

/**
 * Opens the configured editor with the editor file.
 */
export async function openEditor() {
	await run(`code -w ${EDITOR_FILE_PATH}`)
}
