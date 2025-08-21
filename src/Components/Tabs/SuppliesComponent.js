import { useState, useEffect, useRef } from 'react';
import { useAppSettingsStore } from "./../../utils/appSettingsStore.js";
import "react-datepicker/dist/react-datepicker.css";

import './../../Styles/Tabs/SuppliesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"

import InteractiveDataTable from './../InteractiveDataTable/InteractiveDataTable .js';
import { groupByMulti } from './../InteractiveDataTable/Filters/Group.js';
import { filterSpoiled } from './../InteractiveDataTable/Filters/Spoiled.js';
import { filterNotMuch } from './../InteractiveDataTable/Filters/NotMuch.js';

import { FaAppleAlt, FaLayerGroup } from 'react-icons/fa';
import { GiFly } from "react-icons/gi";
import { BsApple } from 'react-icons/bs';
import { MdOutlineShoppingCart } from "react-icons/md";

function SuppliesComponent(props) {

    const { appSettings, setAppSettings } = useAppSettingsStore();

    var localStyle = { display: props.activeTab === names.supplies_tab ? 'block' : 'none' };

    useEffect(() => {
    }, []);

    function onSupplyClicked(supply, columnName) {
        if (columnName == 'isOpen') {
            props.setSupplies(prev => prev.map(item => item.guid == supply.guid ? { ...item, isOpen: !supply.isOpen } : item));
        }
    }

    function supplyIsOpenIcon() {
        return (
            <BsApple title={captions.explanation_product_is_open}></BsApple>
        );
    }
    function supplyIsClosedIcon() {
        return (
            <FaAppleAlt title={captions.explanation_product_is_sealed}></FaAppleAlt>
        );
    }

    return (
        <div id={names.supplies_tab} className="SuppliesComponent" style={localStyle}>
            <div className="supplies-table-container">

                <InteractiveDataTable
                    quagga={props.quagga}
                    onResourceClicked={onSupplyClicked}
                    
                    columns={[
                        { name: "guid", type: "text", searchable: true },
                        { name: "frequency", type: "number" },
                        {
                            name: "product_id",
                            type: "smartselect",
                            displayName: captions.field_product_name,
                            searchable: true,
                            dataSource: props.products,
                            scannable: true,
                            validation: { required: true, required_message: captions.message_validation_required, },
                        },
                        {
                            name: "valid_until",
                            type: "datetime",
                            displayName: captions.field_exp_date,
                            searchable: true,
                            sortable: true,
                        },
                        {
                            name: "storage_id",
                            type: "smartselect",
                            displayName: captions.field_storage,
                            searchable: true,
                            dataSource: props.storages,
                            scannable: true,
                        },
                        {
                            name: "isOpen",
                            type: "bool",
                            displayName: captions.field_isOpen,
                            trueData: supplyIsOpenIcon(),
                            falseData: supplyIsClosedIcon(),
                            sortable: true,
                        },
                    ]}
                    resources={props.supplies}
                    setResources={props.setSupplies}
                    initialFilterPhrase={props.filterPhrase}
                    resourceName={"supplies"}

                    deleteWindowTitle={captions.message_removing_supply}
                    deleteWindowText={captions.message_are_you_sure_to_remove_supply}

                    editWindowTitle={captions.message_supply_edit}

                    customFilters={
                        [
                            { name: "group", icon: < FaLayerGroup />, caption: "TODO grupuj", predicate: groupByMulti, predicateArgs: [props.supplies, ["product_id"]] },
                            { name: "spoiled", icon: < GiFly />, caption: "TODO otwarte, blisko daty", predicate: filterSpoiled, predicateArgs: [props.supplies, appSettings] },
                            { name: "notMuch", icon: < MdOutlineShoppingCart />, caption: "TODO poniżej limitu", predicate: filterNotMuch, predicateArgs: [props.supplies, props.products] },
                        ]}
                ></InteractiveDataTable>
            </div>
        </div>
    );
}

export default SuppliesComponent;
