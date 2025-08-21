import { daysUntil } from './../../../utils/utils';

export function columnsWhenSpoiled(activeFilter, columns) {
    if (activeFilter?.name == "spoiled") {
    }

    return columns;
}

export function filterSpoiled(arr, appSettings) {
    arr = arr.filter((item) => (item.isOpen || daysUntil(item.valid_until, appSettings.dateFormat.value) < appSettings.spoiledDays.value));
    return arr;
}