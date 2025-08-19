
export function columnsWhenNotMuch(activeFilter, columns) {
    let columnsToRemove = ["valid_until", "storage_id", "isOpen"];  //TODO: get as argument!
    if (activeFilter?.name == "notMuch") {
        columns = columns.filter((column) => (!columnsToRemove.includes(column.name)));

        columns.push({
            name: "amount",
            type: "number",
            displayName: "TODO ilosc",
            sortable: true
        });
        columns.push({
            name: "alarm",
            type: "number",
            displayName: "TODO limit",
            sortable: true
        });
    }

    return columns;
}

export function filterNotMuch(arr, baseResources) {
    arr = arr.map((item) => {
        return {
            ...item,
            //name: 10,
            alarm: baseResources.filter((br) => item.product_id == br.guid )[0].alarm,    //TODO: constant column names!!
        };
    });

    const grouped = arr.reduce((acc, item) => {
        if (!acc[item.product_id])   {          // TODO: product_id !!
            acc[item.product_id] = { ...item, amount: 0 }; 
        }
        acc[item.product_id].amount += 1;
        return acc;
    }, {});

    arr = Object.values(grouped);

    arr = arr.filter((item) => item.amount < item.alarm);

    return arr;
}