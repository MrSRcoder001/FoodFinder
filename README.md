# Food Product Explorer

## Overview

Food Product Explorer is a responsive web application built using **ReactJS** that allows users to discover and explore food products using the Open Food Facts API. The application provides an easy-to-use interface where users can browse products, search by product name or barcode, filter by category, sort products based on different criteria, and view detailed nutritional information.

This project demonstrates frontend development skills such as **API integration, component-based architecture, state management, responsive design, and clean UI/UX implementation**.

---

## Features

* Browse a list of food products fetched from the API
* Search products by **name**
* Search products by **barcode**
* Filter products by **category**
* Sort products by:

  * Product Name (A–Z / Z–A)
  * Nutrition Grade (Ascending / Descending)
* Infinite scroll / Load More pagination
* Product detail page with:

  * Product image
  * Ingredients list
  * Nutritional values
  * Product labels (vegan, gluten-free, organic, etc.)
* Fully responsive design for mobile, tablet, and desktop devices
* Loading and error handling states for better user experience

---

## Tech Stack

* **Frontend:** ReactJS
* **Styling:** Tailwind CSS / CSS
* **Routing:** React Router DOM
* **API Handling:** Axios / Fetch API
* **State Management:** React Context API *(optional)*

---

## API Used

This application uses the Open Food Facts public API to fetch food product data.

Endpoints used:

* Product search by name
* Product details by barcode
* Products by category
* Categories listing

Base URL:
`https://world.openfoodfacts.org/`

---

## Implementation Approach

The application is developed using a **component-based architecture** in React to keep the code modular, reusable, and maintainable.

Main workflow:

1. Fetch products from API
2. Display products in card layout
3. Apply search / filter / sort operations
4. Implement pagination for better performance
5. Navigate to product detail page for full product information
6. Ensure responsiveness across devices

---

## Challenges Solved

* Handling inconsistent API data (missing images, ingredients, labels)
* Optimizing search requests using debouncing
* Implementing smooth pagination/infinite scroll
* Managing filters and sorting efficiently
* Designing responsive layouts for different screen sizes

---

## Time Taken

Approximately **8–10 hours** (including design, development, testing, and documentation).

---

## Conclusion

Food Product Explorer is a practical web application that showcases modern frontend development practices by combining **API consumption, UI design, state handling, and responsive development** into a complete product exploration experience.
