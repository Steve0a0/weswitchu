
  function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.toggle("hidden");
  } else {
    console.warn(`Section with ID "${sectionId}" not found.`);
  }
}


 // Array to store property details for the current session only
let filledProperties = [];

// Function to collect property details from the form
function collectPropertyDetails() {
  const propertyAlias = document.getElementById("property-name").value || "Main Residence";
  const homeType = document.getElementById("home-type").value;
  const heatingSource = document.getElementById("primary-heating-source").value;
  const description = document.getElementById("best-describes-you").value;

  // Collect utility selections
  const electricity = document.getElementById("toggle-electricity").checked ? "Yes" : "No";
  const gas = document.getElementById("toggle-gas").checked ? "Yes" : "No";
  const broadband = document.getElementById("toggle-broadband").checked ? "Yes" : "No";

  // Create a property object
  const propertyDetails = {
    alias: propertyAlias,
    homeType: homeType,
    heatingSource: heatingSource,
    description: description,
    utilities: {
      electricity: electricity,
      gas: gas,
      broadband: broadband
    }
  };

  // Add property to the list
  filledProperties.push(propertyDetails);
  console.log("Property collected and added:", propertyDetails);
  console.log("Current filled properties:", filledProperties);
}

function displayRecentProperties() {
  console.log("Displaying property names on consent page...");
  console.log("Current properties:", filledProperties);

  const propertyList = document.getElementById("property-list-items");
  const propertyListContainer = document.getElementById("property-list");

  if (!propertyList || !propertyListContainer) {
    console.error("Property list elements not found in DOM!");
    return;
  } else {
    console.log("Property list elements found!");
  }

  propertyList.innerHTML = ""; // Clear the list before appending

  if (filledProperties.length === 0) {
    console.warn("No properties available to display!");
  }

  // Display only the property alias in the list
  filledProperties.forEach((property, index) => {
    console.log(`Adding property to list: ${property.propertyAlias}`); // Log each property alias
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${property.propertyAlias}`; // Display only the house name
    propertyList.appendChild(listItem);
  });

  // Make sure the list is visible
  propertyListContainer.classList.remove("hidden");
  console.log("Property names displayed successfully on the consent page.");
}


document.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("consent-button")) {
    console.log("Consent button clicked!");
    // collectPropertyDetails();
    displayRecentProperties();
    showStep("consent");
  }
});



// Add Event Listener for "Add Another Property" button
document.querySelector(".add-property-button").addEventListener("click", function () {
  collectPropertyDetails(); // Save current property details
  alert("Property Added! You can now add a new property.");
  resetFormFields(); // Reset form for new property
});




  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded. Attaching event listeners...");
    attachEventListeners();
    updateHomeDetailsBackButton();
    // updatePropertyList();
});

// let propertyEntries = JSON.parse(sessionStorage.getItem("propertyEntries")) || [];

function attachEventListeners() {
    console.log("Attaching event listeners...");

    // Handle "Next" button clicks for standard flow
    document.querySelectorAll(".next-button:not(.add-property-button)")
      .forEach(button => {
          button.addEventListener("click", function () {
              let nextStepId = this.getAttribute("data-next");
              if (nextStepId) {
                  console.log(`Navigating to ${nextStepId}`);
                  showStep(nextStepId);
              }
          });
      });

      if (document.querySelector(".add-property-button")) {
    const addPropertyButton = document.querySelector(".add-property-button");
    addPropertyButton.addEventListener("click", function () {
      collectPropertyDetails();
      alert("Property Added! You can now add a new property.");
      resetFormFields();
    });
  } else {
    console.warn('Element with class "add-property-button" not found.');
  }


    // Handle "Consent" button clicks
    if (document.querySelector(".consent-button")) {
    const consentButton = document.querySelector(".consent-button");
    consentButton.addEventListener("click", function () {
      saveCurrentProperty();
      showStep("consent");
    });
  } else {
    console.warn('Element with class "consent-button" not found.');
  }

    // Handle "Back" button clicks
    document.querySelectorAll(".prev-button").forEach(button => {
      button.addEventListener("click", function () {
        let prevStepId = this.getAttribute("data-prev");
        if (prevStepId) {
          console.log(`Navigating back to ${prevStepId}`);
          showStep(prevStepId);
        }
      });
    });

    // Handle Yes/No buttons in Property Setup
    document.querySelectorAll("#property-setup .yes-button, #property-setup .no-button").forEach(button => {
        button.addEventListener("click", function () {
            let nextStepId = this.getAttribute("data-next");

            if (this.classList.contains("yes-button")) {
                sessionStorage.setItem("propertySetupSelection", "yes");
                sessionStorage.setItem("propertyAlias", "Main");
            } else {
                sessionStorage.setItem("propertySetupSelection", "no");
            }

            if (nextStepId) {
                showStep(nextStepId);
            }
        });
    });

    // Handle Yes/No buttons in Residence Check
    document.querySelectorAll("#residence-check .yes-button, #residence-check .no-button").forEach(button => {
        button.addEventListener("click", function () {
            let nextStepId = this.getAttribute("data-next");

            if (this.classList.contains("yes-button")) {
                sessionStorage.setItem("residenceSelection", "yes");
            } else {
                sessionStorage.setItem("residenceSelection", "no");
            }

            if (nextStepId) {
                showStep(nextStepId);
            }
        });
    });

    // Watch for step change in Utilities
    const utilitiesSection = document.getElementById("utilities");
    if (utilitiesSection) {
        const observer = new MutationObserver(() => {
            if (!utilitiesSection.classList.contains("hidden")) {
                updateUtilitiesNextButton();
            }
        });
        observer.observe(utilitiesSection, { attributes: true, attributeFilter: ["class"] });
    }

    // Listen for input changes in Property Alias field
    const propertyInput = document.getElementById("property-name");
    if (propertyInput) {
        propertyInput.addEventListener("input", function () {
            if (sessionStorage.getItem("residenceSelection") === "no") {
                sessionStorage.setItem("propertyAlias", this.value.trim());
            }
            updateHeaderText();
        });
    }
}

// Function to show/hide steps
function showStep(step) {
    console.log(`Showing step: ${step}`);
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    const nextStepElement = document.getElementById(step);

    if (nextStepElement) {
        nextStepElement.classList.remove('hidden');
        updateHeaderText();
    } else {
        console.error(`Step ${step} not found!`);
    }
}

// Function to save form data before adding another property
function saveCurrentProperty() {
  let propertyAlias = sessionStorage.getItem("propertyAlias") || "Main Residence";

  if (sessionStorage.getItem("residenceSelection") === "yes") {
    propertyAlias = "Main";
  }

  const homeType = document.getElementById("home-type").value;
  const heatingSource = document.getElementById("primary-heating-source").value;
  const bestDescribesYou = document.getElementById("best-describes-you").value;
  const hasSolar = document.getElementById("solar-pv").value;
  const hasEV = document.getElementById("ev-ownership").value;

  if (!propertyAlias) {
    alert("Please enter a property name before adding another.");
    return;
  }

  const propertyData = {
    propertyAlias,
    homeType,
    heatingSource,
    bestDescribesYou,
    hasSolar,
    hasEV
  };

  filledProperties.push(propertyData); // Use filledProperties instead of propertyEntries
  console.log("Saved Property:", propertyData);
}
// function updatePropertyList() {
//     const propertyListContainer = document.getElementById("property-list");
//     const propertyList = document.getElementById("property-list-items");
//     propertyList.innerHTML = ""; // Clear existing list

//     const savedProperties = JSON.parse(sessionStorage.getItem("propertyEntries")) || [];
    
//     if (savedProperties.length > 0) {
//         propertyListContainer.classList.remove("hidden"); // Show the list container
//         savedProperties.forEach((property, index) => {
//             const listItem = document.createElement("li");
//             listItem.textContent = `${index + 1}. ${property.propertyAlias} (${property.homeType})`;
//             propertyList.appendChild(listItem);
//         });
//     } else {
//         propertyListContainer.classList.add("hidden"); // Hide the list if empty
//     }
// }

// Show property list when entering Utilities step
const utilitiesSection = document.getElementById("utilities");
if (utilitiesSection) {
    const observer = new MutationObserver(() => {
        if (!utilitiesSection.classList.contains("hidden")) {
            // updatePropertyList(); // Update list when Utilities step is shown
        }
    });

    observer.observe(utilitiesSection, { attributes: true, attributeFilter: ["class"] });
}

// Function to reset form fields when starting a new property
function resetFormFields() {
    document.getElementById("property-name").value = "";
    document.getElementById("home-type").selectedIndex = 0;
    document.getElementById("primary-heating-source").selectedIndex = 0;
    document.getElementById("best-describes-you").selectedIndex = 0;
    document.getElementById("solar-pv").selectedIndex = 0;
    document.getElementById("ev-ownership").selectedIndex = 0;
    sessionStorage.removeItem("propertyAlias");
}

// Function to update the Next button in Utilities if "Yes" was selected in Property Setup
function updateUtilitiesNextButton() {
    const selection = sessionStorage.getItem("propertySetupSelection");
    const addPropertyButton = document.querySelector(".add-property-button");
    const consentButton = document.querySelector(".consent-button");

    if (selection === "yes") {
        addPropertyButton.classList.remove("hidden"); // Show "Add Another Property"
    } else {
        addPropertyButton.classList.add("hidden"); // Hide it if "No" was selected
    }
}

// Function to update header text dynamically
function updateHeaderText() {
    const dynamicLine = document.getElementById("dynamic-property-line");
    const propertyAlias = sessionStorage.getItem("propertyAlias") || "";

    if (!dynamicLine) return;

    if (sessionStorage.getItem("residenceSelection") === "yes") {
        dynamicLine.innerHTML = "Let's set up your main home for you";
    } else {
        dynamicLine.innerHTML = `Let's set up ${propertyAlias ? propertyAlias : "your property"} for you`;
    }
}


  

  document.addEventListener("DOMContentLoaded", function () {
    // Check if the URL contains showPopup=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("showPopup") === "true") {
        showPopup();
    }
});

