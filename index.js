import items from "./gallery-items.js";

const galleryRef = document.querySelector(".js-gallery");
const modalRef = document.querySelector(".js-lightbox");
const modalImageRef = modalRef.querySelector(".lightbox__image");
const closeModalRef = modalRef.querySelector(
  'button[data-action="close-lightbox"]'
);
const modalOverlayRef = modalRef.querySelector(".lightbox__content");

galleryRef.addEventListener("click", getImagePreview);
closeModalRef.addEventListener("click", closeModal);
modalOverlayRef.addEventListener("click", closeModalOverlay);


function renderGalleryItems(array) {
  const elementsArray = array.map((item, index) => {
    const gallaryItem = document.createElement("li");
    gallaryItem.classList.add("gallery__item");
    const gallaryItemLink = document.createElement("a");
    gallaryItemLink.href = item.original;
    gallaryItemLink.classList.add("gallery__link");
    gallaryItem.append(gallaryItemLink);
    const gallaryImage = document.createElement("img");
    gallaryImage.src = item.preview;
    gallaryImage.alt = item.description;
    gallaryImage.classList.add("gallery__image");
    gallaryImage.setAttribute("data-source", item.original);
    gallaryImage.setAttribute("data-count", index);
    gallaryItemLink.append(gallaryImage);
    return gallaryItem;
  });

  return galleryRef.append(...elementsArray);
}

renderGalleryItems(items);

function getImagePreview(event) {
  event.preventDefault();
  const imageData = getLargeImageData(event.target);

  if (imageData.source) {
    modalImageRef.src = imageData.source;
    modalImageRef.setAttribute("data-activeCount", imageData.count);
    openModal();
  }
}

function getLargeImageData(elem) {
  if (elem.nodeName !== "IMG") {
    return;
  }
  return elem.dataset;
}

function openModal() {
  modalRef.classList.add("is-open");
  window.addEventListener("keydown", closeModalESC);
  window.addEventListener("keydown", imageModalScroll);
}

function closeModal() {
  modalRef.classList.remove("is-open");
  modalImageRef.src = "";
  window.removeEventListener("keydown", closeModalESC);
  window.removeEventListener("keydown", imageModalScroll);
}

function closeModalOverlay(event) {
  if (event.target.nodeName !== "IMG") {
    closeModal();
  }
}

function closeModalESC(event) {
  if (event.code === "Escape") {
    closeModal();
  }
}

function imageModalScroll(event) {
  let activeCount = parseInt(modalImageRef.getAttribute("data-activeCount"));
  function setModalImage (count) {
    const newURL = items[count].original;
    modalImageRef.src = newURL;
    modalImageRef.setAttribute("data-activeCount", count);
  }
  if (event.keyCode === 39) {
    activeCount = activeCount >= items.length-1 ? 0 : activeCount+1;
    setModalImage(activeCount);
  }
  if (event.keyCode === 37) {
    activeCount = activeCount === 0 ? items.length-1 : activeCount-1;
    setModalImage(activeCount);
  }
}
