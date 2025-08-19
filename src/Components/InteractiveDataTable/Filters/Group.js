
export function columnsWhenGroupped(activeFilter, columns) {
    if (activeFilter?.name == "group") {
        columns.push({
            name: "amount",
            type: "number",
            displayName: "TODO iloœæ",
            sortable: true
        });
    }
    //TODO: remove some columns?

    return columns;
}

export function groupByMulti(arr, keys) {
    const map = arr.reduce((acc, item) => {
        const compositeKey = keys.map(k => item[k]).join("|");

        if (!acc[compositeKey]) {
            acc[compositeKey] = { amount: 0 };
            keys.forEach(k => acc[compositeKey][k] = item[k]);
        }

        acc[compositeKey].amount += 1;
        return acc;
    }, {});

    return Object.values(map);
}