function showPopup() {
    fetch("questionspopup.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("popupContent").innerHTML = html;
            document.getElementById("questionModal").classList.remove("hidden");

            // Reattach event listeners after loading the popup
            setTimeout(attachEventListeners, 100); 
        })
        .catch(error => console.error("Error loading popup:", error));
}


function closeModal() {
    document.getElementById("questionModal").classList.add("hidden");
}





  function toggleSection(sectionId) {
      const section = document.getElementById(sectionId);
      section.classList.toggle("hidden");
  }

  function toggleSolarFields() {
      const solarQuestions = document.getElementById("solar-questions");
      const solarPV = document.getElementById("solar-pv").value;
      if (solarPV === "yes") {
          solarQuestions.classList.remove("hidden");
      } else {
          solarQuestions.classList.add("hidden");
      }
  }


  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ev-ownership").addEventListener("change", toggleEVQuestions);
    document.getElementById("solar-pv").addEventListener("change", toggleSolarFields);
    document.getElementById("solar-battery").addEventListener("change", toggleBatteryCapacity);
});

function toggleEVQuestions() {
    const evSelection = document.getElementById("ev-ownership").value;
    const evOneQuestions = document.getElementById("ev-one-questions");
    const evMultipleQuestions = document.getElementById("ev-multiple-questions");

    evOneQuestions.classList.add("hidden");
    evMultipleQuestions.classList.add("hidden");

    if (evSelection === "one") {
        evOneQuestions.classList.remove("hidden");
    } else if (evSelection === "more-than-one") {
        evMultipleQuestions.classList.remove("hidden");
    }
}

