// All valid credit card numbers
const valid1 = [4, 5, 3, 9, 6, 7, 7, 9, 0, 8, 0, 1, 6, 8, 0, 8]
const valid2 = [5, 5, 3, 5, 7, 6, 6, 7, 6, 8, 7, 5, 1, 4, 3, 9]
const valid3 = [3, 7, 1, 6, 1, 2, 0, 1, 9, 9, 8, 5, 2, 3, 6]
const valid4 = [6, 0, 1, 1, 1, 4, 4, 3, 4, 0, 6, 8, 2, 9, 0, 5]
const valid5 = [4, 5, 3, 9, 4, 0, 4, 9, 6, 7, 8, 6, 9, 6, 6, 6]

// All invalid credit card numbers
const invalid1 = [4, 5, 3, 2, 7, 7, 8, 7, 7, 1, 0, 9, 1, 7, 9, 5]
const invalid2 = [5, 7, 9, 5, 5, 9, 3, 3, 9, 2, 1, 3, 4, 6, 4, 3]
const invalid3 = [3, 7, 5, 7, 9, 6, 0, 8, 4, 4, 5, 9, 9, 1, 4]
const invalid4 = [6, 0, 1, 1, 1, 2, 7, 9, 6, 1, 7, 7, 7, 9, 3, 5]
const invalid5 = [5, 3, 8, 2, 0, 1, 9, 7, 7, 2, 8, 8, 3, 8, 5, 4]

// Can be either valid or invalid
const mystery1 = [3, 4, 4, 8, 0, 1, 9, 6, 8, 3, 0, 5, 4, 1, 4]
const mystery2 = [5, 4, 6, 6, 1, 0, 0, 8, 6, 1, 6, 2, 0, 2, 3, 9]
const mystery3 = [6, 0, 1, 1, 3, 7, 7, 0, 2, 0, 9, 6, 2, 6, 5, 6, 2, 0, 3]
const mystery4 = [4, 9, 2, 9, 8, 7, 7, 1, 6, 9, 2, 1, 7, 0, 9, 3]
const mystery5 = [4, 9, 1, 3, 5, 4, 0, 4, 6, 3, 0, 7, 2, 5, 2, 3]

// More invalid ones 
const invalid6 = '3530377255344151';
const invalid7 = '36948265217551';
const invalid8 = '6394485845331451';
const invalid9 = '4716379700223471';
const invalid10 = '6763738596157341';

// An array of all the arrays above
const batch = [valid1, valid2, valid3, valid4, valid5, invalid1, invalid2, invalid3, invalid4, invalid5, mystery1, mystery2, mystery3, mystery4, mystery5];

/* Accepts a string and converts it into an array of numbers. Assumes input string only contains numbers. */
function convertToArr(string) {
    // Check if it's a string
    if (typeof string === 'string') {
        return string.split("");
    }
}
// An array of strings 
let batch2 = [invalid6, invalid7, invalid8, invalid9, invalid10];
// Convert string into array
batch2 = batch2.map(card => convertToArr(card));

/* Runs the Luhn Algorithm and returns the sum of the final digits */
function luhnAlg(credCardArr) {
    let double = false;
    let sum = 0; 
    for (let i = credCardArr.length - 1; i >= 0; i--) {
        let digit = credCardArr[i];
        // If you should double this digit
        if (double) { 
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
            double = false;
        } else {
            double = true;
        }
        sum += parseInt(digit);
    }
    return sum;
}

/* Return true when an array contains digits of a valid credit card number and false when it is invalid. This function should NOT mutate the values of the original array. To find out if a credit card number is valid or not, use the Luhn algorithm */
const validateCred = credCardArr => {
    if (typeof credCardArr === 'undefined') {
        console.log(`Can't validate this number`);
        return;
    }
    let sum = luhnAlg(credCardArr);
    return sum % 10 === 0; 
}

// Test functions:
console.log(validateCred(valid1)); // Should print true
console.log(validateCred(invalid1)); // Should print false

/* Converts invalid numbers into valid numbers */
function transformCredCard(credCardArr) {
    const sum = luhnAlg(credCardArr);
    const remainder = sum % 10;
    if (remainder === 0) {
        return credCardArr; 
    } else {
        const addRem = sum + remainder;
        const subRem = sum - remainder;
        let double = false; 
        let newCardNum = credCardArr.slice();
        for (let i = credCardArr.length - 1; i >= 0; i--) {
            let digit = credCardArr[i];
            if (!double && i < credCardArr.length - 1 && i > 0) { // Not first digit, check digit, and won't be doubled
                if (addRem % 10 === 0 && (digit + remainder) <= 9 && (digit + remainder) >= 0) { // if adding remainder makes the number valid
                    newCardNum[i] = (newCardNum[i] + remainder).toString();
                    return newCardNum;
                }
                if (subRem % 10 === 0 && (digit - remainder) <= 9 && (digit - remainder) >= 0) { // if subtracting remainder makes the number valid
                    newCardNum[i] = (newCardNum[i] - remainder).toString();
                    return newCardNum;
                }
            } 
            double = !double; 
        }
        // Wasn't valid number to begin with 
        while (!validateCred(newCardNum)) {
            newCardNum.push(remainder);
            newCardNum = transformCredCard(newCardNum);
        }
        return newCardNum;   
    }
}

// Test functions:
batch.forEach(card => console.log(validateCred(transformCredCard(card))));
batch2.forEach(card => console.log(validateCred(transformCredCard(card))));

// findInvalidCards takes in one parameter for a nested array of credit card numbers, credCardArray. It checks which numbers are invalid and returns a new nested array containing only the invalid card numbers. 
const findInvalidCards = creditCards => {
    return creditCards.filter(creditCard => !validateCred(creditCard));
}

// Test function 
console.log(findInvalidCards([valid1, valid2, valid3, valid4, valid5]));// Shouldn't print anything
console.log(findInvalidCards([invalid1, invalid2, invalid3, invalid4, invalid5])); // Should print all of the numbers
console.log(findInvalidCards(batch)); // Test what the mystery numbers are


/* Takes in a nested array of invalid numbers and returns an array of companies that issued these faulty numbers. 
The 4 potential companies each issue unique first digits. [Amex = 3, Visa = 4, Mastercard = 5, Discover = 6] If number doesn't match any of the companies, log a message like "Company not found" 
This array should NOT contain duplicates, i.e. even if there are two invalid Visa cards */
const idInvalidCardCompanies = invalidCards => {
    const companies = [];
    for (let i = 0; i < invalidCards.length; i++) {
        const creditCard = invalidCards[i];
        const firstDigit = creditCard[0];
        switch (firstDigit) {
            case 3: 
                if (!companies.includes('Amex')) {
                    companies.push('Amex');
                }
                break;
            case 4: 
                if (!companies.includes('Visa')) {
                    companies.push('Visa');
                }
                break;
            case 5: 
                if (!companies.includes('Mastercard')) {
                    companies.push('Mastercard');
                }
                break;
            case 6: 
                if (!companies.includes('Discover')) {
                    companies.push('Discover');
                }
                break;
            default: 
                console.log(`Company wasn't found for credit card number ${creditCard}`);
        }
    }
    return companies;
}

// Tests 
console.log(idInvalidCardCompanies([invalid1])); // Should print['visa']
console.log(idInvalidCardCompanies([invalid2])); // Should print ['mastercard']
console.log(idInvalidCardCompanies(batch)); // [ 'Visa', 'Mastercard', 'Amex', 'Discover' ]











