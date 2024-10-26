import * as vscode from 'vscode';
import { getSetting, updateSetting } from './settingsManager';

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


// Populates the debug window with text for testing
let isDebug = true;



let isMiniGlimpseEnabled = true;

// Track if request for hiding the minimap is already sheduled; prevents closing after reselecting text
let isMinimapScheduledToHide = false;

// Schedules hiding the minimap
let timer: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension MiniGlimpse is now active!');

    updateSetting('editor', 'minimap.enabled', false);
    updateSetting('editor', 'minimap.autohide', false);

    context.subscriptions.push(
        // Register own commands
        vscode.commands.registerCommand('mini-glimpse.enableMiniGlimpse', enableExtension),
        vscode.commands.registerCommand('mini-glimpse.disableMiniGlimpse', disableExtension),

        // Shadowing the default find command to show minimap when find widget is opened
        vscode.commands.registerTextEditorCommand('actions.find', findWidgetOpened),
        
        // Listen to selection change event
        vscode.window.onDidChangeTextEditorSelection(handleSelectionChange),
    );

    if (isDebug) {
        populateEditorWithText();
    }
}

function enableExtension() {
    isMiniGlimpseEnabled = true;
    vscode.window.showInformationMessage('MiniGlimpse extension enabled.');
}

function disableExtension() {
    isMiniGlimpseEnabled = false;
    // Reset minimap.enabled to its default
    updateSetting('editor', 'minimap.enabled', undefined);
    vscode.window.showInformationMessage('MiniGlimpse extension disabled. Using default VS Code settings.');
}

function handleSelectionChange(event: vscode.TextEditorSelectionChangeEvent) {
    if (!isMiniGlimpseEnabled) {
        return; 
    }

    const isTextSelected = event.selections.some(selection => !selection.isEmpty);

    if (isTextSelected) {
        requestShowMiniMap();
    } else if (!isMinimapScheduledToHide) { 
        requestHideMiniMap();
    }
}


function findWidgetOpened(e:any) {
    // Since shadowing the default command 'disables' it, we need to call the original
    vscode.commands.executeCommand('editor.actions.findWithArgs', {
        searchString: 'test',
        isRegex: false,
        matchWholeWord: false,
        isCaseSensitive: false,
        findInSelection: false
    });
    
    requestShowMiniMap();
}

function requestShowMiniMap() {
    isMinimapScheduledToHide = false; // Text selected, don't hide
    showMinimap();
}

function requestHideMiniMap() {
    // No text selected, schedule hiding if not already scheduled
    isMinimapScheduledToHide = true;
    if (timer) {
        clearTimeout(timer); 
    }

    updateSetting('editor', 'minimap.autohide', true);
    
    scheduleHideMiniMap(); 
}

function scheduleHideMiniMap() {
    timer = setTimeout(() => {
        if (isMinimapScheduledToHide) { // Double-check if request still valid
            hideMiniMap();
        }
        timer = undefined;
    }, 500);
}

function showMinimap() {
    updateSetting('editor', 'minimap.enabled', true);
    updateSetting('editor', 'minimap.autohide', false);
}

function hideMiniMap(){
    updateSetting('editor', 'minimap.enabled', false);
    updateSetting('editor', 'minimap.autohide', false);
}

export function deactivate() { }



///
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