/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */

function ConvertHandler() {
  //   function to the nuber from input
  this.getNum = function(input) {
    const regexSplit = /[a-z]/i;
    let result;
    if (regexSplit.test(input) === true) {
      const indexSplit = input.search(regexSplit);
      result = input.slice(0, indexSplit);
    } else {
      result = input;
    }
    const regexNum = /[1-9]\d*(\.\d+)?\/?[1-9]?(\d*)?(\.\d+)?/;
    const regexDoubleFraction = /\//g;

    if (result === "") {
      result = 1;
      return result;
    }

    if (regexNum.test(result) === false) {
      result = "invalid number";
    } else if (
      result.match(regexDoubleFraction) !== null &&
      result.match(regexDoubleFraction).length >= 2
    ) {
      result = "invalid number";
    } else {
      result = eval(result);
      const resultString = result.toString();
      const index = resultString.indexOf(".");
      if (resultString.length - index - 1 > 5) {
        result = parseFloat(result.toFixed(5));
      }
    }
    return result;
  };

  // function to get the unit
  this.getUnit = function(input) {
    let result;

    // look for the first index of alphabet
    let indexOfAlpha = input.search(/[a-zA-Z]/gi);

    // slice from the first index of aplhabet to end of input and change it to be lowercase
    result = input.slice(indexOfAlpha).toLowerCase();

    // if there is space in unit
    if (["gal", "l", "mi", "km", "lbs", "kg"].indexOf(result) === -1)
      return "invalid unit";

    // for liter
    if (result === "l") return "L";

    return result;
  };

  this.getReturnUnit = function(initUnit) {
    let result;
    var input = ["gal", "L", "mi", "km", "lbs", "kg"];
    var expect = ["L", "gal", "km", "mi", "kg", "lbs"];
    result = expect[input.indexOf(initUnit)];
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result;
    var input = ["gal", "L", "mi", "km", "lbs", "kg"];
    var expect = [
      "gallons",
      "liters",
      "miles",
      "kilometers",
      "pounds",
      "kilograms"
    ];
    result = expect[input.indexOf(unit)];
    return result;
  };

  this.convert = function(initNum, initUnit) {
    let result;
    const galToL = 3.78541;
    const lToGal = 1 / galToL;
    const lbsToKg = 0.453592;
    const kgToLbs = 1 / lbsToKg;
    const miToKm = 1.60934;
    const kmToMi = 1 / miToKm;
    let input = ["gal", "L", "mi", "km", "lbs", "kg"];
    let convert = [galToL, lToGal, miToKm, kmToMi, lbsToKg, kgToLbs];
    result = initNum * convert[input.indexOf(initUnit)];

    if (result !== "invalid number") {
      const resultString = result.toString();
      const index = resultString.indexOf(".");
      if (resultString.length - index - 1 > 5) {
        result = Number.parseFloat(result.toFixed(5));
      }
    }

    return result;
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    let initUnitFull = this.spellOutUnit(initUnit);
    let reuturnUnitFull = this.spellOutUnit(returnUnit);
    result = `${initNum} ${initUnitFull} converts to ${returnNum} ${reuturnUnitFull}`;
    return result;
  };
}

// thi
module.exports = ConvertHandler;
