'use strict';

// Holds nodes to prevent querying the DOM unnecessarily.
const cache = {
  salesTableBody: document.querySelector('.sales-table tbody'),
  salesTableFooter: document.querySelector('.sales-table tfoot'),
  staffTableBody: document.querySelector('.staff-table tbody'),
  simulateSalesButton: document.querySelector('.simulate-sales-button'),
  storeForm: document.querySelector('#store-form'),
}
// Initialize array with default Stores objects.
const storesArray = [
  new Store('Seattle', 23, 65, 6.3),
  new Store('Tokyo', 3, 24, 1.2),
  new Store('Dubai', 11, 38, 3.7),
  new Store('Paris', 20, 38, 2.3),
  new Store('Lima', 2, 16, 4.6)
];
populateColumnHeaders('sales-table', 6, 19);
populateColumnHeaders('staff-table', 6, 19, false);

// Constructor for Store objects.
function Store(location, minCustomers, maxCustomers, avgCookiesPerCustomer, openingHour = 6, closingHour = 19) {
  this.location = location;
  this.minCustomers = minCustomers;
  this.maxCustomers = maxCustomers;
  this.avgCookiesPerCustomer = avgCookiesPerCustomer;
  this.openingHour = openingHour;
  this.closingHour = closingHour;
  this.hourlyCustomersArray = [];
  this.totalCustomers = 0;
  this.controlCurve = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
}

// Inclusive random integer. Algorithm from MDN Math.random() docs.
Store.prototype.randomInclusiveInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Refresh object's sales array and total sum property. 
// Calculate new data using randomInclusiveInt.
Store.prototype.simulateSales = function() {
  this.hourlyCustomersArray = [];
  this.totalCustomers = 0;
  for (let i = this.openingHour; i <= this.closingHour; i++) {
    const customerCount = this.randomInclusiveInt(
      this.minCustomers,
      this.maxCustomers * this.controlCurve[i - this.openingHour]);
    // this.hourlySales[i] = cookiesSold; // Not in use yet.
    this.hourlyCustomersArray.push(customerCount);
    this.totalCustomers += customerCount;
  }
};

// Return the data to be displayed in sales table.
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

// Draws the object's data onto the sales table.
Store.prototype.drawSalesRow = function() {
  const storeRow = document.createElement('tr');
  storeRow.classList.add('store-row');

  const locationHead = document.createElement('th');
  locationHead.classList.add('location-head', 'row-head');
  locationHead.scope = 'row';
  locationHead.innerText = this.location;
  storeRow.append(locationHead);

  this.hourlyCustomersArray.forEach(customers => {
    const saleCell = document.createElement('td');
    saleCell.classList.add('sale-data');
    saleCell.innerText = Store.calculateCookieSales(customers, this.avgCookiesPerCustomer);
    storeRow.append(saleCell);
  });

  const totalCell = document.createElement('td');
  totalCell.classList.add('total-data');
  totalCell.innerText = Store.calculateCookieSales(this.totalCustomers, this.avgCookiesPerCustomer);
  storeRow.append(totalCell);
  cache.salesTableBody.append(storeRow);
};

// Draws the object's data onto the staff table.
Store.prototype.drawStaffRow = function() {
  const storeRow = document.createElement('tr');
  storeRow.classList.add('store-row');

  const locationHead = document.createElement('th');
  locationHead.classList.add('location-head', 'row-head');
  locationHead.scope = 'row';
  locationHead.innerText = this.location;
  storeRow.append(locationHead);

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
  cache.staffTableBody.append(storeRow);
};

// Returns an array with totals for each hour across all given stores.
function calculateHourlyTotals(storesArray) {
  let hourTotal = [];
  storesArray.forEach(store => {
    store.hourlyCustomersArray.forEach((customerCount, i) => {
      if (!hourTotal[i]) {
        hourTotal[i] = 0;
      }
      hourTotal[i]+= Store.calculateCookieSales(customerCount, store.avgCookiesPerCustomer);
    });
  });
  return hourTotal;
}

// Draws the totals footer to the sales array.
function drawFooterTotals(totalsArray) {
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
  cache.salesTableFooter.append(totalRow);
}
// Empty tables, generate new data, and redraw tables to the page.
function drawTables(storesArray) {
  cache.salesTableBody.innerHTML = '';
  cache.staffTableBody.innerHTML = '';
  cache.salesTableFooter.innerHTML = '';
  storesArray.forEach((store) => {
    store.simulateSales();
    store.drawSalesRow();
    store.drawStaffRow();
  });
  drawFooterTotals(calculateHourlyTotals(storesArray));
}

// "Spins" the data on redraw to achieve a "calculating" effect.
function drawTablesSpinner(storesArray) {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      drawTables(storesArray);
    }, 40 * i);
  }
}

// Translates 24hr time to 12hr time with AM/PM indicators.
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

// Populates column headers with appropriate timeslots and a total column.
function populateColumnHeaders(tableClass, minTime, maxTime, hasTotalColumn = true) {
  const tableHeaders = document.querySelector(`.${tableClass} .table-headers`);
  // Create blank column header cell above location names.
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

// Gets a Store object from the given array using the location property.
function storeByLocation(location, storesArray) {
  for (let i = 0; i < storesArray.length; i++) {
    if (location.toLowerCase() === storesArray[i].location.toLowerCase()) {
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
    if (parseInt(minCustomers.value) > parseInt(maxCustomers.value)) {
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
  drawTablesSpinner(storesArray);

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
drawTablesSpinner(storesArray);

cache.storeForm.addEventListener('submit', handleSubmit);

cache.simulateSalesButton.addEventListener('click', () => {
  drawTablesSpinner(storesArray);
});

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
