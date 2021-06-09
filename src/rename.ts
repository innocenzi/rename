import { readdir, unlink, rename } from 'fs/promises'
import { gray, red, strikethrough, yellow } from 'kleur/colors'
import { question } from './question'
import { join } from 'path'
import { deleteEditorFile, openEditor, readEditorFile, writeEditorFile } from './editor'

export type Operation = 'DELETE' | 'RENAME' | 'NONE'
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
function getOptionsWithDefaults(options: Partial<Options>): Options {
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
	// TODO: clean up

	if (operation === 'DELETE') {
		console.log(`[${red('delete')}] ${gray(initialFileName)} » ${red(strikethrough(initialFileName))}`)

		if (!options.dry) {
			await unlink(join(options.directory, initialFileName))
		}
	}

	if (operation === 'RENAME') {
		console.log(`[${yellow('rename')}] ${gray(initialFileName)} » ${yellow(finalFileName)}`)

		if (!options.dry) {
			await rename(join(options.directory, initialFileName), join(options.directory, finalFileName))
		}
	}

	if (operation === 'NONE') {
		console.log(`  [${gray('keep')}] ${gray(initialFileName)} » ${gray(finalFileName)}`)
	}
}

/**
 * Prompts the user for a rename in the given directory.
 */
export async function startRenameProcess(options: Partial<Options>) {
	const resolved = getOptionsWithDefaults(options)
	const filesToRename = await readdir(resolved.directory)

	await writeEditorFile(resolved.directory, filesToRename)
	await openEditor(resolved.directory)

	const renamedFiles = await readEditorFile(resolved.directory)

	// TODO: clean up
	if (filesToRename.length !== renamedFiles.length) {
		const result = await question(
			`[${yellow(
				'warning',
			)}] Amount of lines does not match initial list of files, there is likely a mismatch. Continue? `,
		)

		if (!['y', 'o'].includes(result.toLowerCase())) {
			await deleteEditorFile(resolved.directory)
			process.exit(0)
		}
	}

	for (let i = 0; i < filesToRename.length; i++) {
		const initialName = filesToRename[i] ?? ''
		const finalName = renamedFiles[i] ?? ''
		const operation = getOperation(initialName, finalName)

		await applyOperation(initialName, finalName, operation, resolved)
	}

	// TODO: better end-of-operation feedback

	await deleteEditorFile(resolved.directory)
}
