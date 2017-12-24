/// General default plate progressions
const PLATES_POUNDS = [45, 25, 10, 5, 2.5];
const PLATES_KILOS  = [20, 10, 5, 2.5, 1.25];
const POUNDS = "lbs";
const KILOS = "kgs";

/*
 * Weight plate progression.
 */
var plates = [];
/*
 * Weight unit.
 */
var platesUnit = POUNDS;
/*
 * Currently calculated quantities.
 */
var currentlyCalculated = [];

/*
 * Create an array of equal length, with all values set to 0.
 */
function createZeroArray(arr) {
    let zeros = [];
    for (let i = 0; i < arr.length; i++ ) {
        zeros.push(0);
    }
    return zeros;
}

/*
 * Set the plate weight and counts (Display the calculations).
 * NOTE: Assumes that counts.length >= pl.length.
 * id - Id of the list.
 * pl - Array of plate weights.
 * count - Array of corresponding amounts of each plate weights.
 * unitName - Name of the unit ('lbs' or 'kgs').
 */
function setPlates(id, pl, counts, unitName) {
    plates = pl;
    platesUnit = unitName;
    /*
     * Create an informational row.
     * plateWeight - Weight of a plate.
     * count - Quantity of that plate.
     */
    function createRow(plateWeight, count) {
        let list = document.getElementById(id);
        let child = document.createElement("LI");
        child.className = "list-group-item";
        // Set the row data, count is halved to represent one side of barbell
        child.innerHTML = `${plateWeight}${unitName} x ${count / 2}`;
        list.appendChild(child);
    }

    // Update rows
    let list = document.getElementById(id);
    list.innerHTML = ""; // Clear all rows
    for (let x = 0; x < pl.length; x++) {
        createRow(pl[x], counts[x]);
    }
}
/*
 * Calculate how many weight plates need to be loaded on a barbell.
 * weight - Total weight (includes bar weight).
 * barWeight - Weight of the bar.
 * plates - Array of weight plates available. Assumed that it is sorted in descending order.
 * unitName - Name of the unit ('lbs' or 'kgs').
 * return: Array of quantity of each given plate to use. The returned array will have
 * the length of plates.length + 1, because the last element will be the remaining weight
 * (leftover amount of weight that can't be covered by any of the given plates).
 *
 * Example:
 * INPUT:
 * weight = 136
 * barWeight = 45
 * plates = [45, 25, 10, 5, 2.5]
 * OUTPUT:
 * [2, 0, 0, 0, 0, 1]
 * The last value is 1 because there are no given plates that can add up to 1.
 */
function calculatePlates(weight, barWeight, plates, unitName) {
    let calculated = [];
    let remainingWeight = weight - barWeight;
    for (let iter = 0; iter < plates.length; iter++) {
        // Calculate how many of a plate is needed
        let count = Math.floor(remainingWeight / plates[iter]);
        // Cannot have uneven amount of plates
        if (count % 2 != 0) {
            count -= 1;
        }
        // Decrease remainingWeight for next iteration
        remainingWeight -= plates[iter] * count;
        // Add to calculated array
        calculated.push(count);
    }
    // Push any remaining weight
    calculated.push(remainingWeight);
    return calculated;
}
/*
 * Get input and do the plate math.
 * inputId - Id of the input for the weight.
 * barInputId - Id of the input for the bar weight.
 * remainingId - Id of the remainer output.
 */
function doCalculation(inputId, barInputId, remaining="remaining") {
    let input = document.getElementById(inputId);
    let barWeightElem = document.getElementById(barInputId);
    let newPlates = calculatePlates(parseFloat(input.value),
                                    parseFloat(barWeightElem.value),
                                    plates,
                                    platesUnit
                                   );
    setPlates("rows", plates,
              newPlates,
              platesUnit
             );
    // Set remaining
    document.getElementById(remaining).innerHTML =
        `Remaining: ${newPlates[newPlates.length - 1]}${platesUnit}`
}
/*
 * Get the plate progression array for given unit.
 * return: Array of plate weights.
 */
function getStandardProgressionFor(unit) {
    if (unit == POUNDS) {
        return PLATES_POUNDS;
    } else {
        return PLATES_KILOS;
    }
}
/*
 * Switch weight unit. This changes the unit and the plates, and calls doCalculation().
 * unit - Unit to use ('lbs' or 'kgs').
 */
function updateToNewUnit(unit) {
    platesUnit = unit;
    plates = getStandardProgressionFor(platesUnit);
    document.getElementById("calculatebtn").click();
}
function buttonSwitchUnit(buttonElement) {
    let unitname = buttonElement.getAttribute("data-unitname");
    updateToNewUnit(unitname);
    buttonElement.setAttribute("data-unitname", (unitname == POUNDS) ? KILOS : POUNDS);
    // Update button text to reflect what unit can be switched to
    buttonElement.innerHTML = "Switch to " + buttonElement.getAttribute("data-unitname");
}
// onload, default to pounds
function initPage() {
    setPlates("rows", PLATES_POUNDS, createZeroArray(PLATES_POUNDS), POUNDS);
}
