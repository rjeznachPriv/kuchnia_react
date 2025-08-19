import { daysUntil } from './../../../utils/utils';

let spoiledDays = 5; //TODO move to settings
let format = "dd/MM/yyyy"; //TODO from settings

export function columnsWhenSpoiled(activeFilter, columns) {
    if (activeFilter?.name == "spoiled") {
    }

    return columns;
}

export function filterSpoiled(arr) {
    arr = arr.filter((item) => (item.isOpen || daysUntil(item.valid_until, format) < spoiledDays));
    return arr;
}