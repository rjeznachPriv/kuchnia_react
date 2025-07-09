import './../Styles/FooterComponent.css';
import { FaCamera } from 'react-icons/fa';
import { FaAppleAlt } from 'react-icons/fa';
import { MdShelves } from 'react-icons/md';
import { MdForklift } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';
import { FaBarcode } from 'react-icons/fa';

import { FaList } from 'react-icons/fa';

import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

import BottomButtonComponent from './BottomButtonComponent.js';

function FooterComponent(props) {

    const PRODUCTS_CAPTION = captions.title_products;
    const SUPPLIES_CAPTION = captions.title_supplies;
    const CATEGORIES_CAPTION = captions.title_categories;
    const STORAGES_CAPTION = captions.title_storages;
    const GENERATOR_CAPTION = captions.title_generator;
    const SHOPPING_CAPTION = captions.title_shopping;

    return (
        <footer id="app-footer">
            <BottomButtonComponent icon={<MdCategory />} caption={CATEGORIES_CAPTION} targetUrl={names.categoriesURL} active={props.activeTab === names.categories_tab} footerProps={props} id={names.categories_tab_button} enableTab={names.categories_tab} />
            <BottomButtonComponent icon={<FaAppleAlt />} caption={PRODUCTS_CAPTION} targetUrl={names.productsURL} active={props.activeTab === names.products_tab} footerProps={props} id={names.products_tab_button} enableTab={names.products_tab} />
            <BottomButtonComponent icon={<MdShelves />} caption={STORAGES_CAPTION} targetUrl={names.storagesURL} active={props.activeTab === names.storages_tab} footerProps={props} id={names.storages_tab_button} enableTab={names.storages_tab} />
            <BottomButtonComponent icon={<FaCamera />} caption="" footerProps={props} targetUrl={names.cameraURL} active={props.activeTab === names.camera_tab} id={names.camera_tab_button} enableTab={names.camera_tab} />
            <BottomButtonComponent icon={<MdForklift />} caption={SUPPLIES_CAPTION} targetUrl={names.suppliesURL} active={props.activeTab === names.supplies_tab} footerProps={props} id={names.supplies_tab_button} enableTab={names.supplies_tab} />
            <BottomButtonComponent icon={<FaBarcode />} caption={GENERATOR_CAPTION} targetUrl={names.barcodeGeneratorURL} footerProps={props} active={props.activeTab === names.barcode_generator_tab} id="" enableTab={names.barcode_generator_tab} />
            <BottomButtonComponent icon={<FaList />} caption={SHOPPING_CAPTION} targetUrl={names.groceryListURL} footerProps={props} active={props.activeTab === names.grocery_list_tab} id="" enableTab={names.grocery_list_tab} />
        </footer>
    );
}

export default FooterComponent;
