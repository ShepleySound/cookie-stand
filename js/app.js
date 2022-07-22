'use strict';

function Store(city, minCustomers, maxCustomers, avgCookiesPerCustomer, openingHour = 6, closingHour = 19) {
  this.city = city;
  this.minCustomers = minCustomers;
  this.maxCustomers = maxCustomers;
  this.avgCookiesPerCustomer = avgCookiesPerCustomer;
  this.openingHour = openingHour;
  this.closingHour = closingHour;
  // this.hourlySales = {}; // Will use hours as keys to link sales to times.
  this.hourlyCustomersArray = [];
  this.totalCustomers = 0;
  this.controlCurve = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
}

Store.prototype.randomCustomerCount = function(min, max) {
  // Inclusive random integer. Algorithm from MDN Math.random() docs.
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

Store.prototype.simulateSales = function() {
  this.hourlyCustomersArray = [];
  this.totalCustomers = 0;
  for (let i = this.openingHour; i <= this.closingHour; i++) {
    const customerCount = this.randomCustomerCount(
      this.minCustomers,
      this.maxCustomers * this.controlCurve[i - this.openingHour]);
    // this.hourlySales[i] = cookiesSold; // Not in use yet.
    this.hourlyCustomersArray.push(customerCount);
    this.totalCustomers += customerCount;
  }
};

Store.calculateCookieSales = function(customerCount, avgCookiesPerCustomer) {
  return Math.ceil(customerCount * avgCookiesPerCustomer);
};

Store.calculateStaff = function(customerCount) {
  const customersPerStaff = 20;
  let staffNeeded = Math.ceil(customerCount / customersPerStaff);
  if (staffNeeded < 2) {
    staffNeeded = 2;
  }
  return staffNeeded;
};

// Draws the table with cities as rows.
Store.prototype.drawSalesRow = function() {
  const tableBody = document.querySelector('.sales-table tbody');
  const storeRow = document.createElement('tr');
  storeRow.classList.add('store-row');

  const cityHead = document.createElement('th');
  cityHead.classList.add(`${this.city.toLowerCase()}`, 'city-head', 'row-head');
  cityHead.scope = 'row';
  cityHead.innerText = this.city;
  storeRow.append(cityHead);

  this.hourlyCustomersArray.forEach(customers => {
    const saleCell = document.createElement('td');
    saleCell.classList.add(`${this.city.toLowerCase()}`, 'sale-data');
    saleCell.innerText = Store.calculateCookieSales(customers, this.avgCookiesPerCustomer);
    storeRow.append(saleCell);
  });

  const totalCell = document.createElement('td');
  totalCell.classList.add('total-data');
  totalCell.innerText = Store.calculateCookieSales(this.totalCustomers, this.avgCookiesPerCustomer);
  storeRow.append(totalCell);
  tableBody.append(storeRow);
};

Store.prototype.drawStaffRow = function() {
  const tableBody = document.querySelector('.staff-table tbody');
  const storeRow = document.createElement('tr');
  storeRow.classList.add('store-row');

  const cityHead = document.createElement('th');
  cityHead.classList.add('city-head', 'row-head');
  cityHead.scope = 'row';
  cityHead.innerText = this.city;
  storeRow.append(cityHead);

  this.hourlyCustomersArray.forEach((customers, i) => {
    const staffCell = document.createElement('td');
    staffCell.classList.add('staff-data');
    const staffCurrentHour = Store.calculateStaff(customers);
    const staffPreviousHour = Store.calculateStaff(this.hourlyCustomersArray[i - 1]);
    if (staffPreviousHour !== staffCurrentHour){
      staffCell.innerText = staffCurrentHour;
      staffCell.classList.add('changed');
    } else {
      staffCell.innerText = '-';
      staffCell.classList.remove('changed');
    }
    storeRow.append(staffCell);
  });
  tableBody.append(storeRow);
};

function calculateHourlyTotals(storesArray) {
  let hourTotal = [];
  storesArray.forEach(store => {
    console.log(store.city);
    store.hourlyCustomersArray.forEach((customerCount, i) => {
      if (!hourTotal[i]) {
        hourTotal[i] = 0;
      }
      hourTotal[i]+= Store.calculateCookieSales(customerCount, store.avgCookiesPerCustomer);
    });
  });
  return hourTotal;
}

function drawFooterTotals(totalsArray) {
  const tablefooter = document.querySelector('.sales-table tfoot');
  const totalRow = document.createElement('tr');
  totalRow.classList.add('total-row');

  const totalHead = document.createElement('th');
  totalHead.classList.add('total-head', 'row-head');
  totalHead.scope = 'row';
  totalHead.innerText = 'Total';
  totalRow.append(totalHead);

  let sumTotalData = 0;

  totalsArray.forEach(totalData => {
    sumTotalData += totalData;
    const totalCell = document.createElement('td');
    totalCell.classList.add('total-data');
    totalCell.innerText = totalData;
    totalRow.append(totalCell);
  });
  const sumTotalCell = document.createElement('td');
  sumTotalCell.classList.add('total-data', 'sum-total');
  sumTotalCell.innerText = sumTotalData;
  totalRow.append(sumTotalCell);
  tablefooter.append(totalRow);
}

const seattleStore = new Store('Seattle', 23, 65, 6.3);
const tokyoStore = new Store('Tokyo', 3, 24, 1.2);
const dubaiStore = new Store('Dubai', 11, 38, 3.7);
const parisStore = new Store('Paris', 20, 38, 2.3);
const limaStore = new Store('Lima', 2, 16, 4.6);

const storesArray = [seattleStore, tokyoStore, dubaiStore, parisStore, limaStore];
populateTableHeaders('sales-table', 6, 19);
populateTableHeaders('staff-table', 6, 19, false);


function drawTables(storesArray) {
  const salesTableBody = document.querySelector('.sales-table tbody');
  const staffTableBody = document.querySelector('.staff-table tbody');
  const salesTableFoot = document.querySelector('.sales-table tfoot');
  salesTableBody.innerHTML = '';
  staffTableBody.innerHTML = '';
  salesTableFoot.innerHTML = '';
  storesArray.forEach(store => {
    store.simulateSales();
    store.drawSalesRow();
    store.drawStaffRow();
  });
  drawFooterTotals(calculateHourlyTotals(storesArray));

}

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

function populateTableHeaders(tableClass, minTime, maxTime, hasTotalColumn = true) {
  const tableHeaders = document.querySelector(`.${tableClass} .table-headers`);
  // Create blank column header cell above city names.
  const blankHead = document.createElement('th');
  blankHead.classList.add('blank-head', 'column-head');
  blankHead.innerText = '';
  tableHeaders.append(blankHead);
  // Create timeslot header cells.
  for (let i = minTime; i <= maxTime; i++) {
    const timeHead = document.createElement('th');
    timeHead.classList.add('time-head', 'column-head');
    timeHead.innerText = timeTranslate(i);
    tableHeaders.append(timeHead);
  }
  if (hasTotalColumn){
    // Create total column header cell.
    const totalHead = document.createElement('th');
    totalHead.classList.add('total-head', 'column-head');
    totalHead.innerText = 'Total';
    tableHeaders.append(totalHead);
  }
}

function storeByLocation(location, storesArray) {
  for (let i = 0; i < storesArray.length; i++) {
    if (location.toLowerCase() === storesArray[i].city.toLowerCase()) {
      return storesArray[i];
    }
  }
}


function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const location = form.location;
  const minCustomers = form.minCustomers;
  const maxCustomers = form.maxCustomers;
  const avgCookiesPerCustomer = form.averageCookies;

  const existingStore = storeByLocation(location.value, storesArray);

  if (existingStore) {
    minCustomers.value !== '' ? existingStore.minCustomers = minCustomers.value : minCustomers.value = existingStore.minCustomers;
    maxCustomers.value !== '' ? existingStore.maxCustomers = maxCustomers.value : maxCustomers.value = existingStore.maxCustomers;
    avgCookiesPerCustomer.value !== '' ? existingStore.avgCookiesPerCustomer = avgCookiesPerCustomer.value : avgCookiesPerCustomer.value = existingStore.avgCookiesPerCustomer;

  } else {

    if (location.value.length < 1) {
      warningBox(location, 'Please enter a location name.');
      return;
    }
    if (minCustomers.value > maxCustomers.value) {
      warningBox(minCustomers, 'Min must be less than Max.');
      return;
    }
    if (minCustomers.value === '') {
      warningBox(minCustomers, 'Please enter a minimum customers value for new stores.');
      return;
    }
    if (maxCustomers.value === '') {
      warningBox(minCustomers, 'Please enter a maximum customers value for new stores.');
      return;
    }
    if (avgCookiesPerCustomer.value === '') {
      warningBox(minCustomers, 'Please enter an average cookies value for new stores.');
      return;
    }
    storesArray.push(new Store(location.value, minCustomers.value, maxCustomers.value, avgCookiesPerCustomer.value));
  }
  drawTables(storesArray);

  form.reset();
}

let isWarningRunning = false;
function warningBox(formInput, warningString = 'Warning!') {
  if (!isWarningRunning) {
    isWarningRunning = true;
    const parent = formInput.parentElement;
    const warning = document.createElement('div');
    warning.classList.add('warning-box');
    warning.innerText = warningString;

    parent.append(warning);

    setTimeout(() => {
      warning.classList.add('displayed');
    }, 10);
    setTimeout(() => {
      warning.classList.remove('displayed');
      warning.classList.add('hidden');
    }, 2500);
    setTimeout(() => {
      warning.remove();
      isWarningRunning = false;
    }, 3000);
  }
}

const storeForm = document.querySelector('#store-form');
drawTables(storesArray);
storeForm.addEventListener('submit', handleSubmit);


// Potential helper function
// function getTotalTimeRange(stores) {
//   let open;
//   let close;
//   stores.forEach(store => {
//     if (open === undefined || store.openingHour < open) {
//       open = store.openingHour % 24;
//     }
//     if (close === undefined || store.closingHour > close) {
//       close = store.closingHour % 24;
//     }
//     if (store.closingHour < open) {
//       open = store.closingHour % 24;
//     }
//   });
//   return [open, close];
// }
