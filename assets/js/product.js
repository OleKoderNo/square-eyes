import { fetchOne } from "./api.js";
import { $, getParams } from "./utils.js";
import { addToCart, cartCount } from "./cart.js";

function updateCartBadge() {
	const el = document.querySelector("#cart-count");
	if (!el) return;

	const count = cartCount();
	if (count > 0) {
		el.textContent = String(count);
		el.classList.add("badge-count--active");
	} else {
		el.textContent = "";
		el.classList.remove("badge-count--active");
	}
}

// creates a toast when product is added to cart
function showToast(message) {
	let toast = document.querySelector("#toast");
	if (!toast) {
		toast = document.createElement("div");
		toast.id = "toast";
		toast.className = "toast";
		toast.setAttribute("role", "status");
		toast.setAttribute("aria-live", "polite");
		document.body.appendChild(toast);
	}

	toast.textContent = message;
	toast.classList.add("toast--visible");

	// sets duration of toast before hiding it
	if (toast._hideTimeout) {
		clearTimeout(toast._hideTimeout);
	}
	toast._hideTimeout = setTimeout(function () {
		toast.classList.remove("toast--visible");
	}, 2000);
}

function view(item) {
	let priceHtml;
	if (item.onSale) {
		priceHtml = '<span class="price">' + Number(item.discountedPrice).toFixed(2) + '</span><span class="strike">' + Number(item.price).toFixed(2) + "</span>";
	} else {
		priceHtml = '<span class="price">' + Number(item.price).toFixed(2) + "</span>";
	}

	const tags = (item.tags || [])
		.map(function (t) {
			return '<span class="badge">' + t + "</span>";
		})
		.join("");

	const img = item.image && item.image.url ? item.image.url : "";
	const alt = item.image && item.image.alt ? item.image.alt : item.title || "";
	const title = item.title || "Untitled";
	const genre = item.genre || "–";
	const released = item.released || "–";
	const rating = item.rating || "–";
	const description = item.description || "";

	return (
		'<section class="detail">' +
		'<img class="poster" src="' +
		img +
		'" alt="' +
		alt +
		'" />' +
		'<div class="meta">' +
		"<h1>" +
		title +
		"</h1>" +
		'<div class="badges">' +
		'<span class="badge">' +
		genre +
		"</span>" +
		'<span class="badge">Released: ' +
		released +
		"</span>" +
		'<span class="badge">Rating: ★ ' +
		rating +
		"</span>" +
		tags +
		"</div>" +
		'<p class="muted">' +
		description +
		"</p>" +
		"<div>" +
		priceHtml +
		"</div>" +
		'<button id="add-to-cart" class="btn">Add to basket</button>' +
		'<a id="buy-now" class="btn" href="#">Buy now</a>' +
		"</div>" +
		"</section>"
	);
}

// loads the movie and hooks up the buttons
async function renderProduct() {
	const app = $("#app");
	const params = getParams();
	const id = params.get("id");

	if (!app) {
		throw new Error("Missing #app");
	}

	if (!id) {
		app.innerHTML = '<div class="status error">Missing product id.</div>';
		return;
	}

	try {
		app.innerHTML = '<div class="status">Loading product…</div>';
		const item = await fetchOne(id);
		if (!item) {
			throw new Error("Product not found");
		}
		app.innerHTML = view(item);

		const addBtn = $("#add-to-cart");
		const buyBtn = $("#buy-now");

		if (addBtn) {
			addBtn.addEventListener("click", function () {
				addToCart(item, 1);
				updateCartBadge();
				showToast("Added to basket");
			});
		}

		if (buyBtn) {
			buyBtn.addEventListener("click", function (e) {
				e.preventDefault();
				addToCart(item, 1);
				updateCartBadge();
				showToast("Added to basket");
				setTimeout(function () {
					location.href = "../checkout/";
				}, 300);
			});
		}
	} catch (error) {
		app.innerHTML = '<div class="status error">' + (error.message || "Something went wrong") + "</div>";
	}
}

window.addEventListener("DOMContentLoaded", renderProduct);
