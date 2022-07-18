'use strict';

function timeTranslate(hourInt) {
  hourInt = parseInt(hourInt)
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

const seattleStore = {
  city: 'Seattle',
  minCustomers: 23,
  maxCustomers: 65,
  avgCookiesPerCustomer: 6.3,
  randomCustomerCount() {
    // Inclusive random integer. Algorithm from MDN Math.random() docs.
    const min = Math.ceil(this.minCustomers);
    const max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  openingHour: 6,
  closingHour: 19,
  hourlySalesArray: [],
  totalSales: 0,
  simulateSales() {
    this.hourlySalesArray = [];
    this.totalSales = 0;
    for (let i = this.openingHour; i <= this.closingHour; i++) {
      const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
      this.hourlySalesArray.push(cookiesSold);
      this.totalSales += cookiesSold;
    }
  }
};

const tokyoStore = {
  city: 'Tokyo',
  minCustomers: 3,
  maxCustomers: 24,
  avgCookiesPerCustomer: 1.2,
  randomCustomerCount() {
    // Inclusive random integer. Algorithm from MDN Math.random() docs.
    const min = Math.ceil(this.minCustomers);
    const max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  openingHour: 6,
  closingHour: 19,
  hourlySalesArray: [],
  totalSales: 0,
  simulateSales() {
    this.hourlySalesArray = [];
    this.totalSales = 0;
    for (let i = this.openingHour; i <= this.closingHour; i++) {
      const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
      this.hourlySalesArray.push(cookiesSold);
      this.totalSales += cookiesSold;
    }
  }
};

const dubaiStore = {
  city: 'Dubai',
  minCustomers: 11,
  maxCustomers: 38,
  avgCookiesPerCustomer: 3.7,
  randomCustomerCount() {
    // Inclusive random integer. Algorithm from MDN Math.random() docs.
    const min = Math.ceil(this.minCustomers);
    const max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  openingHour: 6,
  closingHour: 19,
  hourlySalesArray: [],
  totalSales: 0,
  simulateSales() {
    this.hourlySalesArray = [];
    this.totalSales = 0;
    for (let i = this.openingHour; i <= this.closingHour; i++) {
      const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
      this.hourlySalesArray.push(cookiesSold);
      this.totalSales += cookiesSold;
    }
  }
};

const parisStore = {
  city: 'Paris',
  minCustomers: 20,
  maxCustomers: 38,
  avgCookiesPerCustomer: 2.3,
  randomCustomerCount() {
    // Inclusive random integer. Algorithm from MDN Math.random() docs.
    const min = Math.ceil(this.minCustomers);
    const max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  openingHour: 6,
  closingHour: 19,
  hourlySalesArray: [],
  totalSales: 0,
  simulateSales() {
    this.hourlySalesArray = [];
    this.totalSales = 0;
    for (let i = this.openingHour; i <= this.closingHour; i++) {
      const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
      this.hourlySalesArray.push(cookiesSold);
      this.totalSales += cookiesSold;
    }
  }
};

const limaStore = {
  city: 'Lima',
  minCustomers: 2,
  maxCustomers: 16,
  avgCookiesPerCustomer: 4.6,
  randomCustomerCount() {
    // Inclusive random integer. Algorithm from MDN Math.random() docs.
    const min = Math.ceil(this.minCustomers);
    const max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  openingHour: 6,
  closingHour: 19,
  hourlySalesArray: [],
  totalSales: 0,
  simulateSales() {
    this.hourlySalesArray = [];
    this.totalSales = 0;
    for (let i = this.openingHour; i <= this.closingHour; i++) {
      const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
      this.hourlySalesArray.push(cookiesSold);
      this.totalSales += cookiesSold;
    }
  }
};

const storesArray = [seattleStore, tokyoStore, dubaiStore, parisStore, limaStore];
storesArray.forEach(store => {
  // console.log(store.city);
  store.simulateSales();
  store.hourlySalesArray.forEach((sale, hour) => {
    // console.log(`${timeTranslate(hour + store.openingHour)}: ${sale} Cookies`);
  });
  // console.log(`Total Sales: ${store.totalSales}`)
});

function drawSalesTable(store) {
  const salesTable = document.querySelector(`.sales-table.${store.city.toLowerCase()}`);
  function drawRow(label, data) {
    const saleRow = document.createElement('tr');
    const saleLabel = document.createElement('td');
    const saleData = document.createElement('td');

    saleLabel.innerText = label;
    saleData.innerText = data;

    saleRow.append(saleLabel, saleData);
    salesTable.append(saleRow);
  }
  store.hourlySalesArray.forEach((sale, hour) => {
    drawRow(`${timeTranslate(hour + store.openingHour)}`, sale);
  });
  drawRow('Total', store.totalSales);
}

drawSalesTable(seattleStore)


// Constructor function for Stores
// function Store(minCustomers, maxCustomers, avgCookiesPerCustomer) {
//   this.minCustomers = minCustomers;
//   this.maxCustomers = maxCustomers;
//   this.avgCookiesPerCustomer = avgCookiesPerCustomer;
//   this.randomCustomerCount = function() {
//     // Inclusive random integer. Algorithm from MDN Math.random() docs.
//     const min = Math.ceil(this.minCustomers);
//     const max = Math.floor(this.maxCustomers);
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   };
//   this.openingHour = 6;
//   this.closingHour = 19;
//   this.hourlySalesArray = [];
//   this.totalSales = 0;
//   this.simulateSales = function() {
//     this.hourlySalesArray = [];
//     this.totalSales = 0;
//     for (let i = this.openingHour; i <= this.closingHour; i++) {
//       const cookiesSold = Math.ceil(this.randomCustomerCount() * this.avgCookiesPerCustomer);
//       this.hourlySalesArray.push(cookiesSold);
//       this.totalSales += cookiesSold;
//     }
//   }
// };