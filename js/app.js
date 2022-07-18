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
  averageCookiesPerCustomer: 4,
  randomCustomerCount() {
    // Inclusive random integer. Algorithm from MDN Math.random() docs.
    const min = Math.ceil(this.minCustomers);
    const max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

};

console.log(store.randomCustomerCount());
console.log(timeTranslate(0));
console.log(timeTranslate(12));
console.log(timeTranslate(10));
console.log(timeTranslate(23));
