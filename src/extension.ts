import * as vscode from 'vscode';

let isExtensionEnabled = true;
let needDisable = false;
let isTextSelected = false;
let timer: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "mini-glimpse" is now active!');

    let enableDisposable = vscode.commands.registerCommand('mini-glimpse.enableMinimap', () => {
        isExtensionEnabled = true;
        vscode.window.showInformationMessage('MiniGlimpse extension enabled.');
    });

    let disableDisposable = vscode.commands.registerCommand('mini-glimpse.disableMinimap', () => {
        isExtensionEnabled = false;
        // Reset minimap.enabled to its default (let VS Code handle it)
        vscode.workspace.getConfiguration('editor').update('minimap.enabled', undefined, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('MiniGlimpse extension disabled. Using default VS Code settings.');
    });

    context.subscriptions.push(
        enableDisposable,
        disableDisposable,
        vscode.window.onDidChangeTextEditorSelection(handleSelectionChange)

    );

    populateEditorWithText();
}



function handleSelectionChange(event: vscode.TextEditorSelectionChangeEvent) {

    if (!isExtensionEnabled) {
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    if (!event.selections[0].isEmpty) {
        isTextSelected = true;
        
        clearTimer();
        enableMM();

    } else {
        isTextSelected = false;
        
        if (needDisable) {
            disableMM();
        }
    }
    console.log(isTextSelected);
};

function enableMM() {
    needDisable = true;
    vscode.workspace.getConfiguration('editor').update('minimap.enabled', true, vscode.ConfigurationTarget.Global);
}

function clearTimer(){
    clearTimeout(timer);
    timer = undefined;
};

function disableMM() {
    clearTimer();
    
    vscode.workspace.getConfiguration('editor').update('minimap.autohide', true, vscode.ConfigurationTarget.Global);

    timer = setTimeout(() => {
        if (!isTextSelected) {
            vscode.workspace.getConfiguration('editor').update('minimap.enabled', false, vscode.ConfigurationTarget.Global);
            vscode.workspace.getConfiguration('editor').update('minimap.autohide', false, vscode.ConfigurationTarget.Global);
        
            needDisable = false;
        }
        
        timer = undefined;

    }, 510);
}

const populateEditorWithText = async () => {
    const document = await vscode.workspace.openTextDocument({ content: 'Sample text to select for debugging.' });
    await vscode.window.showTextDocument(document);
};

export function deactivate() { }