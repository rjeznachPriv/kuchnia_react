import { BsFillGearFill } from 'react-icons/bs';
import InfoModalComponent from './InfoModalComponent.js';
import './../Styles/HeaderComponent.css';

function HeaderComponent(props) {

    function OpenSettingsWindow() {
        console.log('settings');
    }

    return (
        <header id="app-top-header">
            {props.title}

            <a className="settings-button" onClick={() => OpenSettingsWindow()}>
                <p className="icon"><BsFillGearFill></BsFillGearFill></p>
                <p className="caption">Ustawienia</p>
            </a>

            <InfoModalComponent
                mainWindowClassName={`modal-app-settings none`}
                mainWindowTopBarClassName="modal-app-settings-top-bar"
                topBarXButtonClassName="modal-app-settings-x-button"
                ContentClassName="modal-app-settings-content"
                title="TODO Ustawienia aplikacji"
                text="text"
                content="content"
                button1Text="TODO Porzuæ zmiany"
                button1Class="modal-app-settings-button1"
                button1Action=""
                button2Text="TODO Zapisz zmiany"
                button2Class="modal-app-settings-button1"
                button2Action=""
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut="">
            </InfoModalComponent>
        </header>
    );
}

export default HeaderComponent;
