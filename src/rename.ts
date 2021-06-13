import { readdir, unlink, rename } from 'fs/promises'
import { join } from 'path'
import { deleteEditorFile, openEditor, readEditorFile, writeEditorFile } from './editor'
import { logger } from './logger'

export type Operation = 'DELETE' | 'RENAME' | 'NONE'
export interface Entry {
	initialName: string
	finalName: string
	operation: Operation
}

export interface Options {
	/**
	 * The directory in which to perform the operation.
	 */
	directory: string

	/**
	 * Whether to perform the operations or not.
	 */
	dry: boolean

	/**
	 * Whether to write on the standard output.
	 */
	silent: boolean
}

/**
 * Merges the given options with the default ones.
 */
export function getOptionsWithDefaults(options: Partial<Options>): Options {
	return {
		dry: true,
		silent: false,
		directory: process.cwd(),
		...options,
	}
}

/**
 * Gets an operation type by comparing the initial and final file names.
 */
export function getOperation(initial: string, final: string): Operation {
	if (initial === final) {
		return 'NONE'
	}

	if (final.trim().length === 0) {
		return 'DELETE'
	}

	return 'RENAME'
}

/**
 * Applies the given operation with on the given file.
 */
export async function applyOperation(
	initialFileName: string,
	finalFileName: string,
	operation: Operation,
	options: Options,
) {
	logger.operation(operation, initialFileName, finalFileName)

	if (options.dry) {
		return
	}

	if (operation === 'DELETE') {
		await unlink(join(options.directory, initialFileName))
	}

	if (operation === 'RENAME') {
		await rename(join(options.directory, initialFileName), join(options.directory, finalFileName))
	}
}

/**
 * Prompts the user for a rename in the given directory.
 */
export async function startRenameProcess(options: Partial<Options>) {
	const resolved = getOptionsWithDefaults(options)
	const filesToRename = await readdir(resolved.directory)

	await writeEditorFile(filesToRename)
	await openEditor()

	const renamedFiles = await readEditorFile()

	// If the renamed file count is the same as the original file count plus one,
	// and that last line is empty, it's most likely a line added by an editor, so we
	// remove it to avoid the line count mismatch exception.
	if (filesToRename.length === renamedFiles.length - 1 && renamedFiles.slice(-1).shift()?.length === 0) {
		renamedFiles.pop()
	}

	// If the amount of lines in the file does not equal the amount
	// of files to rename, there will be an offset. It's most likely an error.
	if (filesToRename.length !== renamedFiles.length) {
		throw new Error('Line count mismatch. Operation canceled.')
	}

	const entries: Entry[] = filesToRename.map((initialName, index) => ({
		initialName,
		finalName: renamedFiles[index] ?? '',
		operation: getOperation(initialName, renamedFiles[index]),
	}))

	for (const { initialName, finalName, operation } of entries) {
		await applyOperation(initialName, finalName, operation, resolved)
	}

	logger.feedback(entries, resolved)

	await deleteEditorFile()
}
