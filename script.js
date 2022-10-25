'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//displaying account movements on the app
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__value">${mov}</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//displayMovements(account1.movements);

//creating users which are the first letters of the name

const createUsers = function (accs) {
  //const user = 'Steven Thomas Williams'; //stw // acc for array of accounts.owner
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsers(accounts);
console.log(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummery(acc);
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//showing the global balance on the app which is the sum of all the movements using reduce://
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur, i) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance}EUR`;
};
//calcPrintBalance(account1.movements); we are calling all the accounts and that way saving the balance in everyones details so we can use it
//balance start at zero as we like...
//can be written as arrow func: movements.reduce((acc, cur, i)=> acc + cur, 0);

//display in and out comes :
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(int => (int * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}`;
};
//calcDisplaySummery(account1.movements);

//loging in
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = ' '; // to clean the password and username after submit
    inputLoginPin.blur();

    updateUI(currentAccount);
    //calling the functions here will call for every account we have and direct to its movements.
  }
});
//transfering money from account to account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault(); // carefull the opisit will make it default prevent from working :)
  const amount = Number(inputLoanAmount.value);
  //checking if the loan is atleast 10% than one of the incomes by using the some
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
});

//closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); // everytime we are calling form from html
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    ); // looking for the first index iside the array to delete it

    accounts.splice(index, 1); //delete method
    containerApp.style.opacity = 0; // empty screen
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/*loan - the bank is letting to make a lone only if the account has at least one income which is 10% of the loan
btnLoan.addEventListener('click', function (e) {
  e.defaultPrevented();
  const amount = Number(inputLoanAmount.value);
  //checking if the loan is atleast 10% than one of the incomes by using the some
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
})*/

/////////////////////////////////////////////////
//codingchalange

/*let humanAge;
const arrDogs = [25, 13, 2, 6, 3, 7];
const calcAverageHumanAge = arrDogs.map(function (dogs) {
  if (dogs <= 2) return (humanAge = dogs * 2);
  else return (humanAge = 16 + dogs * 4);
});
console.log(`the dog age in humans age is ${calcAverageHumanAge}`);

const adultDogs = calcAverageHumanAge.filter(function (age) {
  return age > 18;
});
console.log(`the dog is ${adultDogs} years old`);

const avgAdult = adultDogs.reduce(function (acc, adult, i) {
  return acc + adult, adultDogs[0] / adultDogs.length;
});

console.log(`the average ave of the dogs is ${avgAdult}`);

calcAverageHumanAge([5, 6, 11, 7, 8, 4]);*/
