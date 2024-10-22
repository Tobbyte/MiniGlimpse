import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "minimap-orientation" is now active!');

    let disposable = vscode.commands.registerCommand('minimap-orientation.helloWorld', () => {
        vscode.window.showInformationMessage('Minimap will be shown when text is selected.');
    });

    context.subscriptions.push(disposable);

    vscode.window.onDidChangeTextEditorSelection((event) => {
        const editor = event.textEditor;
        const selections = editor.selections;

        if (selections.some(selection => !selection.isEmpty)) {
            vscode.workspace.getConfiguration('editor').update('minimap.enabled', true, vscode.ConfigurationTarget.Global);
        } else {
            vscode.workspace.getConfiguration('editor').update('minimap.enabled', false, vscode.ConfigurationTarget.Global);
        }
    });
}

export function deactivate() {}