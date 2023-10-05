import { useEffect, useState, useRef } from "react";
import './Styles/App.css';

import HeaderComponent from './Components/HeaderComponent.js';
import FooterComponent from './Components/FooterComponent.js';
import SuppliesComponent from './Components/SuppliesComponent.js';
import ScannerComponent from './Components/ScannerComponent.js';
import StoragesComponent from './Components/StoragesComponent.js';
import BarcodeGeneratorComponent from './Components/BarcodeGeneratorComponent.js';

import captions from "./Configuration/LocalizedCaptionsPL.json"
import names from "./Configuration/VitalHTMLids.json";
import InfoModalComponent from './Components/InfoModalComponent';

function App() {
    const TITLE_STORAGES = captions.title_storages;
    const TITLE_CATEGORIES = captions.title_categories;
    const TITLE_CAMERA = captions.title_camera;
    const TITLE_SUPPLIES = captions.title_supplies;
    const TITLE_PRODUCTS = captions.title_products;

    const logoModalReference = useRef();

    const [title, setTitle] = useState(captions.default_app_title);
    const [activeTab, setActiveTab] = useState('');

    const [appStates, setAppStates] = useState([
        { name: "scanner", component: ScannerComponent },
        { name: "storages", component: StoragesComponent },
    ]);
    const [allowedTransitions, setAllowedTransitions] = useState([


    ]);
    const [currentAppState, setCurrentAppState] = useState(null);

    var barcodeListeners = [];


    useEffect(() => {
        console.log('a');
        //logoModalReference.current.fadeOutSlow();
        logoModalReference.current.fadeOut();
    }, []);



    function AdvanceStateMachine(targetState) {
        if (currentAppState == null) {
            performTransition(appStates[0]);
            return;
        }

        var allowedStateTransfers = allowedTransitions.filter(function (element) {
            if (element.from == currentAppState.name) {
                return element;
            }
        });

        if (allowedTransitions.length == 1) {
            targetState = appStates.find(function (element) {
                if (element.name == allowedStateTransfers[0].to) {
                    return element;
                }
            });

            performTransition(targetState);

        } else {
            //if no parameter and more than one transition allowed throw exception!
            // if parameter and is allowd then perform.
            // if parameter and not allowed throw exception.
            console.log('target state:');
            console.log(targetState);
        }
    }

    function performTransition(targetState) {
        //jQuery('.statediv').fadeOut();
        currentAppState = targetState;
        //jQuery(targetState.selector).fadeIn();
    }

    function onBottomButtonClick(newActiveTab) {
        setActiveTab(newActiveTab);

        switch (newActiveTab) {
            case names.storages_tab:
                setTitle(TITLE_STORAGES)
                break;
            case names.categories_tab:
                setTitle(TITLE_CATEGORIES)
                break;
            case names.camera_tab:
                setTitle(TITLE_CAMERA)
                break;
            case names.supplies_tab:
                setTitle(TITLE_SUPPLIES)
                break;
            case names.products_tab:
                setTitle(TITLE_PRODUCTS)
                break;
            case 'barcode_generator_tab':
                setTitle('Generator kodów');
                break;
            case 'grocery_list_tab':
                setTitle('Lista zakupów');
                break;
            default:
                setTitle('');
        }
    }

    function onBarcodeScanned(code) {
        barcodeListeners.forEach((element) => {
            element(code);
        });
    }

    function onPictureTaken(pictureBlob) {
    }

    function registerBarcodeListener(listener) {
        barcodeListeners.push(listener);
    }

    //TODO: register PictureTakenListener

    return (
        <div className="App">
            <InfoModalComponent
                ref={logoModalReference}
                mainWindowClassName="IntroBackground"
                mainWindowTopBarClassName="IntroSpecialModal"
                topBarXButtonClassName="IntroSpecialModal"
                ContentClassName="IntroSpecialModal"
                title="" text="">
            </InfoModalComponent>

            <HeaderComponent title={title} />
            <div className="main-content">
                <aside></aside>
                <main>
                    <BarcodeGeneratorComponent activeTab={activeTab} />
                    <SuppliesComponent activeTab={activeTab} />
                    <ScannerComponent
                        onBarcodeScanned={onBarcodeScanned}
                        onPictureTaken={onPictureTaken}
                        activeTab={activeTab} />
                    <StoragesComponent
                        activeTab={activeTab}
                        registerBarcodeListener={registerBarcodeListener}
                    />
                </main>
            </div>
            <FooterComponent
                activeTab={activeTab}
                onBottomButtonClick={onBottomButtonClick} />
        </div>
    );
}

export default App;
