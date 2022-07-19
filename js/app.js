'use strict';

function timeTranslate(hourInt) {
  hourInt = parseInt(hourInt);
  if (isNaN(hourInt)) {
    return;
  } else if (hourInt === 0) {
    return '12AM';
  } else if (hourInt >= 1 && hourInt <= 11) {
    return `${hourInt}AM`;
  } else if (hourInt === 12) {
    return '12PM';
  } else if (hourInt >= 13 && hourInt <= 23) {
    return `${hourInt - 12}PM`;
  }
}

function Store(city, minCustomers, maxCustomers, avgCookiesPerCustomer) {
  this.city = city;
  this.minCustomers = minCustomers;
  this.maxCustomers = maxCustomers;
  this.avgCookiesPerCustomer = avgCookiesPerCustomer;
  this.openingHour = 6;
  this.closingHour = 19;
  this.hourlySalesArray = [];
  this.totalSales = 0;
}

Store.prototype.randomCustomerCount = function() {
  // Inclusive random integer. Algorithm from MDN Math.random() docs.
  const min = Math.ceil(this.minCustomers);
  const max = Math.floor(this.maxCustomers)
  return Math.floor(Math.random() * (max - min + 1) + min);
};

Store.prototype.simulateSales = function() {
  this.hourlySalesArray = [];
  this.totalSales = 0;
  for (let i = this.openingHour; i <= this.closingHour; i++) {
    const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
    this.hourlySalesArray.push(cookiesSold);
    this.totalSales += cookiesSold;
  }
};

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
  this.hourlySalesArray.forEach((sale, hour) => {
    drawRow(`${timeTranslate(hour + this.openingHour)}`, sale);
  });
  drawRow('Total', this.totalSales);
};

const seattleStore = new Store('Seattle', 23, 65, 6.3);
const tokyoStore = new Store('Tokyo', 3, 24, 1.2);
const dubaiStore = new Store('Dubai', 11, 38, 3.7);
const parisStore = new Store('Paris', 20, 38, 2.3);
const limaStore = new Store('Lima', 2, 16, 4.6);

const storesArray = [seattleStore, tokyoStore, dubaiStore, parisStore, limaStore];
storesArray.forEach(store => {
  store.simulateSales();
  store.drawSalesTable();
});
