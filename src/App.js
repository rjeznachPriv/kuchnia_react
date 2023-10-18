import { useEffect, useState, useRef } from "react";
import './Styles/App.css';
import Quagga from "quagga";

import HeaderComponent from './Components/HeaderComponent.js';
import FooterComponent from './Components/FooterComponent.js';
import CategoriesComponent from './Components/CategoriesComponent.js';
import SuppliesComponent from './Components/SuppliesComponent.js';
import ScannerTabComponent from './Components/ScannerTabComponent.js';
import StoragesComponent from './Components/StoragesComponent.js';
import BarcodeGeneratorComponent from './Components/BarcodeGeneratorComponent.js';

import data from "./Configuration/InitialData.json";
import captions from "./Configuration/LocalizedCaptionsPL.json"
import names from "./Configuration/VitalHTMLids.json";
import InfoModalComponent from './Components/InfoModalComponent';
import ProductsComponent from "./Components/ProductsComponent";

function App() {
    const TITLE_STORAGES = captions.title_storages;
    const TITLE_CATEGORIES = captions.title_categories;
    const TITLE_CAMERA = captions.title_camera;
    const TITLE_SUPPLIES = captions.title_supplies;
    const TITLE_PRODUCTS = captions.title_products;

    const logoModalReference = useRef();

    const [title, setTitle] = useState(captions.default_app_title);
    const [activeTab, setActiveTab] = useState('');

    var barcodeListeners = [];

    useEffect(() => {
        //logoModalReference.current.fadeOutSlow();
        logoModalReference.current.fadeOut();
    }, []);

    const [categories, setCategories] = useState(data.categories); //TODO: read from individual profile
    const [products, setProducts] = useState(data.products);    //TODO: read from common profile?
    const [storages, setStorages] = useState(data.storages);    //TODO: read from individual profile

    function activateTabWithId(newActiveTab) {
        setActiveTab(newActiveTab);
        cutAllCameraStreams();
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
            case names.barcode_generator_tab:
                setTitle('Generator kodów');
                break;
            case 'grocery_list_tab':
                setTitle('Lista zakupów');
                break;
            default:
                setTitle('');
        }
    }

    function cutAllCameraStreams() {
        Quagga.CameraAccess.release()

        var All_mediaDevices = navigator.mediaDevices;
        if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
            // No devices
            return;
        }
        All_mediaDevices.getUserMedia({
            video: true
        })
            .then(function (videoStream) {
                videoStream.getTracks().forEach(t => {
                    t.stop();
                    videoStream.removeTrack(t);
                });
            })
            .catch(function (e) {
                console.log('error:' + e.message);
            });
    }

    function onBarcodeScanned(code) {
        barcodeListeners.forEach((storedCallback) => {
            storedCallback(code);
        });
    }

    function onPictureTaken(pictureBlob) {

    }

    function registerBarcodeListener(listener) {
        barcodeListeners.push(listener);
    }

    //TODO: register PictureTakenListener?

    //TODO: register FilterContentMethod: Czyli po przelaczeniu na tab cgcemy by juz wyfiltrowal....

    return (
        <div className="App">
            <InfoModalComponent
                ref={logoModalReference}
                mainWindowClassName="IntroBackground"
                mainWindowTopBarClassName="IntroSpecialModal"
                topBarXButtonClassName="IntroSpecialModal"
                ContentClassName="IntroSpecialModal">
            </InfoModalComponent>

            <HeaderComponent title={title} />
            <div className="main-content">
                <aside></aside>
                <main>

                    <CategoriesComponent
                        activeTab={activeTab}
                        activateTabWithId={activateTabWithId}
                        categories={categories}
                        setCategories={setCategories}
                        registerBarcodeListener={registerBarcodeListener}
                        onBarcodeScanned={onBarcodeScanned}
                    />
                    <ProductsComponent
                        activeTab={activeTab}
                        activateTabWithId={activateTabWithId}
                        categories={categories}
                        products={products}
                        quagga={Quagga}
                        registerBarcodeListener={registerBarcodeListener}
                        setProducts={setProducts}
                        onBarcodeScanned={onBarcodeScanned}
                    />

                    <StoragesComponent
                        activeTab={activeTab}
                        registerBarcodeListener={registerBarcodeListener}
                        storages={storages}
                        setStorages={setStorages}
                    />

                    <SuppliesComponent
                        activeTab={activeTab}
                        activateTabWithId={activateTabWithId}
                    />

                    <BarcodeGeneratorComponent
                        activeTab={activeTab}
                        activateTabWithId={activateTabWithId}
                    />
                    <ScannerTabComponent
                        activateTabWithId={activateTabWithId}
                        quagga={Quagga}
                        registerBarcodeListener={registerBarcodeListener}
                        onBarcodeScanned={onBarcodeScanned}
                        onPictureTaken={onPictureTaken}
                        activeTab={activeTab}
                    />
                </main>
            </div>
            <FooterComponent
                activeTab={activeTab}
                activateTabWithId={activateTabWithId} />
        </div>
    );
}

export default App;
