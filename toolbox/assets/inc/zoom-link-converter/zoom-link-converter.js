// Define a variable to store the reference to the timeout for hiding the alert
let alertTimeout;

// Function to show a temporary alert message
function showAlert(message) {
  const alertElement = document.createElement("div");
  alertElement.className = "alert";
  alertElement.textContent = message;
  document.body.appendChild(alertElement);

  // Set a timeout to hide the alert after 5 seconds
  alertTimeout = setTimeout(() => {
    hideAlert(alertElement);
  }, 5000);

  // Hide the alert if the window is clicked
  window.addEventListener("click", () => {
    hideAlert(alertElement);
  });
}

// Function to hide the alert
function hideAlert(alertElement) {
  if (alertElement && alertElement.parentNode) {
    alertElement.parentNode.removeChild(alertElement);
  }

  // Clear the timeout reference
  clearTimeout(alertTimeout);
}

// zoom-link-convert function
function convertZoomUrl(inputUrl) {
  // Remove white spaces from the input URL
  const cleanedUrl = inputUrl.replace(/\s+/g, '');

  // Define a regular expression pattern to match Zoom meeting URLs
  const zoomUrlPattern = /^(https:\/\/[\w.-]+\.zoom\.us\/j\/\d+\?pwd=[\w-]+)$/;

  // Check if the cleaned URL matches the Zoom URL pattern
  if (zoomUrlPattern.test(cleanedUrl)) {
    // Extract the meeting ID and password from the input URL
    const [, meetingId, password] = cleanedUrl.match(/\/j\/(\d+)\?pwd=([\w-]+)/);

    // Construct the converted Zoom meeting URL
    const convertedUrl = `https://godaddy.zoom.us/wc/join/${meetingId}?pwd=${password}`;

    return convertedUrl;
  } else {
    // If the cleaned URL doesn't match the expected pattern, show an error message
    showAlert("Invalid Zoom meeting URL");
    return "Invalid Zoom meeting URL";
  }
}

// zoom-link-convert function string replace URL from Zoom link
function convertAndDisplay() {
  const inputTextArea = document.getElementById("zoomUrlInput");
  const outputTextArea = document.getElementById("zoomUrlOutput");
  const copyButton = document.getElementById("copyButton");

  const inputUrl = inputTextArea.value;
  const convertedUrl = convertZoomUrl(inputUrl);

  if (convertedUrl === "Invalid Zoom meeting URL") {
    copyButton.disabled = true; // Disable the "Copy" button
  } else {
    copyButton.disabled = false; // Enable the "Copy" button
    copyTextToClipboardAndShowAlert(convertedUrl); // Copy and show success alert
  }

  outputTextArea.value = convertedUrl;
}

// zoom-link-convert function clear input and output fields URL from Zoom link
function clearInputOutput() {
  const inputTextArea = document.getElementById("zoomUrlInput");
  const outputTextArea = document.getElementById("zoomUrlOutput");
  const copyButton = document.getElementById("copyButton");

  inputTextArea.value = "";
  outputTextArea.value = "";
  copyButton.disabled = true; // Disable the "Copy" button
}

// Function to copy text to clipboard and show a success message
function copyTextToClipboardAndShowAlert(textToCopy) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showAlert("Copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard: ", error);
      });
  } else {
    // Fallback for browsers that do not support the Clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showAlert("Copied to clipboard!");
  }
}

// Add an event listener to run the clearInputOutput function when the DOM is loaded
document.addEventListener("DOMContentLoaded", clearInputOutput);
