
function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/api/v1/porfolio");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      const rows = JSON.parse(objects.rows);
      const headers = objects.headers;

      //Setting the Table Headers
      table = document.querySelector("table");
      const tableHead = table.querySelector("thead");
      // Clear the table
      tableHead.innerHTML = "<tr></tr>";
      // Populate the headers
      for(const headerText of headers) {
        const headerElement = document.createElement("th");
        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      console.log(rows);
      for (let object of rows) {
        trHTML += '<tr>'; 
        trHTML += '<td>'+object['id']+'</td>';
        // trHTML += '<td><img width="50px" src="'+object['avatar']+'" class="avatar"></td>';
        trHTML += '<td>'+object['stock_id']+'</td>';
        trHTML += '<td>'+object['stock_name']+'</td>';
        trHTML += '<td>'+object['unit_amount']+'</td>';
        trHTML += '<td>'+object['total_quantity']+'</td>';
        trHTML += '<td>'+object['excise_tax']+'</td>';
        trHTML += '<td>'+object['subtotal']+'</td>';
        trHTML += '<td>'+object['total_tax']+'</td>';
        trHTML += '<td>'+object['total_amount']+'</td>';
        trHTML += '<td>'+object['is_sold']+'</td>';
        // trHTML += '<td>'+object['order_date_time']+'</td>';
        trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+object['id']+')">Edit</button>';
        trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+object['id']+')">Del</button></td>';
        trHTML += "</tr>";
      }						 
      document.getElementById("mytable").innerHTML = trHTML;
    }
  };
}
  
loadTable();


function showUserCreateBox() {
  Swal.fire({
    title: 'Create user',
    html:
      '<input id="id" type="hidden">' +
      '<input id="stockId" class="swal2-input" placeholder="Stock ID">' +
      '<input id="stockName" class="swal2-input" placeholder="Stock Name">' +
      '<input id="unitAmount" class="swal2-input" placeholder="Unit Amount">' +
      '<input id="totalQuantity" class="swal2-input" placeholder="Total Quantity">' +
      '<input id="orderDateTime" class="swal2-input" placeholder="Order Date Time">'+
      '<input id="isSold" class="swal2-input" placeholder="Is Sold">',
    focusConfirm: false,
    preConfirm: () => {
      userCreate();
    }
  })
}

function userCreate() {
  // const fname = document.getElementById("id").value;
  const stockId = document.getElementById("stockId").value;
  const stockName = document.getElementById("stockName").value;
  const unitAmount = document.getElementById("unitAmount").value;
  const totalQuantity = document.getElementById("totalQuantity").value;
  const orderDateTime = document.getElementById("orderDateTime").value;
  const isSold = document.getElementById("isSold").value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/api/v1/porfolio");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "stock_id": stockId, 
    "stock_name": stockName, 
    "unit_amount": unitAmount, 
    "total_quantity": totalQuantity,
    "order_date_time": orderDateTime,
    "is_sold": isSold
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}


function showUserEditBox(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/api/v1/porfolio/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const  order = objects['data'];
      console.log(order);
      Swal.fire({
        title: 'Edit order',
        html:
          '<input id="id" type="hidden" value='+order['id']+'>' +
          '<input id="stockId" class="swal2-input" placeholder="Stock ID" value="'+order['stock_id']+'">' +
          '<input id="stockName" class="swal2-input" placeholder="Stock Name" value="'+order['stock_name']+'">' +
          '<input id="unitAmount" class="swal2-input" placeholder="Unit Amount" value="'+order['unit_amount']+'">' +
          '<input id="totalQuantity" class="swal2-input" placeholder="Total Quantity" value="'+order['total_quantity']+'">' +
          '<input id="orderDateTime" class="swal2-input" placeholder="Order Date Time" value="'+order['order_date_time']+'">'+
          '<input id="isSold" class="swal2-input" placeholder="Is Sold" value="'+order['is_sold']+'">',
        focusConfirm: false,
        preConfirm: () => {
          orderEdit();
        }
      })
    }
  };
}

function orderEdit() {
  const id = document.getElementById("id").value;
  const stockId = document.getElementById("stockId").value;
  const stockName = document.getElementById("stockName").value;
  const unitAmount = document.getElementById("unitAmount").value;
  const totalQuantity = document.getElementById("totalQuantity").value;
  const orderDateTime = document.getElementById("orderDateTime").value;
  const isSold = document.getElementById("isSold").value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:8000/api/v1/porfolio");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "id": id, 
    "stock_id": stockId, 
    "stock_name": stockName, 
    "unit_amount": unitAmount, 
    "total_quantity": totalQuantity,
    "order_date_time": orderDateTime,
    "is_sold": isSold
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}


function userDelete(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:8000/api/v1/porfolio/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "id": id
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    } 
  };
}