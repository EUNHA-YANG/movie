let movieBoard = document.querySelector("#movieBoard");
let apikey = "78e2e6b7c1e7b6b04698fbfeace7c5cf";

let currentPage = 1;
let currentList = "now_playing";

// Swiper 초기화 (먼저 선언)
var swiper = new Swiper(".mySwiper", {
  effect: "cube",
  grabCursor: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// Swiper에 영화 이미지 로드
let loadSwiperImages = async () => {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&language=ko-KR&page=1`;

  let response = await fetch(url);
  let data = await response.json();

  let topMovies = data.results.slice(0, 5); // 상위 5개만
  let swiperWrapper = document.querySelector(".swiper-wrapper");

  swiperWrapper.innerHTML = "";

  topMovies.forEach((movie) => {
    let slide = `
      <div class="swiper-slide">
        <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="${movie.title}">
      </div>
    `;
    swiperWrapper.innerHTML += slide;
  });

  // Swiper 업데이트
  swiper.update();
};

// Swiper 이미지 로드 실행
loadSwiperImages();

let movie = async (lists, append = false) => {
  if (lists) {
    currentList = lists;
    currentPage = 1;
  }

  let url = `https://api.themoviedb.org/3/movie/${currentList}?api_key=${apikey}&language=ko-KR&page=${currentPage}`;

  let response = await fetch(url);
  let data = await response.json();

  let movieList = data.results;
  console.log(movieList);

  render(movieList, append);
};

movie("now_playing");

let render = (movieList, append = false) => {
  if (!append) {
    movieBoard.innerHTML = "";
  }

  movieList.forEach((movie) => {
    let card = `<div class="card">
      <div class="imgBox">
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"></img>
        <h4 class="overview">
          ${over(movie.overview, 100)}
        </h4>
        <h4 class="avg">
          <span>평점</span>
          ${Math.round(movie.vote_average)}
        </h4>
      </div>
      <h3>${movie.title}</h3>
    </div>`;

    movieBoard.innerHTML += card;
  });
};

// 100글자까직만 나오게하기
function over(text, limit) {
  console.log(text.length);
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

// 검색
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", async () => {
  let keyword = encodeURIComponent(searchInput.value.trim());

  if (keyword == "") {
    alert("검색어를 입력하세요");
    return;
  }

  let url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=${apikey}&language=ko-KR`;

  let response = await fetch(url);
  let data = await response.json();

  let movieList = data.results;
  console.log(movieList);

  render(movieList);
});

// 더보기 기능 추가
let moreBtn = document.querySelector(".more a");

moreBtn.addEventListener("click", (e) => {
  e.preventDefault();
  currentPage++;
  movie(null, true);
});