function toggleSolarFields() {
    const solarSelection = document.getElementById("solar-pv").value;
    const solarQuestions = document.getElementById("solar-questions");
    solarQuestions.classList.toggle("hidden", solarSelection === "no");
}

function toggleBatteryCapacity() {
    const batterySelection = document.getElementById("solar-battery").value;
    const batteryCapacityQuestion = document.getElementById("battery-capacity-question");
    batteryCapacityQuestion.classList.toggle("hidden", batterySelection === "no");
}

let evCountForAddAnother = 0; // Track number of EVs added

function addAnotherEV() {
    evCountForAddAnother++;
    const evContainer = document.getElementById("ev-multiple-questions");

    // Create EV Entry Container
    const newEV = document.createElement("div");
    newEV.classList.add("ev-entry", "bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mt-4");
    newEV.setAttribute("id", `ev-entry-${evCountForAddAnother}`);

    // Inner HTML with Add and Delete Button
    newEV.innerHTML = `
        <h4 class="font-bold text-gray-700">EV ${evCountForAddAnother} Details:</h4>
        <div>
            <label class="block text-gray-700 font-medium">Is it a full battery EV (BEV) or Plug In Hybrid (PHEV)?</label>
            <select class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm">
                <option value="bev">Full Battery EV (BEV)</option>
                <option value="phev">Plug In Hybrid (PHEV)</option>
            </select>
        </div>
        <div>
            <label class="block text-gray-700 font-medium">What size is your car's battery?</label>
            <input type="number" class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm" placeholder="Enter battery size in kWh">
        </div>
        <div>
            <label class="block text-gray-700 font-medium">How many KM do you think you drive per year?</label>
            <input type="number" class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm" placeholder="Enter KM per year">
        </div>
        <div class="flex justify-between mt-4">
            <button type="button" class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700" onclick="removeEV('ev-entry-${evCountForAddAnother}')">Delete</button>
            <button type="button" id="add-ev-btn" class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700" onclick="addAnotherEV()">Add Another EV</button>
        </div>
    `;

    // Remove previous "Add Another EV" button
    const existingButtons = evContainer.querySelectorAll(".ev-entry button#add-ev-btn");
    existingButtons.forEach(button => button.remove());

    evContainer.appendChild(newEV);
}

