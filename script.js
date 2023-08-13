const weekSelect = document.getElementById("weekSelect");
const startTrackingBtn = document.getElementById("startTracking");
const tableContainer = document.getElementById("tableContainer");
let allWeek;
let shareXmlData;

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to get the weeks of the current month
function getWeeksOfMonth() {
  const weeks = [];
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  let currentDay = firstDayOfMonth;
  while (currentDay.getMonth() === currentDate.getMonth()) {
    const startOfWeek = new Date(currentDay);
    const endOfWeek = new Date(currentDay);
    endOfWeek.setDate(currentDay.getDate() + 6);

    weeks.push({
      startDate: formatDate(startOfWeek),
      endDate: formatDate(endOfWeek),
    });

    currentDay.setDate(currentDay.getDate() + 7);
  }

  return weeks;
}

// Function to populate the dropdown with week options
function populateWeeks() {
  const weeks = getWeeksOfMonth();
  const weekSelect = document.getElementById("weekSelect");
  allWeek = weeks;
  weeks.forEach((week, index) => {
    const option = document.createElement("option");
    (option.value = index),
      (option.textContent = `Week ${index + 1}: ${week.startDate} - ${
        week.endDate
      }`);
    weekSelect.appendChild(option);
  });
}

// Function to display loading state
function displayLoading() {
  tableContainer.innerHTML = "Loading...";
}

// Function to fetch weather data and display the table
async function fetchWeatherData(start_date, end_date) {
  displayLoading();
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&timezone=America/New_York&daily=temperature_2m_max,temperature_2m_min&start_date=${start_date}&end_date=${end_date}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("API Error");
    }
    const data = await response.json();
    displayWeatherTable(data);
  } catch (error) {
    displayErrorMessage();
  }
}

// Function to display the temperature data in a table
function displayWeatherTable(data) {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Create table header
  const headerRow = document.createElement("tr");
  const headerCells = [
    "Day",
    "Date",
    "Min Temperature (°C)",
    "Max Temperature (°C)",
  ];
  headerCells.forEach((cellText) => {
    const cell = document.createElement("th");
    cell.textContent = cellText;
    styleTableCell(cell);
    headerRow.appendChild(cell);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table rows and cells to display temperature data
  data.daily.time.forEach((date, index) => {
    const row = document.createElement("tr");

    // Find the day name corresponding to the date
    const dayName = getDayName(new Date(date));

    // Create cells for each column
    const dayCell = document.createElement("td");
    dayCell.textContent = dayName;
    styleTableCell(dayCell);
    row.appendChild(dayCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(date).toLocaleDateString();
    styleTableCell(dateCell);
    row.appendChild(dateCell);

    const minTempCell = document.createElement("td");
    minTempCell.textContent = data.daily.temperature_2m_min[index].toFixed(1);
    styleTableCell(minTempCell);
    row.appendChild(minTempCell);

    const maxTempCell = document.createElement("td");
    maxTempCell.textContent = data.daily.temperature_2m_max[index].toFixed(1);
    styleTableCell(maxTempCell);
    row.appendChild(maxTempCell);

    // Append the row to the table body
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Clear the table container and append the new table
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

// Function to get the day name
function getDayName(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

// Function to style a table cell
function styleTableCell(cell) {
  cell.style.border = "1px solid black";
  cell.style.padding = "8px";
  cell.style.textAlign = "center";
}

// Function to display error message
function displayErrorMessage() {
  tableContainer.innerHTML = "An error occurred.";
}

// Event listener for Start Tracking button
startTrackingBtn.addEventListener("click", () => {
  console.log("find obj", allWeek[weekSelect.value]);
  const { startDate, endDate } = allWeek[weekSelect.value];
  fetchWeatherData(startDate, endDate);
});

// Populate dropdown options on page load
populateWeeks();

function generateXML(data) {
  const xmlString =
    '<?xml version="1.0" encoding="UTF-8"?>\n<temperatures>' +
    data
      .map((row) => {
        return `<temperature>
                <day>${row[0]}</day>
                <date>
                  <dateValue>${row[1]}</dateValue>
                  <dateFormat>YYYY-MM-DD</dateFormat>
                </date>
                <min>${row[2]}</min>
                <max>${row[3]}</max>
              </temperature>`;
      })
      .join("") +
    "</temperatures>";

  return xmlString;
}
/*
// Event listener for Generate XML button
generateXmlBtn.addEventListener("click", () => {
  const tableRows = document.querySelectorAll("#tableContainer tbody tr");
  const xmlData = Array.from(tableRows).map((row) => {
    const cells = row.querySelectorAll("td");
    return Array.from(cells).map((cell) => cell.textContent);
  });

  const xml = generateXML(xmlData);
  
  // Create a Blob with XML content
  const blob = new Blob([xml], { type: "text/xml" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const a = document.createElement("a");
  a.href = url;
  a.download = "temperature_data.xml";

  // Click the link to initiate download
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
  fs.writeFileSync("temperature_data.xml", xml);
  alert("XML file saved in the root directory.");
});
*/

generateXmlBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default behavior
  const tableRows = document.querySelectorAll("#tableContainer tbody tr");
  const xmlData = Array.from(tableRows).map((row) => {
    const cells = row.querySelectorAll("td");
    return Array.from(cells).map((cell) => cell.textContent);
  });

  const xml = generateXML(xmlData);
  shareXmlData = xml;
  // Create a Blob with the XML content
  const blob = new Blob([xml], { type: "text/xml" });

  // Create a download link
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "temperature_data.xml";
  downloadLink.textContent = "Download XML";

  // Append the download link to the page
  document.body.appendChild(downloadLink);
});

console.log("XML Data 1", shareXmlData);
