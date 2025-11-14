import { cartCount } from "./cart.js";

function setupNavDropdown() {
	const groups = document.querySelectorAll("[data-dropdown]");

	groups.forEach(function (group) {
		const btn = group.querySelector(".nav-toggle");
		if (!btn) return;

		btn.addEventListener("click", function () {
			const open = group.getAttribute("data-open") === "true";
			group.setAttribute("data-open", String(!open));
			btn.setAttribute("aria-expanded", String(!open));
		});
	});

	document.addEventListener("click", function (e) {
		groups.forEach(function (group) {
			if (!group.contains(e.target)) {
				group.setAttribute("data-open", "false");
				const btn = group.querySelector(".nav-toggle");
				if (btn) {
					btn.setAttribute("aria-expanded", "false");
				}
			}
		});
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			groups.forEach(function (group) {
				group.setAttribute("data-open", "false");
				const btn = group.querySelector(".nav-toggle");
				if (btn) {
					btn.setAttribute("aria-expanded", "false");
				}
			});
		}
	});
}

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

window.addEventListener("DOMContentLoaded", function () {
	setupNavDropdown();
	updateCartBadge();
});