function removeEV(evId) {
    const evElement = document.getElementById(evId);
    if (evElement) {
        evElement.remove();
    }

    // If no EVs are left, reset the counter
    const remainingEVs = document.querySelectorAll(".ev-entry").length;
    if (remainingEVs === 0) {
        evCountForAddAnother = 0;
    }
}





  function toggleSolarFields() {
      const solarPV = document.getElementById("solar-pv").value;
      const solarQuestions = document.getElementById("solar-questions");

      if (solarPV === "yes") {
          solarQuestions.classList.remove("hidden");
      } else {
          solarQuestions.classList.add("hidden");
      }
  }


  function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    document.getElementById(step).classList.remove('hidden');

    // Define step order
    let steps = ['property-setup', 'residence-check', 'property-alias', 'home-details', 'utilities', 'consent'];
    let stepLines = document.querySelectorAll('.step-line');

    steps.forEach((stepId, index) => {
        let indicator = document.querySelector(`.${stepId}-indicator`);
        let img = indicator ? indicator.querySelector('img') : null;
        let line = stepLines[index - 1]; // Step line connects previous step to the current one

        if (indicator && img) {
            if (stepId === step) {
                // Current step
                indicator.classList.add('text-blue-600');
                indicator.classList.remove('text-gray-400');
                img.classList.add('filter-blue');
                img.classList.remove('filter-gray');
            } else if (steps.indexOf(stepId) < steps.indexOf(step)) {
                // Completed steps
                indicator.classList.add('text-blue-600');
                indicator.classList.remove('text-gray-400');
                img.classList.add('filter-blue');
                img.classList.remove('filter-gray');
                if (line) line.classList.add('bg-blue-600');
            } else {
                // Future steps (gray)
                indicator.classList.add('text-gray-400');
                indicator.classList.remove('text-blue-600');
                img.classList.add('filter-gray');
                img.classList.remove('filter-blue');
                if (line) line.classList.remove('bg-blue-600');
            }
        }
    });

    // Update header text dynamically (if applicable)
    updateHeaderText();
}

