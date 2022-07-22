// Only called when drawing sales in separate tables.
Store.prototype.drawSalesTable = function() {
  const salesTable = document.querySelector(`.sales-table.${this.city.toLowerCase()}`);
  function drawRow(label, data) {
    const saleRow = document.createElement('tr');
    const saleLabel = document.createElement('td');
    const saleData = document.createElement('td');
    saleLabel.classList.add('sale-label');
    saleData.classList.add('sale-data');

    saleLabel.innerText = label;
    saleData.innerText = data;

    saleRow.append(saleLabel, saleData);
    salesTable.append(saleRow);
  }
  this.hourlyCustomersArray.forEach((sale, hour) => {
    drawRow(`${timeTranslate(hour + this.openingHour)}`, sale);
  });
  drawRow('Total', Store.calculateCookieSales(this.totalCustomers, this.avgCookiesPerCustomer));
};

// Draws the table with cities as columns.
Store.prototype.drawSalesColumn = function() {
  const salesHeaders = document.querySelector('tr.headers');
  const cityHead = document.createElement('th');
  const salesRows = document.querySelectorAll('.table-body tr');
  const totalRow = document.querySelector('.table-totals tr');

  cityHead.innerText = this.city;
  salesHeaders.append(cityHead);

  salesRows.forEach((row, i) => {
    const saleCell = document.createElement('td');
    saleCell.classList.add('sale-data');
    saleCell.innerText = Store.calculateCookieSales(this.hourlyCustomersArray[i], this.avgCookiesPerCustomer);
    row.append(saleCell);
  });
  const totalCell = document.createElement('td');
  totalCell.classList.add('total-data');
  totalCell.innerText = Store.calculateCookieSales(this.totalCustomers, this.avgCookiesPerCustomer);
  totalRow.append(totalCell);
};