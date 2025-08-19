import { debounce } from 'lodash';
import initialData from "./../Configuration/InitialData.json";

const stateKey = 'state';
const debounceTime = 3000;  //TODO: move to settings?

export const saveState = debounce((state) => {
    localStorage.setItem(stateKey, JSON.stringify(state));
}, debounceTime);

export function loadState() {
    if (localStorage.length == 0) {
        return {
            categories: initialData.categories,
            products: initialData.products,
            storages: initialData.storages,
            supplies: initialData.supplies,
        };
    } else {
        let data = JSON.parse(localStorage.getItem(stateKey));
        return {
            categories: data.categories,
            products: data.products,
            storages: data.storages,
            supplies: data.supplies,
        };
    }
}