// Function to move to the next step
function nextStep() {
    let steps = ['property-setup', 'residence-check', 'property-alias', 'home-details', 'utilities', 'consent'];
    let currentStep = steps.find(step => !document.getElementById(step).classList.contains('hidden'));
    let nextIndex = steps.indexOf(currentStep) + 1;

    if (nextIndex < steps.length) {
        showStep(steps[nextIndex]);
    }
}

// Function to move to the previous step
function prevStep() {
    let steps = ['property-setup', 'residence-check', 'property-alias', 'home-details', 'utilities', 'consent'];
    let currentStep = steps.find(step => !document.getElementById(step).classList.contains('hidden'));
    let prevIndex = steps.indexOf(currentStep) - 1;

    if (prevIndex >= 0) {
        showStep(steps[prevIndex]);
    }
}

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".next-button").addEventListener("click", nextStep);
    document.querySelector(".prev-button").addEventListener("click", prevStep);
});






  function toggleField(toggleId, fieldId) {
      const toggle = document.getElementById(toggleId);
      const field = document.getElementById(fieldId);
      if (toggle.checked) {
          field.classList.remove("hidden");
      } else {
          field.classList.add("hidden");
      }
  }


  function toggleCard(cardId, sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
  }

  function toggleSolarFields() {
    const solarSection = document.getElementById('solar-questions');
    solarSection.classList.toggle('hidden');
  }



    function loadContent(page) {
    const contentArea = document.getElementById('content-area');
    const sidebar = document.getElementById('default-sidebar');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    // Fetch the content of the page and load it into the content area
    fetch(page)
        .then(response => response.text())
        .then(data => {
            contentArea.innerHTML = data;

            // Close the sidebar after loading the content
            if (!sidebar.classList.contains("-translate-x-full")) {
                sidebar.classList.add("-translate-x-full");
                hamburgerIcon.classList.remove("hidden"); // Show Hamburger Icon
                closeIcon.classList.add("hidden"); // Hide Close Icon
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p class="text-red-500">Failed to load content. Please try again later.</p>';
        });
}

  

    document.addEventListener("DOMContentLoaded", function () {
      const hamburger = document.getElementById("hamburger");
      const sidebar = document.getElementById("default-sidebar");
      const hamburgerIcon = document.getElementById("hamburger-icon");
      const closeIcon = document.getElementById("close-icon");

      // Toggle Sidebar Visibility
      hamburger.addEventListener("click", function () {
        sidebar.classList.toggle("-translate-x-full");

        // Toggle between hamburger and close icons
        hamburgerIcon.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
      });
    });
  
  
    document.addEventListener("DOMContentLoaded", function () {
      lucide.createIcons();
    });
  

    document.addEventListener("DOMContentLoaded", function () {
        const userMenuButton = document.getElementById("user-menu-button");
        const userDropdown = document.getElementById("user-dropdown");

        userMenuButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent click from closing immediately
            userDropdown.classList.toggle("hidden");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.add("hidden");
            }
        });
    });



    function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  // Use backticks for proper string interpolation:
  const arrow = document.getElementById(`${dropdownId.split('-')[0]}-arrow`);

  if (dropdown) {
    dropdown.classList.toggle("hidden");
  } else {
    console.warn(`Dropdown element with ID "${dropdownId}" not found.`);
  }

  if (arrow) {
    arrow.classList.toggle("rotate-180");
  } else {
    console.warn(`Arrow element with ID "${dropdownId.split('-')[0]}-arrow" not found.`);
  }
}

  
  
    function toggleModernDropdown(dropdownId) {
      const dropdown = document.getElementById(dropdownId);
      const arrow = document.getElementById(`${dropdownId}-arrow`);
  
      // Toggle dropdown visibility
      dropdown.classList.toggle("show");
  
      // Rotate arrow
      arrow.classList.toggle("up");
    }
  
    // Close dropdown when clicking outside (for modern dropdown)
    window.addEventListener("click", function (event) {
      if (!event.target.closest(".modern-dropdown")) {
        document.querySelectorAll(".dropdown-content").forEach((menu) => {
          menu.classList.remove("show");
        });
        document.querySelectorAll(".dropdown-arrow").forEach((arrow) => {
          arrow.classList.remove("up");
        });
      }
    });
  


  // Generic function to handle dropdowns (renamed from toggleDropdown)
  function setupDropdown(buttonId, contentId, arrowId) {
    document.getElementById(buttonId).addEventListener('click', function (event) {
      const content = document.getElementById(contentId);
      const arrow = document.getElementById(arrowId);
      
      content.classList.toggle('hidden');
      arrow.classList.toggle('rotate-180');
      
      event.stopPropagation(); // Prevent window click event from triggering
    });
  }

  // List of dropdowns to initialize
  const dropdowns = [
    { btn: 'broadbandDropdownButton', content: 'broadband-service-details', arrow: 'broadbandDropdownArrow' },
    { btn: 'evDropdownButton', content: 'evDropdownContent', arrow: 'evDropdownArrow' },
    { btn: 'solarDropdownButton', content: 'solarDropdownContent', arrow: 'solarDropdownArrow' },
    { btn: 'utilitiesDropdownButton', content: 'utilitiesDropdownContent', arrow: 'utilitiesDropdownArrow' },
    { btn: 'residenceDropdownButton', content: 'residenceDropdownContent', arrow: 'residenceDropdownArrow' },
    { btn: 'dropdownButton', content: 'dropdownContent', arrow: 'dropdownArrow' },
    { btn: 'homeDetailsDropdownButton', content: 'homeDetailsDropdownContent', arrow: 'homeDetailsDropdownArrow' }
  ];

  // Initialize all dropdowns
  dropdowns.forEach(d => setupDropdown(d.btn, d.content, d.arrow));

  // Close dropdowns when clicking outside the button and the content
  window.addEventListener('click', function (e) {
    dropdowns.forEach(d => {
      if (!e.target.closest(`#${d.btn}`) && !e.target.closest(`#${d.content}`)) {
        document.getElementById(d.content).classList.add('hidden');
        document.getElementById(d.arrow).classList.remove('rotate-180');
      }
    });
  });

  // EV Handling
  let evCount = 1;
  const evSelect = document.getElementById('haveEV');
  const evDetails = document.getElementById('evDetails');
  const addEvButton = document.getElementById('addEvButton');

  if (evSelect) {
    evSelect.addEventListener('change', function () {
      evDetails.innerHTML = ''; // Clear previous EV details
      evDetails.classList.toggle('hidden', this.value === "None");
      addEvButton.classList.toggle('hidden', this.value !== "More than One");

      if (this.value !== "None") {
        addEv(evDetails, 1);
      }
    });
  }

  function addEv(container, count) {
    const evDiv = document.createElement('div');
    evDiv.className = 'bg-white p-4 rounded-lg shadow space-y-4';
    evDiv.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-800">EV ${count}</h3>
      <label class="block text-gray-700 font-medium">EV Type</label>
      <select class="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none">
        <option>Full Battery EV (BEV)</option>
        <option>Plug-in Hybrid EV (PHEV)</option>
        <option>Hybrid EV (HEV)</option>
      </select>
      <label class="block text-gray-700 font-medium">Battery Size (kWh)</label>
      <input type="number" value="75" class="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none">
      <label class="block text-gray-700 font-medium">Annual Driving Distance (km)</label>
      <input type="number" value="15000" class="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none">
    `;
    container.appendChild(evDiv);
  }

  if (addEvButton) {
    addEvButton.addEventListener('click', function () {
      evCount++;
      addEv(evDetails, evCount);
    });
  }
