import { CiBarcode } from "react-icons/ci";
import DatePicker from "react-datepicker";
import captions from "./../../Configuration/LocalizedCaptionsPL.json";
import { IsInvalid } from './../InteractiveDataTable/crud';
import { renderTextBoxComponent } from './../TextBoxComponent.js';
import { renderSmartDropDownComponent } from './../SmartDropDownComponent.js';
import { renderDropDownComponent } from './../DropDownComponent';
import { renderThumbnail } from './../JustCameraComponent.js';
import { renderCheckBoxComponent } from './../CheckBoxComponent.js';
import { parse, isValid, format } from "date-fns";

export function renderFieldComponent(column, value, valueSetter, withLabel = false, onScannerIconClicked, onRemoveThumbNailButtonClicked, onCameraIconClicked, appSettings) {
    function scannableButton(column) {
        return column.scannable ? (
            <CiBarcode className="font-size-large" role="button" tabIndex="0" onClick={() => onScannerIconClicked(setValue)}></CiBarcode>
        ) : "";
    };

    function setValue(newValue) {

        console.log(column);
        console.log(value);
        console.log(newValue);

        if (!column.value) {    // for form fields :(
            valueSetter(prev => ({ ...prev, [column.name]: newValue }));
        } else {                // for settings :(
            valueSetter(newValue);
        }

        //valueSetter(prev => ({ ...prev, [column.name]: newValue }));
        //valueSetter(newValue);
    };

    function safeDate(value) {
        const parsedDate = parse(value, appSettings.dateFormat?.value, new Date());
        return isValid(parsedDate) ? parsedDate : null
    };

    const commonProps = {
        value: value,
        validationMessage: IsInvalid(column, value),
        label: withLabel ? column.displayName : "",
        onChange: (e) => setValue(e.target.value),
    };

    switch (column.type) {
        case "text":
        case "number":
            return renderTextBoxComponent(column, commonProps, captions, scannableButton(column));
        case "smartselect":
            return renderSmartDropDownComponent(column, commonProps, (selectedItem) => { setValue(selectedItem.guid); }, scannableButton(column));
        case "select":
            return renderDropDownComponent(column, commonProps, value);
        case "img":
            return renderThumbnail(commonProps, value, () => onRemoveThumbNailButtonClicked(setValue), () => onCameraIconClicked(setValue));
        case "datetime":
            return (
                <div>
                    <label>{commonProps.label}</label>
                    <DatePicker
                        selected={safeDate(value)}
                        onChange={(date) => { setValue(format(date, appSettings.dateFormat.value)); }}
                        validationMessage={IsInvalid(column, value)}
                        dateFormat={appSettings.dateFormat?.value}
                        locale={appSettings.locale?.value}
                        showYearDropdown
                    />
                </div>
            );
        case "bool":
            return renderCheckBoxComponent(commonProps, setValue, value);

        //TODO: implement here for other types

        default:
            return <div>{captions.message_unhandled_type} {column.type}</div>;
    }
}
