// Initialize the cart from localStorage or create an empty array if no cart exists
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart count correctly, set it to 0 if the cart is empty
let cartCount = cart.length > 0 ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

// Function to update cart count display on the top-right of the page
function updateCartCount() {
    document.getElementById('cart-count').textContent = cartCount;
}

// Call the function when the page loads to display the correct count from localStorage
window.onload = updateCartCount;

// Add to cart function for index.html
function addToCart(item, price,image) {
    // Check if the item is already in the cart
    let found = cart.find(cartItem => cartItem.item === item);
    if (found) {
        found.quantity += 1; // Increase quantity if item exists
    } else {
        cart.push({ item, price, quantity: 1, image}); // Add new item to cart if not found
    }

    cartCount++; // Increment cart count when item is added
    
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the cart count on screen
    updateCartCount();
}

function goToCheckout() {
    // Redirect to checkout page
    window.location.href = "checkout.html";
}

// Load cart data and display items in the checkout page
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = ''; // Clear any existing items

    let grandTotal = 0;

    cart.forEach((item, index) => {
        const totalPrice = (item.price * item.quantity).toFixed(2);
        grandTotal += parseFloat(totalPrice);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.item}" style="width: 50px; height: 50px;"></td>
            <td>${item.item}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
            </td>
            <td>$<span id="total-${index}">${totalPrice}</span></td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartItemsDiv.appendChild(row);
    });

    // Update grand total
    document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
}

// Function to update the quantity of an item in the cart
function updateQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart'));

    // Update the quantity for the item
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the total price for this item
    const updatedTotalPrice = (cart[index].price * cart[index].quantity).toFixed(2);
    document.getElementById(`total-${index}`).textContent = updatedTotalPrice;

    // Update the cart count at the top
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();

    // Update the grand total
    updateGrandTotal();
}

// Function to calculate and update the grand total
function updateGrandTotal() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    let grandTotal = 0;

    cart.forEach(item => {
        grandTotal += item.price * item.quantity;
    });

    document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
}

// Function to remove an item from the cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));

    // Remove the item from the cart
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart to reflect changes
    loadCart();

    // Update the cart count after removing an item
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();
}

// Function to clear the entire cart
function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
    cartCount = 0; // Reset cart count
    updateCartCount(); // Update count on the top right
}

// If on checkout.html, call loadCart to display items
if (document.getElementById('cart-items')) {
    window.onload = loadCart;
}
