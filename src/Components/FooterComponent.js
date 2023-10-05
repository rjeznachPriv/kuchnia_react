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

    return (
        <footer id="app-footer">
            <BottomButtonComponent icon={<MdCategory />} caption={CATEGORIES_CAPTION} active={props.activeTab === 'categories_tab'} footerProps={props} id={names.categories_tab_button} enableTab="categories_tab" />
            <BottomButtonComponent icon={<FaAppleAlt />} caption={PRODUCTS_CAPTION} active={props.activeTab === 'products_tab'} footerProps={props} id={names.products_tab_button} enableTab="products_tab"/>
            <BottomButtonComponent icon={<MdShelves />} caption={STORAGES_CAPTION} active={props.activeTab === 'storages_tab'} footerProps={props} id={names.storages_tab_button} enableTab="storages_tab" />
            <BottomButtonComponent icon={<FaCamera />} caption="" footerProps={props} active={props.activeTab === 'camera_tab'} id={names.camera_tab_button} enableTab="camera_tab" />
            <BottomButtonComponent icon={<MdForklift />} caption={SUPPLIES_CAPTION} active={props.activeTab === 'supplies_tab'} footerProps={props} id={names.supplies_tab_button} enableTab="supplies_tab" />
            <BottomButtonComponent icon={<FaBarcode />} caption="Barcode generator" footerProps={props} active={props.activeTab === 'barcode_generator_tab'} id="" enableTab="barcode_generator_tab" />
            <BottomButtonComponent icon={<FaList />} caption="Lista zakupów" footerProps={props} active={props.activeTab === 'grocery_list_tab'} id="" enableTab="grocery_list_tab" />
        </footer>
    );
}

export default FooterComponent;
