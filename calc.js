/////////////////////////////////////////////////
// Calculator Parameters
/////////////////////////////////////////////////
const maxEquationLength = 20;

// how many decimal points (2nd number)
const decimals = Math.pow(10, 7);

// how many items in the equation that we have
let equationLength = 0;

// the equation we need to solve
let equation = "";

// always display the starting equation
document.getElementById("equation").innerHTML = (equation);

// do we need a number?
// used to prevent + + + with no numbers in between
let needNumber = true;

// was the last item a decimal?
let lastDecimal = false;

// the last operator
var lastOp = "";
var lastNum = "";

/**
 * Method using for debugging
 */
function debug() {
  // run for the next couple iterations
  for(var i = 0; i < 0; i++) {
    var debugStr = " EQ: |" + equation + 
              "|\n Last Op: ." + lastOp +
              ".\n Last Num: |" + lastNum +
              "\n Need Num: " + needNumber +
              "\n Last Decimal: " + lastDecimal +
              " Length: " + equationLength;

    document.getElementById("debug").innerHTML = (debugStr);
  }
}

/**
 * Adds an operator or number to the equation variable, ensuring
 * an operator cannot be added twice in a row
 */
function addEquation(symbol, operator=false, decimal=false) {
  if(needNumber && operator) {
    // error
    alert("Please select a number next.");
  } else if (equationLength >= maxEquationLength || (operator && equationLength >= maxEquationLength - 2)) {
    // make sure the equation isnt too long, and dont trap the user where they end on an operator
    alert("Please solve before entering more numbers");
  } else if (decimal && lastDecimal) {
    alert("Decimals cannot be added twice in a row");
  } else {
    // special case, adding a decimal
    if(decimal) {
      lastDecimal = true;
      equation = equation + ".";
      equationLength++;
    } else if(operator) { // add a space when adding an operator
      equation = equation + " " + symbol + " ";
      equationLength += 3;
      lastDecimal = false;
      lastOp = symbol;
      lastNum = "";
    } else {
      // add a number right after the other
      equation = equation + symbol;
      equationLength++;
    }

    // update need number for the next time
    needNumber = operator;
    
    // update the html after adding to the equation
    document.getElementById("equation").innerHTML = (equation);
  }

  debug();
}

///////////////////////////////////////////////
//    Listener Functions for all Buttons    //
//////////////////////////////////////////////

/** Operators **/
const plus = document.querySelector("#plus");
plus.addEventListener("click", () => addEquation("+", true));
const minus = document.querySelector("#minus");
minus.addEventListener("click", () => addEquation("-", true));
const multiply = document.querySelector("#multiply");
multiply.addEventListener("click", () => addEquation("×", true));
const divide = document.querySelector("#divide");
divide.addEventListener("click", () => addEquation("÷", true));

/** Numbers **/
const b0 = document.querySelector("#b0");
b0.addEventListener("click", () => addEquation("0"));
const b1 = document.querySelector("#b1");
b1.addEventListener("click", () => addEquation("1"));
const b2 = document.querySelector("#b2");
b2.addEventListener("click", () => addEquation("2"));
const b3 = document.querySelector("#b3");
b3.addEventListener("click", () => addEquation("3"));
const b4 = document.querySelector("#b4");
b4.addEventListener("click", () => addEquation("4"));
const b5 = document.querySelector("#b5");
b5.addEventListener("click", () => addEquation("5"));
const b6 = document.querySelector("#b6");
b6.addEventListener("click", () => addEquation("6"));
const b7 = document.querySelector("#b7");
b7.addEventListener("click", () => addEquation("7"));
const b8 = document.querySelector("#b8");
b8.addEventListener("click", () => addEquation("8"));
const b9 = document.querySelector("#b9");
b9.addEventListener("click", () => addEquation("9"));

/** Clear Button **/
function clearEquation() {
  equation = "";
  equationLength = 0;
  needNumber = true;
  lastDecimal = false;
  document.getElementById("equation").innerHTML = (equation);
}
const clear = document.querySelector("#clear");
clear.addEventListener("click", () => clearEquation());

/** Equals Button **/
const equals = document.querySelector("#equals");
equals.addEventListener("click", () => solve());

/** Decimal Button */
const bd = document.querySelector("#bd");
bd.addEventListener("click", () => addEquation("", false, true));

