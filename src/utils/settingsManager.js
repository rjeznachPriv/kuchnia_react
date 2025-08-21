import initialSettings from "./../Configuration/InitialAppSettings.json";

const settingsKey = 'settings';

export function saveSettings(settings) {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}

export function loadSettings() {
    if (!localStorage.hasOwnProperty(settingsKey)) {
        saveSettings(initialSettings);
        return initialSettings;
    } else {
        let data = JSON.parse(localStorage.getItem(settingsKey));
        return data;
    }
}
