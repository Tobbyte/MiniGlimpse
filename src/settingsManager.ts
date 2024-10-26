import * as vscode from 'vscode';

let TARGET = vscode.ConfigurationTarget.Global;

function getConfiguration(section: string) {
    return vscode.workspace.getConfiguration(section);
}

export function getSetting(section: string, key: string) {
    return getConfiguration(section).get(key);
}

export function updateSetting(section: string, key: string, value: any) {
    return getConfiguration(section).update(key, value, TARGET);
}