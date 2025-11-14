// handles the checkout page
import { getCart, setQty, removeFromCart, cartTotal, clearCart } from "./cart.js";

// renders the cart items and total
function renderCart() {
	const container = document.querySelector("#cart");
	const form = document.querySelector("#checkout-form");
	if (!container) return;

	const items = getCart();

	if (!items.length) {
		container.innerHTML = '<div class="status">Your basket is empty.</div>';
		if (form) {
			form.classList.add("hidden");
		}
		return;
	}

	let html = '<div class="cart-grid">';

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		html +=
			'<article class="card cart-item">' +
			'<img class="thumb cart-item-thumb" src="' +
			item.image +
			'" alt="' +
			item.title +
			'" />' +
			'<div class="pad cart-item-body">' +
			'<div class="title">' +
			item.title +
			"</div>" +
			'<div class="muted">NOK ' +
			Number(item.price).toFixed(2) +
			"</div>" +
			'<div class="cart-item-actions">' +
			'<label class="muted">Qty: ' +
			'<input data-id="' +
			item.id +
			'" class="qty qty-input" type="number" min="1" value="' +
			item.qty +
			'" />' +
			"</label>" +
			'<button class="btn btn-remove" data-id="' +
			item.id +
			'">Remove</button>' +
			"</div>" +
			"</div>" +
			'<div class="price">€ ' +
			(item.qty * item.price).toFixed(2) +
			"</div>" +
			"</article>";
	}

	html += "</div>";

	html += '<div class="cart-total-row">' + '<div class="title">Total</div>' + '<div class="price">NOK ' + cartTotal().toFixed(2) + "</div>" + "</div>";

	container.innerHTML = html;

	const qtyInputs = container.querySelectorAll(".qty");
	for (let i = 0; i < qtyInputs.length; i++) {
		qtyInputs[i].addEventListener("change", function (e) {
			const id = e.target.getAttribute("data-id");
			const value = e.target.value;
			setQty(id, value);
			renderCart();
		});
	}

	const removeButtons = container.querySelectorAll(".btn-remove");
	for (let i = 0; i < removeButtons.length; i++) {
		removeButtons[i].addEventListener("click", function (e) {
			const id = e.target.getAttribute("data-id");
			removeFromCart(id);
			renderCart();
		});
	}
}

function setupForm() {
	const form = document.querySelector("#checkout-form");
	if (!form) return;

	form.addEventListener("submit", function (e) {
		e.preventDefault();

		const nameInput = document.querySelector("#name");
		const emailInput = document.querySelector("#email");

		if (!nameInput.value || !emailInput.value) {
			alert("Please fill in your details.");
			return;
		}

		const orderNo = "SE-" + Date.now().toString().slice(-8);
		sessionStorage.setItem("se_order_no", orderNo);
		clearCart();

		location.href = "./confirmation/";
	});
}

window.addEventListener("DOMContentLoaded", function () {
	const cartContainer = document.querySelector("#cart");
	if (cartContainer) {
		cartContainer.innerHTML = '<div class="status">Loading cart…</div>';
	}
	renderCart();
	setupForm();
});
