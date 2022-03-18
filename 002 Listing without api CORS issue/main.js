async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");

    // const myHeaders = new Headers({
    //     'Content-Type': 'text/plain',
    //     'X-Custom-Header': 'hello world',
    //     "Access-Control-Allow-Origin" : "*", 
    //     "Access-Control-Allow-Credentials" : true,
    //     "Access-Control-Allow-Methods": "GET"
    //     // "cross_origin": null
    // });

    const response = await fetch(url);
    // const response = await fetch(url, {mode: 'no-cors'});
    // const response = await fetch(url, {headers: myHeaders});
    const { headers, rows } = await response.json();

    // Clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";
    console.log(headers);
    // Populate the headers
    for( const headerText of headers) {
        const headerElement = document.createElement("th");
        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
    }

    // Populate the rows
    for( const row of rows) {
        const rowElement = document.createElement("tr");
        for( const cellText of row) {
            const cellElement = document.createElement("td");
            cellElement.textContent = cellText;
            rowElement.appendChild(cellElement);
        }
        tableBody.appendChild(rowElement);
    }

}

loadIntoTable("./data.json", document.querySelector("table"));