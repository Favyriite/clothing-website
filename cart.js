document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const product = button.getAttribute("data-product");
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            cartCount.innerText = cart.length;
            alert(`${product} added to cart!`);
        });
    });

    cartCount.innerText = cart.length;
});
