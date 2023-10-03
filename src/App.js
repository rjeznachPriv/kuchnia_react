import { useState } from 'react';

import './Styles/App.css';

import HeaderComponent from './Components/HeaderComponent.js';
import FooterComponent from './Components/FooterComponent.js';
import ScannerComponent from './Components/ScannerComponent.js';
import StoragesComponent from './Components/StoragesComponent.js';

import captions from "./Configuration/LocalizedCaptionsPL.json"
import names from "./Configuration/VitalHTMLids.json";
import InfoModalComponent from './Components/InfoModalComponent';

function App() {
    const TITLE_STORAGES = captions.title_storages;
    const TITLE_CATEGORIES = captions.title_categories;
    const TITLE_CAMERA = captions.title_camera;
    const TITLE_SUPPLIES = captions.title_supplies;
    const TITLE_PRODUCTS = captions.title_products;

    var [title, setTitle] = useState(captions.default_app_title);
    var [activeTab, setActiveTab] = useState('');

    function onBottomButtonClick(newActiveTab) {
        setActiveTab(newActiveTab);

        switch (newActiveTab) {
            case names.storages_tab_button:
                setTitle(TITLE_STORAGES)
                break;
            case names.categories_tab_button:
                setTitle(TITLE_CATEGORIES)
                break;
            case names.camera_tab_button:
                setTitle(TITLE_CAMERA)
                break;
            case names.supplies_tab_button:
                setTitle(TITLE_SUPPLIES)
                break;
            case names.products_tab_button:
                setTitle(TITLE_PRODUCTS)
                break;
            default:
                title = '';
        }
    }

    function onBarcodeScanned(code) {
        console.log(`Proper code: ${code}`);
    }

    function onPictureTaken(pictureBlob) {
    }

    return (
        <div className="App">
            <InfoModalComponent></InfoModalComponent>

            <HeaderComponent title={title} />
            <div className="main-content">
                <aside></aside>
                <main>
                    <ScannerComponent onBarcodeScanned={onBarcodeScanned} onPictureTaken={onPictureTaken} activeTab={activeTab} />
                    <StoragesComponent activeTab={activeTab}/>
                </main>
            </div>
            <FooterComponent activeTab={activeTab} onBottomButtonClick={onBottomButtonClick} />
        </div>
    );
}

export default App;
