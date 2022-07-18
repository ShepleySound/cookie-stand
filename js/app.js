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

const store = {
  minCustomers: 0,
  maxCustomers: 100,
  avgCookiesPerCustomer: 4.3,
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
    }
  }
};

store.simulateSales();


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