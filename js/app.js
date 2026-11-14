// =========================================================
// NovaCart - Interactive Application Logic
// Handles Filtering, Sorting, Cart State, Promo Codes & Checkout
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    // Application State
    let cart = JSON.parse(localStorage.getItem("novacart_items")) || [];
    let selectedCategory = "All";
    let searchQuery = "";
    let sortBy = "featured";
    let discountPercent = 0;

    // DOM Elements
    const productGrid = document.getElementById("product-grid");
    const noResults = document.getElementById("no-results");
    const searchInput = document.getElementById("search-input");
    const categoryFilters = document.getElementById("category-filters");
    const sortSelect = document.getElementById("sort-select");
    const resetFiltersBtn = document.getElementById("reset-filters-btn");

    // Cart Drawer DOM Elements
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartBadge = document.getElementById("cart-badge");
    const cartItemsContainer = document.getElementById("cart-items-container");

    // Summary & Promo DOM Elements
    const promoInput = document.getElementById("promo-input");
    const applyPromoBtn = document.getElementById("apply-promo-btn");
    const promoMessage = document.getElementById("promo-message");
    const cartSubtotalEl = document.getElementById("cart-subtotal");
    const cartDiscountEl = document.getElementById("cart-discount");
    const cartShippingEl = document.getElementById("cart-shipping");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Checkout Modal DOM Elements
    const checkoutModal = document.getElementById("checkout-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const checkoutForm = document.getElementById("checkout-form");
    const modalPayable = document.getElementById("modal-payable");
    const toastContainer = document.getElementById("toast-container");

    // Format Currency in Indian Rupees (₹)
    function formatCurrency(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }

    // Save Cart to LocalStorage
    function saveCart() {
        localStorage.setItem("novacart_items", JSON.stringify(cart));
    }

    // Show Toast Notification
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2600);
    }

    // Render Product Catalog
    function renderProducts() {
        let filtered = PRODUCTS.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });

        // Sort filtered items
        if (sortBy === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        productGrid.innerHTML = "";

        if (filtered.length === 0) {
            noResults.classList.remove("hidden");
            return;
        }

        noResults.classList.add("hidden");

        filtered.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-img-wrap">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <span class="category-tag">${product.category}</span>
                </div>
                <div class="product-body">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">${formatCurrency(product.price)}</span>
                        <span class="product-rating"><i class="fa-solid fa-star"></i> ${product.rating}</span>
                    </div>
                    <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${product.id}">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // Add Product to Cart
    function addToCart(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        updateCartUI();
        showToast(`Added "${product.name}" to cart`);
    }

    // Update Item Quantity
    function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }

        saveCart();
        updateCartUI();
    }

    // Remove Item from Cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    // Calculate Totals & Update Cart Drawer UI
    function updateCartUI() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalCount;

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                    <p>Your shopping cart is currently empty.</p>
                </div>
            `;
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach(item => {
                const itemEl = document.createElement("div");
                itemEl.className = "cart-item";
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">${formatCurrency(item.price)} each</p>
                        <div class="qty-controls">
                            <button class="qty-btn dec-btn" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn inc-btn" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Price Calculations
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = Math.round((subtotal * discountPercent) / 100);
        const shipping = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
        const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

        cartSubtotalEl.textContent = formatCurrency(subtotal);
        cartDiscountEl.textContent = `-${formatCurrency(discountAmount)}`;
        cartShippingEl.textContent = shipping === 0 ? "Free" : formatCurrency(shipping);
        cartTotalEl.textContent = formatCurrency(finalTotal);
        modalPayable.textContent = formatCurrency(finalTotal);
    }

    // Drawer Toggle Helpers
    function openCart() {
        cartDrawer.classList.add("open");
        cartDrawer.setAttribute("aria-hidden", "false");
        cartOverlay.classList.remove("hidden");
    }

    function closeCart() {
        cartDrawer.classList.remove("open");
        cartDrawer.setAttribute("aria-hidden", "true");
        cartOverlay.classList.add("hidden");
    }

    // Event Listeners: Filters & Search
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });

    categoryFilters.addEventListener("click", (e) => {
        if (e.target.classList.contains("pill")) {
            document.querySelectorAll(".pill").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            selectedCategory = e.target.dataset.category;
            renderProducts();
        }
    });

    sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderProducts();
    });

    resetFiltersBtn.addEventListener("click", () => {
        searchQuery = "";
        selectedCategory = "All";
        sortBy = "featured";
        searchInput.value = "";
        sortSelect.value = "featured";
        document.querySelectorAll(".pill").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.category === "All");
        });
        renderProducts();
    });

    // Event Delegation: Add to Cart
    productGrid.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-to-cart-btn");
        if (btn) {
            addToCart(Number(btn.dataset.id));
        }
    });

    // Event Delegation: Cart Quantity & Remove
    cartItemsContainer.addEventListener("click", (e) => {
        const decBtn = e.target.closest(".dec-btn");
        const incBtn = e.target.closest(".inc-btn");
        const remBtn = e.target.closest(".remove-item-btn");

        if (decBtn) updateQuantity(Number(decBtn.dataset.id), -1);
        if (incBtn) updateQuantity(Number(incBtn.dataset.id), 1);
        if (remBtn) removeFromCart(Number(remBtn.dataset.id));
    });

    // Promo Code Handler
    applyPromoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === "NOVA10") {
            discountPercent = 10;
            promoMessage.textContent = "Promo code NOVA10 applied (10% off)!";
            promoMessage.style.color = "#16a34a";
            updateCartUI();
        } else if (code === "") {
            discountPercent = 0;
            promoMessage.textContent = "";
            updateCartUI();
        } else {
            discountPercent = 0;
            promoMessage.textContent = "Invalid code. Try NOVA10 for 10% off.";
            promoMessage.style.color = "#dc2626";
            updateCartUI();
        }
    });

    // Cart Drawer Open/Close Events
    cartToggleBtn.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Checkout Modal Events
    checkoutBtn.addEventListener("click", () => {
        closeCart();
        checkoutModal.classList.remove("hidden");
    });

    closeModalBtn.addEventListener("click", () => {
        checkoutModal.classList.add("hidden");
    });

    // Checkout Form Validation & Submission
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("cust-name");
        const emailInput = document.getElementById("cust-email");
        const addressInput = document.getElementById("cust-address");

        const errName = document.getElementById("err-name");
        const errEmail = document.getElementById("err-email");
        const errAddress = document.getElementById("err-address");

        let isValid = true;
        errName.textContent = "";
        errEmail.textContent = "";
        errAddress.textContent = "";

        if (nameInput.value.trim().length < 2) {
            errName.textContent = "Please enter your full name.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            errEmail.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (addressInput.value.trim().length < 10) {
            errAddress.textContent = "Please enter a complete shipping address.";
            isValid = false;
        }

        if (!isValid) return;

        // Order Confirmed
        checkoutModal.classList.add("hidden");
        checkoutForm.reset();
        cart = [];
        discountPercent = 0;
        promoInput.value = "";
        promoMessage.textContent = "";
        saveCart();
        updateCartUI();
        showToast("Order placed successfully! Thank you for shopping with NovaCart.");
    });

    // Initial Render
    renderProducts();
    updateCartUI();
});
