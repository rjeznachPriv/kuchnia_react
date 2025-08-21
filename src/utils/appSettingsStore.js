import { create } from "zustand";
import { loadSettings } from './settingsManager';

export const useAppSettingsStore = create(set => ({
    appSettings: loadSettings(),
    setAppSettings: (settings) => set({ appSettings: settings })
}));