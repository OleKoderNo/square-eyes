import { $ } from "./utils.js";

window.addEventListener("DOMContentLoaded", function () {
	const app = $("#app");
	if (!app) return;

	const orderNo = sessionStorage.getItem("se_order_no");

	if (orderNo) {
		app.innerHTML =
			'<div class="status">' + "<h1>Thank you!</h1>" + "<p>Your order <strong>" + orderNo + "</strong> has been placed.</p>" + '<p><a class="btn" href="../../">Back to Home</a></p>' + "</div>";
	} else {
		app.innerHTML = '<div class="status">No recent order found. <a class="btn" href="../../">Back to Home</a></div>';
	}
});
