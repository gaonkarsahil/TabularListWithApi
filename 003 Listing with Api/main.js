async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");

    const response = await fetch(url);
    const { headers, rows } = await response.json();

    // headers1 = [
    //     "User ID",
    //     "Name",
    //     "Occupation",
    //     "Age"
    // ];

    // Clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    // Populate the headers
    for( const headerText of headers) {
    // for( const headerText of headers1) { //for showing hardcoded headers
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

loadIntoTable("http://localhost:8000/api/v1/porfolio", document.querySelector("table"));