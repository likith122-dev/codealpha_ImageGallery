
"use strict";

/* ==============================
   FRAME — IMAGE GALLERY
   Complete JavaScript
================================ */

const photos = [
  {
    title: "Into the Wild",
    category: "nature",
    location: "Dolomites, Italy",
    description: "A quiet escape into the beauty of the mountains.",
    image: "photo-1470770841072-f978cf4d019e"
  },
  {
    title: "Golden Horizons",
    category: "nature",
    location: "Mountain Wilderness",
    description: "Warm light falls across a peaceful mountain landscape.",
    image: "photo-1464822759023-fed622ff2c3b"
  },
  {
    title: "Ocean Dreams",
    category: "nature",
    location: "Coastal Escape",
    description: "The endless rhythm of the sea meets the shore.",
    image: "photo-1500375592092-40eb2168fd21"
  },
  {
    title: "Urban Geometry",
    category: "architecture",
    location: "Modern City",
    description: "Clean lines and bold shapes redefine the city skyline.",
    image: "photo-1487958449943-2429e8be8625"
  },
  {
    title: "Concrete Stories",
    category: "architecture",
    location: "Contemporary Design",
    description: "A study of structure, symmetry, and modern design.",
    image: "photo-1511818966892-d7d671e672a2"
  },
  {
    title: "City in Motion",
    category: "architecture",
    location: "City Streets",
    description: "Every street corner has its own visual language.",
    image: "photo-1519501025264-65ba15a82390"
  },
  {
    title: "Quiet Moments",
    category: "people",
    location: "Everyday Life",
    description: "Finding beauty in the simplest human moments.",
    image: "photo-1500530855697-b586d89ba3ee"
  },
  {
    title: "Golden Hour",
    category: "people",
    location: "Afternoon Light",
    description: "A beautiful moment captured in natural light.",
    image: "photo-1470252649378-9c29740c9fa8"
  },
  {
    title: "Wander Often",
    category: "travel",
    location: "European Countryside",
    description: "A scenic journey through an unforgettable landscape.",
    image: "photo-1469474968028-56623f02e42e"
  },
  {
    title: "Hidden Paradise",
    category: "travel",
    location: "Tropical Escape",
    description: "Discover a place where nature takes center stage.",
    image: "photo-1518837695005-2083093ee35b"
  },
  {
    title: "Mountain Calling",
    category: "travel",
    location: "The Great Outdoors",
    description: "A reminder that the best journeys begin outside.",
    image: "photo-1500534623283-312aade485b7"
  },
  {
    title: "Beyond the Clouds",
    category: "nature",
    location: "Alpine Landscape",
    description: "A breathtaking view into the open wilderness.",
    image: "photo-1433086966358-54859d0ed716"
  }
];

/* IMAGE URL */

function imageURL(id, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

/* DOM ELEMENTS */

const grid = document.getElementById("galleryGrid");
const count = document.getElementById("visibleCount");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const resetBtn = document.getElementById("resetBtn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxCounter = document.getElementById("lightboxCounter");
const downloadLink = document.getElementById("downloadLink");

const closeBtn = document.getElementById("closeLightbox");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

/* APPLICATION STATE */

let activeCategory = "all";
let searchTerm = "";
let visiblePhotos = [...photos];
let currentIndex = 0;
let lastFocusedElement = null;

/* CREATE GALLERY CARD */

function createCard(photo, index) {
  const card = document.createElement("article");

  card.className = "gallery-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${photo.title}`);

  const imageContainer = document.createElement("div");
  imageContainer.className = "card-image";

  const image = document.createElement("img");
  image.src = imageURL(photo.image, 700);
  image.alt = photo.title;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener(
    "error",
    () => {
      imageContainer.style.background =
        "linear-gradient(135deg, #25252d, #454550)";
      image.style.display = "none";
    },
    { once: true }
  );

  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = photo.category.toUpperCase();

  const open = document.createElement("span");
  open.className = "card-open";
  open.setAttribute("aria-hidden", "true");
  open.textContent = "↗";

  imageContainer.append(image, category, open);

  const info = document.createElement("div");
  info.className = "card-info";

  const details = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = photo.title;

  const location = document.createElement("p");
  location.textContent = photo.location;

  details.append(title, location);

  const number = document.createElement("span");
  number.className = "card-index";
  number.textContent = String(index + 1).padStart(2, "0");

  info.append(details, number);
  card.append(imageContainer, info);

  card.addEventListener("click", () => {
    openLightbox(photo);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(photo);
    }
  });

  return card;
}

/* RENDER GALLERY */

function renderGallery() {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo, index) => {
    fragment.appendChild(createCard(photo, index));
  });

  grid.replaceChildren(fragment);
  applyFilters();
}

