import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, useLocation, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import './Styles/App.css';
import Quagga from "quagga";

import HeaderComponent from './Components/HeaderComponent.js';
import FooterComponent from './Components/FooterComponent.js';
import InfoModalComponent from './Components/InfoModalComponent';

import StoragesComponent from './Components/Tabs/StoragesComponent.js';
import CategoriesComponent from './Components/Tabs/CategoriesComponent.js';
import ScannerTabComponent from './Components/Tabs/ScannerTabComponent.js';
import SuppliesComponent from './Components/Tabs/SuppliesComponent.js';
import BarcodeGeneratorComponent from './Components/Tabs/BarcodeGeneratorComponent.js';
import ProductsComponent from "./Components/Tabs/ProductsComponent";

import data from "./Configuration/InitialData.json";
import captions from "./Configuration/LocalizedCaptionsPL.json"
import names from "./Configuration/VitalHTMLids.json";

function App() {
    const tabUrlMapping = {
        [names.categoriesURL]: names.categories_tab,
        [names.productsURL]: names.products_tab,
        [names.storagesURL]: names.storages_tab,
        [names.cameraURL]: names.camera_tab,
        [names.suppliesURL]: names.supplies_tab,
        [names.barcodeGeneratorURL]: names.barcode_generator_tab,
        [names.groceryListURL]: names.grocery_list_tab,
    };

    const tabTitleMapping = {
        [names.categories_tab]: captions.title_categories,
        [names.products_tab]: captions.title_products,
        [names.storages_tab]: captions.title_storages,
        [names.camera_tab]: captions.title_camera,
        [names.supplies_tab]: captions.title_supplies,
        [names.barcode_generator_tab]: captions.title_generator,
        [names.grocery_list_tab]: captions.title_shopping,
    };

    const childRef = useRef();

    const [title, setTitle] = useState(captions.default_app_title);
    const [activeTab, setActiveTab] = useState('');

    var barcodeListeners = [];

    useEffect(() => {
        //logoModalReference.current.fadeOutSlow();
        childRef.current.fadeOut();
    }, []);

    const [categories, setCategories] = useState(data.categories); //TODO: read from common profile?
    const [products, setProducts] = useState(data.products);    //TODO: read from common profile?
    const [storages, setStorages] = useState(data.storages);    //TODO: read from individual profile
    const [supplies, setSupplies] = useState(data.supplies);    //TODO: read from individual profile

    //TODO: implement routing: tab/otherData

    function activateTabWithId(newActiveTab) {
        setActiveTab(newActiveTab);
        cutAllCameraStreams();
        setTitle(tabTitleMapping[newActiveTab]);
    }

    function cutAllCameraStreams() {
        Quagga.CameraAccess.release()

        var All_mediaDevices = navigator.mediaDevices;
        if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
            // No devices
            return;
        }
        All_mediaDevices.getUserMedia({
            video: true //?
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

    function AppRouter() {
        const location = useLocation();
        const path = location.pathname;
        let newTabId = tabUrlMapping[path];
        activateTabWithId(newTabId)
    }

    return (
        <div className="App">
            <Router>
                <InfoModalComponent
                    ref={childRef}
                    mainWindowClassName="IntroBackground"
                    mainWindowTopBarClassName="IntroSpecialModal"
                    topBarXButtonClassName="IntroSpecialModal"
                    ContentClassName="IntroSpecialModal">
                </InfoModalComponent>

                <HeaderComponent title={title} />
                <div className="main-content">
                    <aside></aside>
                    <main>

                        <AppRouter />

                        <CategoriesComponent
                            activeTab={activeTab}
                            activateTabWithId={activateTabWithId}
                            categories={categories}
                            setCategories={setCategories}
                            products={products}
                            setProducts={setProducts}
                            registerBarcodeListener={registerBarcodeListener}
                            onBarcodeScanned={onBarcodeScanned}
                            appChildRef={childRef}
                        />
                        <ProductsComponent
                            activeTab={activeTab}
                            activateTabWithId={activateTabWithId}
                            categories={categories}
                            products={products}
                            setProducts={setProducts}
                            quagga={Quagga}
                            registerBarcodeListener={registerBarcodeListener}
                            onBarcodeScanned={onBarcodeScanned}
                        />

                        <StoragesComponent
                            activeTab={activeTab}
                            activateTabWithId={activateTabWithId}
                            registerBarcodeListener={registerBarcodeListener}
                            storages={storages}
                            setStorages={setStorages}
                        />

                        <SuppliesComponent
                            activeTab={activeTab}
                            activateTabWithId={activateTabWithId}
                            registerBarcodeListener={registerBarcodeListener}
                            products={products}
                            supplies={supplies}
                            storages={storages}
                            setSupplies={setSupplies}

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
                    activateTabWithId={activateTabWithId}
                />

            </Router>
        </div>
    );
}

export default App;
