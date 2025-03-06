# univeristy-project-eu-data-visualization-app
# Overview
This project is an interactive web application that visualizes economic and demographic data for European Union countries between 2000 and 2018. It focuses on three key indicators: GDP per capita , Life Expectancy , Population.
The data is automatically fetched from the Eurostat API, processed, and stored locally for visualization.

# Features
- Automated Data Retrieval & Processing – The application fetches and structures the latest 15 years of data from Eurostat.
- Graphical Representation (SVG-based) – Users can select a country and an indicator to view its evolution using a bar chart.
- Interactive Tooltip – Displays year and indicator values when hovering over the chart.
- Bubble Chart (Canvas-based) – Allows users to compare countries for a selected year with proportional bubbles.
- Bubble Chart Animation – Plays an animated sequence showing the evolution of the bubble chart over time.
- Tabular Data View – Displays country data for a selected year with color-coded cells (red to green) based on deviation from the EU average.

# Technologies Used
- Frontend: HTML, CSS, JavaScript (SVG & Canvas for graphics)
- Data Handling: Eurostat API (JSON format)
# Usage
1. Run the application to automatically fetch and process data.
2. Select a country and an indicator to view its historical trend.
3. Hover over the chart to see detailed values.
4. View the bubble chart for a specific year or play an animation.
5. Analyze country data in a table with color-coded values.
