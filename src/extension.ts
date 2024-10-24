import * as vscode from 'vscode';

///
/// This extension hides the minimap when no text is selected and shows it when text is selected.
///
/// The extension is enabled by default. To disable it, run the command "MiniGlimpse: Disable Minimap".
/// To enable it back, run the command "MiniGlimpse: Enable Minimap".
///
/// The extension listens to the "onDidChangeTextEditorSelection" event to detect text selection.
/// It works by setting the following editor settings:
/// - minimap.enabled
/// - minimap.disabled
/// - minimap.autohide
///
/// Accomodates issue #232011: Show minimap only during search (https://github.com/microsoft/vscode/issues/232011)
///

///
/// TODOs:
/// [ ]  - settings: enable/disable, autohide delay, use autohide animation
/// [ ]  - save minimap and autohide settings on first init and restore to when disabled
/// [ ]  - debounce handleSelectionChange
/// [ ]  - tests
///      - Add Features:
///         [ ] - fade in animation (not directly supported by VS Code, needs manually transitioning opacity)
///         [ ] - autohide delay setting
///         [ ] - open / close when search is active

///


let isDebug = true;

let isExtensionEnabled = true;
let timer: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension MiniGlimpse is now active!');

    vscode.workspace.getConfiguration('editor').update('minimap.enabled', false, vscode.ConfigurationTarget.Global);
    vscode.workspace.getConfiguration('editor').update('minimap.autohide', false, vscode.ConfigurationTarget.Global);
    
    context.subscriptions.push(
        vscode.commands.registerCommand('mini-glimpse.enableMiniGlimpse', enableExtension),
        vscode.commands.registerCommand('mini-glimpse.disableMiniGlimpse', disableExtension)
    );

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(handleSelectionChange)
    );

    if (isDebug) {
        populateEditorWithText();
    }
}

function enableExtension() {
    isExtensionEnabled = true;
    vscode.window.showInformationMessage('MiniGlimpse extension enabled.');
}

function disableExtension() {
    isExtensionEnabled = false;
    // Reset minimap.enabled to its default
    vscode.workspace.getConfiguration('editor').update('minimap.enabled', undefined, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('MiniGlimpse extension disabled. Using default VS Code settings.');
}

let isMinimapScheduledToHide = false; // Track if request for hiding the minimap is already sheduled; prevents closing after reselecting text

function handleSelectionChange(event: vscode.TextEditorSelectionChangeEvent) {
    if (!isExtensionEnabled) {
        return; 
    }

    const isTextSelected = event.selections.some(selection => !selection.isEmpty);

    if (isTextSelected) {
        isMinimapScheduledToHide = false; // Text selected, don't hide
        vscode.workspace.getConfiguration('editor').update('minimap.enabled', true, vscode.ConfigurationTarget.Global);
        vscode.workspace.getConfiguration('editor').update('minimap.autohide', false, vscode.ConfigurationTarget.Global); 
    } else if (!isMinimapScheduledToHide) { 
        // No text selected, schedule hiding if not already scheduled
        isMinimapScheduledToHide = true;
        if (timer) {
            clearTimeout(timer); 
        }

        vscode.workspace.getConfiguration('editor').update('minimap.autohide', true, vscode.ConfigurationTarget.Global);
        
        timer = setTimeout(() => {
            if (isMinimapScheduledToHide) { // Double-check if request still valid
                vscode.workspace.getConfiguration('editor').update('minimap.enabled', false, vscode.ConfigurationTarget.Global);
                vscode.workspace.getConfiguration('editor').update('minimap.autohide', false, vscode.ConfigurationTarget.Global);
            }
            timer = undefined;
        }, 500); 
    }
}

export function deactivate() { }

/// Debugging helper function to populate the editor with text
const populateEditorWithText = async () => {
    const document = await vscode.workspace.openTextDocument({ content:
        'Sample text to select for debugging.\n' +
        'Yadda Yadda try and select me.\n' +
        ' \n' +
        ' \n' +
        'I am a text that you can select.\n' +
        'Select me to see the minimap.\n' +
        'Unselect me to hide the minimap.\n' +
        ' \n' +
        ' \n' +
        'Select me to see the minimap.\n' +
        'Unselect me to hide the minimap.\n' +
        ' \n' +
        ' \n' +
        ' \n' +
        ' \n' +
        'Love You! ❤️'
    });
    await vscode.window.showTextDocument(document);
};