/* FILTER GALLERY — UPDATED VERSION */

function applyFilters() {
  // Remember the image currently open in the lightbox.
  const currentPhotoId = lightbox.hidden
    ? null
    : getCurrentPhotoId();

  const cards = grid.querySelectorAll(".gallery-card");
  visiblePhotos = [];

  photos.forEach((photo, index) => {
    const matchesCategory =
      activeCategory === "all" ||
      photo.category === activeCategory;

    const searchableText =
      `${photo.title} ${photo.location} ${photo.category} ` +
      `${photo.description}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;

    cards[index].hidden = !isVisible;

    if (isVisible) {
      visiblePhotos.push(photo);
    }
  });

  // Update the number of visible photographs.
  count.textContent = String(visiblePhotos.length).padStart(2, "0");

  // Show the empty state if nothing matches.
  emptyState.hidden = visiblePhotos.length !== 0;

  // Keep the lightbox synchronized with the filtered gallery.
  if (!lightbox.hidden) {
    const newIndex = visiblePhotos.findIndex(
      (photo) => photo.image === currentPhotoId
    );

    if (newIndex === -1) {
      closeLightbox();
    } else {
      currentIndex = newIndex;
      updateLightbox();
    }
  }
}

/* CATEGORY FILTER BUTTONS */

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter-btn").forEach((item) => {
      const selected = item === button;

      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    applyFilters();
  });
});

/* LIVE SEARCH */

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  applyFilters();
});

/* RESET FILTERS AND SEARCH */

function resetGallery() {
  activeCategory = "all";
  searchTerm = "";
  searchInput.value = "";

  document.querySelectorAll(".filter-btn").forEach((button) => {
    const selected = button.dataset.category === "all";

    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  applyFilters();
}

resetBtn.addEventListener("click", resetGallery);

/* GET CURRENT PHOTO ID */

function getCurrentPhotoId() {
  return lightboxImage.dataset.photoId || "";
}

/* OPEN LIGHTBOX */

function openLightbox(photo) {
  const index = visiblePhotos.findIndex(
    (item) => item.image === photo.image
  );

  if (index === -1) return;

  currentIndex = index;
  lastFocusedElement = document.activeElement;

  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  updateLightbox();
  closeBtn.focus();
}

/* UPDATE LIGHTBOX CONTENT */

function updateLightbox() {
  if (visiblePhotos.length === 0) return;

  const photo = visiblePhotos[currentIndex];

  if (!photo) return;

  lightboxImage.dataset.photoId = photo.image;
  lightboxImage.src = imageURL(photo.image, 1800);
  lightboxImage.alt = photo.title;

  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = photo.category.toUpperCase();

  lightboxDescription.textContent =
    `${photo.location} — ${photo.description}`;

  lightboxCounter.textContent =
    `${String(currentIndex + 1).padStart(2, "0")} / ` +
    `${String(visiblePhotos.length).padStart(2, "0")}`;

  downloadLink.href = imageURL(photo.image, 2400);

  const canNavigate = visiblePhotos.length > 1;

  previousBtn.disabled = !canNavigate;
  nextBtn.disabled = !canNavigate;
}

/* PREVIOUS AND NEXT NAVIGATION */

function navigate(direction) {
  if (visiblePhotos.length < 2) return;

  currentIndex =
    (currentIndex + direction + visiblePhotos.length) %
    visiblePhotos.length;

  updateLightbox();
}

previousBtn.addEventListener("click", () => navigate(-1));
nextBtn.addEventListener("click", () => navigate(1));

/* CLOSE LIGHTBOX */

function closeLightbox() {
  if (lightbox.hidden) return;

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");

  document.body.classList.remove("no-scroll");

  lightboxImage.removeAttribute("src");
  lightboxImage.dataset.photoId = "";

  if (lastFocusedElement && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
  }

  lastFocusedElement = null;
}

closeBtn.addEventListener("click", closeLightbox);

/* CLOSE WHEN CLICKING OUTSIDE THE VIEWER */

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* KEYBOARD SHORTCUTS */

document.addEventListener("keydown", (event) => {
  if (!lightbox.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }

    return;
  }

  // Press "/" to focus the search field.
  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !["INPUT", "TEXTAREA"].includes(
      document.activeElement.tagName
    )
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

/* INITIALIZE APPLICATION */

renderGallery();
