import * as vscode from 'vscode';

let isExtensionEnabled = true;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "mini-glimpse" is now active!');

    let enableDisposable = vscode.commands.registerCommand('mini-glimpse.enableMinimap', () => {
        isExtensionEnabled = true;
        vscode.window.showInformationMessage('Minimap orientation extension enabled.');
    });

    let disableDisposable = vscode.commands.registerCommand('mini-glimpse.disableMinimap', () => {
        isExtensionEnabled = false;
        // Reset minimap.enabled to its default (let VS Code handle it)
        vscode.workspace.getConfiguration('editor').update('minimap.enabled', undefined, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('Minimap orientation extension disabled. Using default VS Code settings.');
    });

    context.subscriptions.push(enableDisposable, disableDisposable);

    const updateMinimapVisibility = () => {
        if (!isExtensionEnabled) {
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selections = editor.selections;
        const searchHighlight = selections.some(selection => !selection.isEmpty);

        if (searchHighlight) {
            vscode.workspace.getConfiguration('editor').update('minimap.enabled', true, vscode.ConfigurationTarget.Global);
        } else {
            vscode.workspace.getConfiguration('editor').update('minimap.enabled', false, vscode.ConfigurationTarget.Global);
        }
    };

    vscode.window.onDidChangeTextEditorSelection(updateMinimapVisibility);
    vscode.workspace.onDidChangeTextDocument(updateMinimapVisibility);
}

export function deactivate() {}