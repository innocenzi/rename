import { rm, rename } from 'fs/promises'
import { join } from 'path'
import { deleteEditorFile, openEditor, readEditorFile, writeEditorFile } from './editor'
import { logger } from './logger'
import { tap } from './utils'
import match from 'fast-glob'

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

	/**
	 * The glob pattern to match the files to be processed.
	 */
	glob: string

	/**
	 * Only match directories.
	 */
	onlyDirectories: boolean
		
	/**
	 * Only match files.
	 */
	onlyFiles: boolean

	/**
	 * Defines the maximum depth for globstars.
	 */
	depth: number
}

/**
 * Merges the given options with the default ones.
 */
export function getOptionsWithDefaults(options: Partial<Options>): Options {
	return {
		dry: false,
		silent: false,
		directory: process.cwd(),
		glob: '*',
		onlyDirectories: false,
		onlyFiles: false,
		depth: Infinity,
		...JSON.parse(JSON.stringify(options)), // not that slow for that size
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
 * Checks if a parent of the given path has been deleted in the given operations.
 */
function parentHasBeenDeleted(path: string, operations: Entry[]) {
	const deletions = operations.filter(({ operation }) => operation === 'DELETE')

	return Boolean(deletions.find(({ initialName: previouslyDeletedPath }) => {
		// Ignores the current path.
		if (previouslyDeletedPath === path) {
			return false
		}

		return path.startsWith(previouslyDeletedPath)
	}))
}

/**
 * Returns an up-to-date path given a path and an operation.
 */
function getRenamedPath(path: string, operations: Entry[]): string {
	// Finds a previously renamed path corresponding to the currently-being-renamed one.
	const renames = operations.filter(({ operation }) => operation === 'RENAME')
	const previousDirectoryRename = renames.find(({ initialName: previouslyRenamedPath }) => {
		// Ignores the current path.
		if (previouslyRenamedPath === path) {
			return false
		}

		return path.startsWith(previouslyRenamedPath)
	})

	// If there was a corresponding renamed path, the current one needs to be replaced accordingly to avoid
	// trying to rename something that no longer exists.
	return previousDirectoryRename
		? path.replace(previousDirectoryRename.initialName, previousDirectoryRename.finalName)
		: path
}

/**
 * Applies the given operation with on the given file.
 */
export async function applyOperation(
	initialFileName: string,
	finalFileName: string,
	operation: Operation,
	operations: Entry[],
	options: Options,
) {
	logger.operation(operation, initialFileName, finalFileName)

	if (options.dry) {
		return
	}

	// If the parent path has been deleted, we can ignore.
	if (parentHasBeenDeleted(initialFileName, operations)) {
		return
	}

	if (operation === 'DELETE') {
		await rm(join(options.directory, initialFileName), { recursive: true, force: true })
	}

	if (operation === 'RENAME') {
		await rename(join(options.directory, getRenamedPath(initialFileName, operations)), join(options.directory, finalFileName))
	}
}

/**
 * Finds file based on the given options.
 */
export async function getFiles(options: Options): Promise<string[]> {
	return await match(options.glob, {
		cwd: options.directory,
		onlyDirectories: options.onlyDirectories,
		onlyFiles: options.onlyFiles,
		deep: options.depth
	})
}

/**
 * Prompts the user for a rename in the given directory.
 */
export async function startRenameProcess(options: Partial<Options>) {
	const resolved = getOptionsWithDefaults(options)
	const filesToRename = await getFiles(resolved)

	// If there is no file to rename, we can exit directly.
	if (filesToRename.length === 0) {
		logger.info('No files to rename.')
		return
	}

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
		await applyOperation(initialName, finalName, operation, entries, resolved)
	}

	logger.feedback(entries, resolved)

	await deleteEditorFile()
}
