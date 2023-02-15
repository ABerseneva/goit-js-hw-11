import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchApiImages from './fetchImges.js';
import LoadMoreBtn from './loadMoreBtn.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');


const searchApiImages = new SearchApiImages();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });

form.addEventListener('submit', searchImg);
loadMoreBtn.button.addEventListener('click', fetchImages);

let totalPages = null;

const lightbox = new SimpleLightbox('.gallery a');

function searchImg(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.search.value.trim();

  if (value.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  searchApiImages.searchQuery = value;

  searchApiImages.resetPage();
  clearImagesCollection();
  loadMoreBtn.show();
  fetchImages();
  resetForm();
}

async function fetchImages() {
  try {
    loadMoreBtn.disable();
    const hits = await searchApiImages.getImages();

    totalPages = Math.ceil(searchApiImages.totalHits / searchApiImages.perPage);

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImagesCollection();
      loadMoreBtn.hide();
      return;
    }

    if (searchApiImages.page === 2) {
      Notify.success(`Hooray! We found ${searchApiImages.totalHits} images.`);
    }

    if (searchApiImages.page > totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.hide();
    }

    createImagesCollection(hits);

    if (searchApiImages.page > 2) scrollTheCollection();

    lightbox.refresh();
  } catch (error) {
    errorShow();
  }
}

function createImagesCollection(arr) {
  const markupImagesCollectiom = arr
    .map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <div class="wrap-photo">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="640"/></a></div>
  <div class="info">
    <p class="info-item"><b>Likes</b>${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
  </div></div>`;}).join('');

  gallery.insertAdjacentHTML('beforeend', markupImagesCollectiom);
  loadMoreBtn.enable();
}

function clearImagesCollection() {
  gallery.innerHTML = '';
}

function resetForm() {
  form.reset();
}

function errorShow(error) {
  Notify.failure('Error');
  loadMoreBtn.hide();
  console.error(error.massege);
}

function scrollTheCollection() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

 










// import { Notify } from 'notiflix';
// import SimpleLightbox from "simplelightbox";
// import { fetchImges } from './fetchImges.js';
// import './styles.css';
// import "simplelightbox/dist/simple-lightbox.min.css";

// let incrementPage = 1;
// let totalHits = 0;
// let inputData = null;

// Notify.init({
//   timeout: 2000,
//   clickToClose: true,
// });

// const galleryEl = document.querySelector('.gallery');
// const formEl = document.getElementById('search-form');
// const btnLoadMoreEl = document.querySelector('.load-more');

// formEl.addEventListener('submit', onSearch);

// async function onSearch(e) {
//     e.preventDefault();
    
//     btnLoadMoreEl.classList.add('is-hidden');
//     galleryEl.innerHTML = "";
//     incrementPage = 1;
//     totalHits = 0;

//     inputData = e.currentTarget.searchQuery.value.trim();
//     const fetch = await fetchImges(inputData, incrementPage);

//     if (fetch.totalHits !== 0) {
//         Notify.info(`Hooray! We found ${fetch.totalHits} images.`);
//     };

//     onValidationTotalImg(fetch);
//     btnLoadMoreEl.addEventListener('click', onLoadMore);
// };

// async function onLoadMore() {
//     incrementPage += 1;
//     const fetch = await fetchImges(inputData, incrementPage);

//     onValidationTotalImg(fetch);
// };

// function onMarkupGallery(imgArray) {
//     const markupGallery = imgArray.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
//         return `<div class="photo-card">
//     <a class="gallery__item" href="${largeImageURL}">
//     <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
//     <div class="info">
//     <p class="info-item">
//     <b>Likes:</b>${likes}</p><p class="info-item"><b>Views</b>${views}</p><p class="info-item"><b>Comments</b>${comments}</p><p class="info-item"><b>Downloads</b>${downloads}</p></div></a></div>`
//     }).join('');

//     galleryEl.insertAdjacentHTML('beforeend', markupGallery);
    
//     const lightbox = new SimpleLightbox('.gallery a', {
//         captionDelay: 250,
//         captions: true,
//         captionsData: 'alt',
//     }).refresh();

//     onScroll()
// };

// const onValidationTotalImg = (data) => {

//     if (data.hits.length === 0) {
//         Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
//         return;
//     };

//     totalHits += data.hits.length;

//     if (data.totalHits === totalHits) {
//         btnLoadMoreEl.classList.add('is-hidden');
//         Notify.info(`Were sorry, but you've reached the end of search results.`);
//     } else {
//         btnLoadMoreEl.classList.remove('is-hidden');
//     };

//     onMarkupGallery(data.hits);
//   };

// function onScroll() {
//     if (incrementPage < 2) {
//         return
//     };
//     const cardHeight = galleryEl.firstElementChild.getBoundingClientRect();
//     window.scrollBy({
//         top: cardHeight.height * 2.5,
//         behavior: "smooth",
//     });
// };