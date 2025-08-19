import { uuidv4} from './../../utils/utils.js';
import { parse } from "date-fns";
import { filterItemsByAutocomplete } from './../AutocompleteSearchComponent.js';
import { getSelectableFieldLabel } from './../DropDownComponent.js';

export function Create(item, itemSetter, resourcesSetter) {
        let newItem = {
            ...item,
            guid: uuidv4(),
            frequency: 0,
    };

    resourcesSetter(prev => [...prev, newItem]);
    itemSetter(ClearObject(item));
}

export function Read(resources, guid) {
    if (guid) {
        let resource = resources.filter((item) => item.guid == guid)[0];
        return resource ? resource : null;
    }
    return { name: "", type: "" }
}

export function Update(resources, resourcesSetter, resource, guid) {
    var _resources = resources.map((item) => {
        return (item.guid == guid) ? resource : item
    });

    resourcesSetter(_resources);
}

export function Delete(resources, resourcesSetter, guid, deleteAssignedResources = false, dependantResources = undefined) {
    if (deleteAssignedResources) {
        for (var dependantResourcesType of dependantResources) {
            dependantResourcesType.setter(dependantResourcesType.data.filter((ent) => (ent[dependantResourcesType.column] != guid)));
        }
    }

    var _resources = resources.filter((item) => item.guid != guid);
    resourcesSetter(_resources);

}

export function ClearObject(obj) {
    Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (typeof val === "string") obj[key] = "";
        else if (typeof val === "number") obj[key] = 0;
        else if (typeof val === "boolean") obj[key] = false;
        else if (Array.isArray(val)) obj[key] = [];
        else if (typeof val === "object" && val !== null) obj[key] = {}; // dla nested obiektów
        else obj[key] = null;
    });

    return obj;
}

export function filterBySearchPhraseAndSort(resources, columns, sortColumn, sortDirection, dateFormat, filterPhrase ) {
    let searchableColumns = columns.filter((column) => (column.searchable)).map((column) => (column.name));
    let columnWithDataSource = columns.filter((column) => (column.dataSource))[0];    //TODO: what if more columns? : push more to keyPhrase

    let extendedResources = resources.map((item) => ({ ...item, keyPhrase: getSelectableFieldLabel(columnWithDataSource, item) }));
    searchableColumns.push("keyPhrase");

    return filterItemsByAutocomplete(extendedResources, filterPhrase, searchableColumns).sort((a, b) => {
        let columnType = columns.filter((column) => (column.name == sortColumn))[0]?.type || "text";
        if (columnType === "text") {
            return sortDirection ? b[sortColumn].localeCompare(a[sortColumn]) : a[sortColumn].localeCompare(b[sortColumn]);
        }
        if (columnType === "number") {
            return sortDirection ? b[sortColumn] - a[sortColumn] : a[sortColumn] - b[sortColumn];
        }
        if (columnType === "bool") {
            return sortDirection ? b[sortColumn] - a[sortColumn] : a[sortColumn] - b[sortColumn];
        }
        if (columnType === "datetime") {
            const aDate = parse(a[sortColumn], dateFormat, new Date());
            const bDate = parse(b[sortColumn], dateFormat, new Date());
            return sortDirection ?

                new Date(bDate - aDate) :
                new Date(aDate - bDate);
        }
        //TODO: implement here for other types
        return 0;
    });
}

export function EntityStateValid(entity, columns) {
    let columnsToValidate = columns.filter((column) => (column.validation));
    let validationResult = columnsToValidate.map((column) => (IsInvalid(column, entity[column.name])));
    return !validationResult.some((item) => (item != false));
}

export function IsInvalid(column, value) {
    let validatoinMessage = "";
    if (column.validation?.required && !value) return column.validation?.required_message;
    if (typeof column.validation?.min !== 'undefined' && value < column.validation.min) validatoinMessage += column.validation?.min_message;
    if (typeof column.validation?.max !== 'undefined' && value > column.validation.max) validatoinMessage += column.validation?.max_message;
    // TODO: implement here for other types
    return validatoinMessage;
}