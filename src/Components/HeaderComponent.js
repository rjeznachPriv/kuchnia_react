import { useState } from "react";
import { saveSettings, loadSettings } from './../utils/settingsManager.js';
import { useAppSettingsStore } from "./../utils/appSettingsStore.js";
import { BsFillGearFill } from 'react-icons/bs';
import InfoModalComponent from './InfoModalComponent.js';
import './../Styles/HeaderComponent.css';
import { renderFieldComponent } from "./Form/fieldComponent.js";

function HeaderComponent(props) {
    const { appSettings, setAppSettings } = useAppSettingsStore();
    const [settingsModalClass, setSettingsModalClass] = useState("fadeOut");

    const [settingsValues, setSettingsValues] = useState(appSettings);
    //const [settingsValues, setSettingsValues] = useState(() => Object.fromEntries(Object.keys(appSettings).map(field => [field, appSettings[field]])) );

    //const [itemToEditValues, setItemToEditValues] = useState(() =>
    //    Object.fromEntries(props.columns.map(field => [field.name, ""]))
    //);

    function onSaveChangesClicked() {
        setAppSettings(settingsValues);
        saveSettings(settingsValues);
        setSettingsModalClass('fadeOut');
    }

    function OpenSettingsWindow() {
        setSettingsModalClass('fadeIn');
    }

    function updateSettingFor(name) {
        return (newValue) => {
            setSettingsValues(prev => ({
                ...prev,
                [name]: {
                    ...prev[name],
                    value: newValue
                }
            }));
        };
    }

    function generateContentLines() {

        let contentLines = [];
        for (var key in settingsValues) {
            settingsValues[key] =
            {
                ...settingsValues[key],
                displayName: `${key}             TODO`,
                description: " TODOtest2"
            }; //TODO: add values from translation file
            contentLines.push(renderFieldComponent(settingsValues[key], settingsValues[key].value, updateSettingFor(key), true, undefined, undefined, undefined, appSettings));
        }

        return contentLines;
    }

    return (
        <header id="app-top-header">
            {props.title}

            <a className="settings-button" onClick={() => OpenSettingsWindow()}>
                <p className="icon"><BsFillGearFill></BsFillGearFill></p>
                <p className="caption">Ustawienia</p>
            </a>

            <InfoModalComponent
                mainWindowClassName={`modal-app-settings ${settingsModalClass}`}
                mainWindowTopBarClassName="modal-app-settings-top-bar"
                topBarXButtonClassName="modal-app-settings-x-button"
                ContentClassName="modal-app-settings-content"
                title="TODO Ustawienia aplikacji"
                contentLines={generateContentLines()}
                button1Text="TODO Porzuæ zmiany"
                button1Class="modal-app-settings-button1"
                button1Action={() => setSettingsModalClass('fadeOut')}
                button2Text="TODO Zapisz zmiany"
                button2Class="modal-app-settings-button1"
                button2Action={() => onSaveChangesClicked()}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={() => setSettingsModalClass('fadeOut')}>
            </InfoModalComponent>
        </header>
    );
}

export default HeaderComponent;
