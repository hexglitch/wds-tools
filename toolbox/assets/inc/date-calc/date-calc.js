// Function to add workdays to a given date, skipping weekends (Saturday and Sunday)
function addWorkdays(startDate, numWorkdays) {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    let currentDate = new Date(startDate);
    let workdaysRemaining = numWorkdays;

    while (workdaysRemaining > 0) {
        currentDate.setTime(currentDate.getTime() + oneDayMilliseconds);
        const dayOfWeek = currentDate.getDay();

        // Skip Saturday (6) and Sunday (0)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workdaysRemaining--;
        }
    }
    return currentDate;
}

// Function to check if a given date is a weekend (Saturday or Sunday)
function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
}

// Function to get the next working day, skipping weekends
function getNextWorkingDay(date) {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    let nextDay = new Date(date.getTime() + oneDayMilliseconds);

    while (isWeekend(nextDay)) {
        nextDay = new Date(nextDay.getTime() + oneDayMilliseconds);
    }

    return nextDay;
}

function calculateDueDates() {
    try {
        const todayDate = new Date();
        const dropDown1Value = parseInt(document.getElementById("dropDown1").value);
        const dropDown2Value = parseInt(document.getElementById("dropDown2").value);
        const dropDown3Value = parseInt(document.getElementById("dropDown3").value);
        const after4pmCheckbox = document.getElementById("after4pm");
        const futureDateRequiredCheckbox = document.getElementById("futureDateRequired");
        const datePicker = document.getElementById("datePicker");
        const contentDueDateElement = document.getElementById("contentDueDate");
        const newDueDateElement = document.getElementById("newDueDate");
        const appointmentDateElement = document.getElementById("appointmentDate");

        // Use the selected date from the date picker or default to today's date
        const selectedDateValue = datePicker.value; // e.g., "10-15-2023"
        const selectedDate = futureDateRequiredCheckbox.checked ? parseAndReformatDate(selectedDateValue) : todayDate;

        let totalBusinessDays = dropDown1Value + dropDown3Value;

        if (dropDown2Value === 1) {
            totalBusinessDays++;
        } else if (dropDown2Value === 2) { // Add another day for the second holiday
            totalBusinessDays += 2;
        }

        // Check if the checkbox is checked, and if so, add 1 working day
        if (after4pmCheckbox.checked) {
            totalBusinessDays++;
        }

        // Show/hide date picker based on the checkbox
        if (futureDateRequiredCheckbox.checked) {
            datePicker.style.display = "block"; // Show the date picker
        } else {
            datePicker.style.display = "none"; // Hide the date picker
        }

        // Calculate and display the content due date, skipping weekends
        let contentDueDate;

        if (futureDateRequiredCheckbox.checked && selectedDateValue) {
            // Use the selected date if "Future Date Required" is checked and a date is selected
            contentDueDate = parseAndReformatDate(selectedDateValue);
        } else {
            // Default to today's date
            contentDueDate = todayDate;
        }

        // Check if the content due date falls on a weekend (Saturday or Sunday)
        if (contentDueDate.getDay() === 0) {
            // If it's Sunday, increment the date by 1 to make it Monday
            contentDueDate.setDate(contentDueDate.getDate() + 1);
        } else if (contentDueDate.getDay() === 6) {
            // If it's Saturday, increment the date by 2 to make it Monday
            contentDueDate.setDate(contentDueDate.getDate() + 2);
        }

        contentDueDateElement.textContent = contentDueDate.toDateString();



        // Calculate and display the new due date, skipping weekends
        const startDate = contentDueDate;
        const workingDays = dropDown1Value + dropDown2Value + dropDown3Value + (after4pmCheckbox.checked ? 1 : 0);
        const newDueDate = addWorkdays(startDate, workingDays);
        newDueDateElement.textContent = newDueDate.toDateString();

        // Calculate and display the appointment date (1 business day added), skipping weekends
        const appointmentDate = addWorkdays(newDueDate, 1);
        appointmentDateElement.textContent = appointmentDate.toDateString();

    } catch (error) {
        console.error("Error calculating due dates:", error);
    }
}

// Function to parse and reformat the date string from "MM-DD-YYYY" to "MM/DD/YYYY"
function parseAndReformatDate(selectedDateValue) {
    const dateParts = selectedDateValue.split("-");
    const formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
    return new Date(formattedDate);
}


// Add event listeners for dropdown changes
document.getElementById("dropDown1").addEventListener("change", calculateDueDates);
document.getElementById("dropDown2").addEventListener("change", calculateDueDates);
document.getElementById("dropDown3").addEventListener("change", calculateDueDates);
document.getElementById("after4pm").addEventListener("change", calculateDueDates);

// Add an event listener for the date picker change event
document.getElementById("datePicker").addEventListener("change", calculateDueDates);

// Add an event listener for the "Future Date Required" checkbox
document.getElementById("futureDateRequired").addEventListener("change", calculateDueDates);

// Function to reset and initialize the page
function resetAndInitialize() {
    // Reset dropdowns to default values
    document.getElementById("dropDown1").value = "8";
    document.getElementById("dropDown2").value = "0";
    document.getElementById("dropDown3").value = "0";
    document.getElementById("after4pm").checked = false;
    document.getElementById("futureDateRequired").checked = false;
    document.getElementById("datePicker").value = ""; // Clear the date picker value

    // Calculate and display today's date
    const todayDateElement = document.getElementById("todayDate");
    const today = new Date();
    todayDateElement.textContent = today.toDateString();

    calculateDueDates(); // Calculate and display due dates
}

// Event listener for reloading
window.addEventListener("beforeunload", function () {
    resetAndInitialize();
});

// Initial calculation and display
resetAndInitialize();