/** Back Button */
function backspace() {
  debug();

  // special case, no equation
  if(equationLength === 0) {
    return;
  }

  // reset the last variables 
  lastOp = "";
  lastNum = "";

    // special case, equation of length one
  if(equationLength === 1) {
    equation = "";
    equationLength = 0;
    needNumber = true;
    lastDecimal = false;
    document.getElementById("equation").innerHTML = (equation);
    return;
  }

  // standard removal is 1 character
  let number = 1;

  // first, handle removing a single decimal
  if(lastDecimal && equation.substring(equationLength - 1, equationLength) === ".") {
    lastDecimal = false;
  }

  // special case: removing the last character before an operator
  if(!needNumber && equation.toString().substring(equationLength - 1, equationLength) !== " " && equationLength > 1) {
    needNumber = true;
  } else if(needNumber && equation.toString().substring(equationLength - 1, equationLength) === " ") {
    // Special case: removing an operator
    number = 3;
    needNumber = false;
  } 

  // remove the characters
  equation = equation.toString().substring(0, equation.toString().length - number);
  equationLength =  equationLength - number;

  // update the equation display
  document.getElementById("equation").innerHTML = (equation);

  
  debug();
}
const back = document.querySelector("#back");
back.addEventListener("click",  () => backspace());

/**
 * Solves an equation given two operands and an operator
 */
function solveEq(operand1, operator, operand2) {
  if(operator === "÷") {
    if(operand2 === 0) {
      alert("Cannot Divide by zero.");
      return 0;
    }
    lastOp = operator;
    lastNum = operand2;
    return Math.round((operand1 / operand2) * decimals) / decimals;
  } else {
    if(operator === "+") {
      lastNum = operand2;
      lastOp = operator;
      return Math.round((operand1 + operand2) * decimals) / decimals;
    } else if(operator === "-") {
      lastOp = operator;
      lastNum = operand2;
      return Math.round((operand1 - operand2) * decimals) / decimals;
    } else if(operator === "×") {
      lastOp = operator;
      lastNum = operand2;
      return Math.round((operand1 * operand2) * decimals) / decimals;
    } else {
      alert("Invalid Equation.");
      return operand1;
    }
  }
  
  
}

/**
 * The actual logic of the calculator. Does NOT follow PEMDAS
 * Takes numbers and operators, separated by spaces, and processes them left to right
 * Uses the needNumber variable to verify that the is a number after every operator
 */
function solve() {
  // error catching for invalid equations
  if(needNumber) {
    alert("Please enter a valid equation.");
    return;
  }

  // the current total of this calculation
  // aka operand 1
  let total = "";

  // is this the first loop through?
  let firstLoop = true;

  // have we reached the end of the equation
  let end = false;

  // the current index we are the equation
  let idx = 0;

  while(!end) {
    // first get the first operand, but only on the first loop
    // since we only do this once at the start of the equation, we do not need anything fancy
    if(firstLoop) {
      total = parseFloat(equation);

      idx = total.toString().length;
    }

    // detect a repeat equals and act
    if(!needNumber && lastOp !== "" && lastNum !== "") {
      total = solveEq(total, lastOp, lastNum);
      end = true;
    } else {
      // skip the space before the operator
      idx++;

      // next get the operator, remove spaces
      var operator = equation.substring(idx, idx + 1);

      // skip the space before the operator
      idx++;

      // next get the second operand
      var operand2 = parseFloat(equation.substring(idx));

      // update the idx to include the second operator
      idx = idx + operand2.toString().length; 

      // do the calculation
      total = solveEq(total, operator, operand2);

      // indicate that we have completed the first loop
      firstLoop = false;

      // prepare for the next loop
      idx++;

      // have we reached the end of the equation?
      if(idx >= equationLength) {
        end = true;
      }
    }
  }

  // update the equation length
  equationLength = total.toString().length;

  // after calculation, update vars
  needNumber = false;
  
  // conditionally check for decimal points
  if(parseFloat(equation.toString()) > parseInt(equation.toString())) {
    lastDecimal = true;
  }
  
  // store the result in the equation
  equation = total;

  // update the html after solving
  document.getElementById("equation").innerHTML = (equation);

  // used for debuggign
  debug();
}