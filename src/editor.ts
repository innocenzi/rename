import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { run } from './run'
import temp from 'temp-dir'

export const EDITOR_FILE_NAME = '.BATCH_RENAME'
export const EDITOR_FILE_PATH = join(temp, EDITOR_FILE_NAME)

/**
 * Gets the command used to start the editor.
 */
export function getEditorCommand() {
	return process.env.RENAME_EDITOR ?? process.env.EDITOR ?? 'code -w'
}

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
	return (await readFile(EDITOR_FILE_PATH, { encoding: 'utf-8' })).split('\n')
}

/**
 * Opens the configured editor with the editor file.
 */
export async function openEditor() {
	try {
		await run(`${getEditorCommand()} ${EDITOR_FILE_PATH}`)
	} catch (error) {
		throw new Error('Could not open an editor. Make sure the RENAME_EDITOR or EDITOR environment variable is set up.')
	}
}
