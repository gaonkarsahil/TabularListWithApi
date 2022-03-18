async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");

    const response = await fetch(url);
    const { headers, rows } = await response.json();

    // Clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    // Populate the headers
    for( const headerText of headers) {
        const headerElement = document.createElement("th");
        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
    }

    // Populate the rows
    Object.entries(JSON.parse(rows)).forEach(([key, value]) => {
        const rowElement = document.createElement("tr");
        for( const value2 in value) {
            const cellElement = document.createElement("td");
            cellElement.textContent = value[value2];
            rowElement.appendChild(cellElement);
        }
        tableBody.appendChild(rowElement);
    });
}

loadIntoTable("http://localhost:8000/api/v1/porfolio", document.querySelector("table"));