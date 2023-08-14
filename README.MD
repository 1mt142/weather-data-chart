# Temperature Tracking Project

This project aims to provide a user-friendly interface for tracking temperature data based on user input. The project utilizes HTML, CSS, and JavaScript to create an interactive form that fetches and displays temperature data for a selected week from an API. Additionally, the project features a responsive design and external styling to enhance the user experience.

## Features

- **Form Interface**: The project includes an intuitive form interface with a dropdown menu to select a week.
- **Interactive Buttons**: The "Start Tracking" button triggers the fetching and display of temperature data for the selected week.
- **Responsive Design**: The form and data display are designed to adapt gracefully to various screen sizes and orientations.
- **Error Handling**: If an API call results in an error, the application provides user-friendly error messages.
- **Styling with External CSS**: The styling is organized in an external stylesheet for better separation of concerns and maintainability.

- **Download XML**: Users can generate and download temperature data in XML format.
- **Chart Display**:The temperature data is visually represented in a bar chart using HTML and CSS from the XML Data.

## Usage

1. Open the `index.html` file in a web browser.
2. The page will load with a form containing a dropdown menu and a "Start Tracking" button.
3. Select a week from the dropdown menu.
4. Click the "Start Tracking" button to fetch and display temperature data in a table for the selected week.
5. "Generate XML" button will appear to download the data in XML format.
6. "Show Chart" By clicking the "Show Chart" button, the temperature data will be visualized using a Bar Chart, effectively presenting both the maximum and minimum temperatures for a comprehensive overview.

## File Structure

- `index.html`: The main HTML file that contains the form and interface elements.
- `styles.css`: External stylesheet for styling the interface elements.
- `script.js`: External JavaScript file containing the logic to fetch and display temperature data.
