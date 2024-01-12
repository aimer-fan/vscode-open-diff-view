// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parse } from "node:path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('open-diff-view.quickDiff', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let sourceUri = vscode.window.activeTextEditor?.document.uri;
		console.log("disposable -> sourceUri", sourceUri);

		if (!sourceUri) {
			vscode.window.showErrorMessage("No active editor found.");
			return;
		}

		if (sourceUri.scheme !== "file") {
			vscode.window.showErrorMessage("The active editor must be a file.");
			return;
		}

		// read source uri content
		const sourceContent = (await vscode.workspace.fs.readFile(sourceUri)).toString();
		const { base } = parse(sourceUri.path);

		// create a untitled file
		const blankUri = vscode.Uri.parse(`untitled:${sourceUri.path}`);
		// set default content
		const editor = new vscode.WorkspaceEdit();
		editor.insert(blankUri, new vscode.Position(0, 0), sourceContent);
		await vscode.workspace.applyEdit(editor);

		vscode.commands.executeCommand("vscode.diff", sourceUri, blankUri, `Diff View(${base})`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
