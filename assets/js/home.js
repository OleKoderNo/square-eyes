import { fetchAll } from "./api.js";

function card(item) {
	const title = item.title || "Untitled";
	const genre = item.genre || "–";
	const img = item.image && item.image.url ? item.image.url : "";
	const alt = item.image && item.image.alt ? item.image.alt : item.title || "";
	return `
    <a class="card-link" href="product/?id=${encodeURIComponent(item.id)}">
      <article class="card" aria-label="${title}">
        <img class="thumb" src="${img}" alt="${alt}" loading="lazy" />
        <div class="pad">
          <div class="title">${title}</div>
          <div class="muted">${genre}</div>
        </div>
      </article>
    </a>
  `;
}

function pickFeatured(all, count) {
	if (!Array.isArray(all)) {
		return [];
	}

	const copy = all.slice();

	copy.sort(function (a, b) {
		const ra = Number(a.rating || 0);
		const rb = Number(b.rating || 0);
		return rb - ra;
	});

	return copy.slice(0, count);
}

async function renderHome() {
	const featuredContainer = document.querySelector("#featured-content");
	const listContainer = document.querySelector("#home-list-content");

	if (featuredContainer) {
		featuredContainer.innerHTML = '<div class="status">Loading featured…</div>';
	}
	if (listContainer) {
		listContainer.innerHTML = '<div class="status">Loading products…</div>';
	}

	try {
		const all = await fetchAll();

		if (featuredContainer) {
			const picks = pickFeatured(all, 4);

			if (picks.length === 0) {
				featuredContainer.innerHTML = '<div class="status">No featured items.</div>';
			} else {
				let html = '<div class="grid">';
				for (let i = 0; i < picks.length; i++) {
					html += card(picks[i]);
				}
				html += "</div>";
				featuredContainer.innerHTML = html;
			}
		}

		if (listContainer) {
			if (!all || all.length === 0) {
				listContainer.innerHTML = '<div class="status">No products available.</div>';
			} else {
				let html = '<div class="grid">';
				for (let i = 0; i < all.length; i++) {
					html += card(all[i]);
				}
				html += "</div>";
				listContainer.innerHTML = html;
			}
		}
	} catch (error) {
		const msg = '<div class="status error">' + (error.message || "Failed to load") + " — please try again.</div>";
		if (featuredContainer) {
			featuredContainer.innerHTML = msg;
		}
		if (listContainer) {
			listContainer.innerHTML = msg;
		}
	}
}

window.addEventListener("DOMContentLoaded", renderHome);
