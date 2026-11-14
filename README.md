# NovaCart — E-Commerce Product Catalog & Shopping Cart

NovaCart is a responsive, interactive front-end e-commerce storefront built with semantic HTML5, modern CSS (Grid, Flexbox, Media Queries), and vanilla ES6+ JavaScript. It enables shoppers to browse curated tech and lifestyle products with high-resolution photography, filter and search in real time, manage a persistent shopping cart, apply promotional codes, and complete a validated checkout flow.

---

##  Key Features

- **Dynamic Product Catalog:** Renders product cards dynamically from structured JavaScript objects featuring high-resolution photography, pricing, ratings, descriptions, and category badges.
- **Real-Time Search & Filtering:** Instant keyword search combined with category filter pills (`All`, `Electronics`, `Audio`, `Accessories`, `Workspace`) and multi-criteria sorting (Featured, Price Low-to-High, Price High-to-Low, Highest Rated).
- **Slide-Over Shopping Cart Drawer:** Add items, adjust quantities (`+` / `-`), or remove items with automatic subtotal, shipping, and total calculations.
- **Promotional Discount Engine:** Supports promo code validation (apply `NOVA10` for an instant 10% discount).
- **Client-Side Persistence:** Uses the browser `localStorage` API so cart items remain saved across page reloads.
- **Form-Validated Checkout Modal:** Validates customer name, email format, and delivery address prior to order confirmation.
- **Fully Responsive Layout:** Adapts seamlessly across desktop (4-column grid), tablet (2–3 column grid), and mobile (single-column layout) viewports.

---

##  Technologies Used

- **HTML5:** Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) and ARIA accessibility attributes.
- **CSS3:** CSS Custom Properties, CSS Grid, Flexbox, sticky navigation, smooth drawer transitions, and responsive media queries.
- **JavaScript (ES6+):** Modular data structures, array methods (`.filter()`, `.sort()`, `.reduce()`, `.find()`), event delegation, DOM manipulation, and `localStorage`.
- **Icons & Imagery:** Font Awesome 6 icons and professional product photography from Unsplash.

---

##  Project Structure

```text
novacart-ecommerce/
├── index.html          # Main semantic HTML5 entry point
├── css/
│   └── styles.css      # Responsive styling, layout grid, drawer & modal styles
├── js/
│   ├── products.js     # Structured product catalog dataset with Unsplash photography
│   └── app.js          # Filtering, sorting, cart state, promo logic & checkout validation
└── README.md           # Project overview, setup, and deployment instructions
```

---

##  Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/novacart-ecommerce.git
   ```
2. Navigate into the project directory:
   ```bash
   cd novacart-ecommerce
   ```
3. Open `index.html` directly in any modern web browser (or launch via VS Code Live Server).

---

##  Deployment (GitHub Pages)

This project is static and ready for zero-configuration deployment on **GitHub Pages**:

1. Push the repository to GitHub (`main` branch).
2. Open the repository on GitHub and go to **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then click **Save**.
5. Access the live storefront at `https://your-username.github.io/novacart-ecommerce/`.
