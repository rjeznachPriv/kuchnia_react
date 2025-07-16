import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, useLocation, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { saveState, loadState } from './utils/dataManager.js';

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

    const logoModalReference = useRef();

    var barcodeListeners = [];

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [storages, setStorages] = useState([]);
    const [supplies, setSupplies] = useState([]);

    const [title, setTitle] = useState(captions.default_app_title);
    const [activeTab, setActiveTab] = useState('');
    const [filterPhrase, setFilterPhrase] = useState('');

    useEffect(() => {
        let data = loadState();
        setCategories(data.categories);
        setProducts(data.products);
        setStorages(data.storages);
        setSupplies(data.supplies);

        //logoModalReference.current.fadeOutSlow();
        logoModalReference.current.fadeOut();
    }, []);

    useEffect(() => {
        saveState({ categories: categories, products: products, storages: storages, supplies: supplies });
    }, [categories, products, storages, supplies]);

    //TODO: implement routing: tab/otherData (search query, specific item by id)

    function activateTabWithId(newActiveTab, newFilterPhrase) {
        console.log(newActiveTab, newFilterPhrase);
        setActiveTab(newActiveTab);
        cutAllCameraStreams();
        setTitle(tabTitleMapping[newActiveTab]);
        setFilterPhrase(newFilterPhrase);
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
        console.log(`barcode scanned (${code}). Listeners:`);
        console.log(barcodeListeners);

        barcodeListeners.forEach((storedCallback) => {
            storedCallback(code);
        });
    }

    function onPictureTaken(pictureBlob) {
        console.log('picture taken!');
        console.log(pictureBlob);
    }

    function registerBarcodeListener(listener) {
        barcodeListeners.push(listener);
    }

    //TODO: register PictureTakenListener?

    function AppRouter() {
        const location = useLocation();
        const path = location.pathname;

        useEffect(() => {
            let pathArr = path.split('/');
            let segment1 = `/${pathArr[1]}`;
            let newTabId = tabUrlMapping[segment1];
            let newFilterPhrase = "";
            if (pathArr.length > 2) {
                newFilterPhrase = pathArr.pop();
            }

            activateTabWithId(newTabId, newFilterPhrase);
        }, [path]);

        return null;
    }

    //function AppRouter() {
    //    const location = useLocation();
    //    const path = location.pathname;
    //    let newTabId = tabUrlMapping[path];
    //    activateTabWithId(newTabId)
    //}

    return (
        <div className="App">
            <Router>
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
                            filterPhrase={filterPhrase}
                            setFilterPhrase={setFilterPhrase}
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
                            filterPhrase={filterPhrase}
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
