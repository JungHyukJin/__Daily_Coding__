const movieNameRef = document.querySelector("#movie-name");
const searchBtn = document.querySelector("#search-btn");
const result = document.querySelector("#result");
// const apiKey = '766a2625';
const apiKey = "7f9a3b82";

const getMovie = () => {
  let movieName = movieNameRef.value;
  let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`;

  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="">Please enter a movie name</h3>`;
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data);
        if (data.Response === "True") {
          result.innerHTML = `
                    <div class="info">
                        <img src=${data.Poster} class="poster">
                        <div class="info-detail">
                            <h2>${data.Title}</h2>
                            <div class="rating">
                                <img src="./star-icon.svg" />
                                <h4>${data.imdbRating}</h4>
                            </div>
                            <div class="details">
                                <span>${data.Rated}</span>
                                <span>${data.Year}</span>
                                <span>${data.Runtime}</span>
                            </div>
                            <div class="genre">
                                <div>${data.Genre.split(",").join(
                                  "</div><div>"
                                )}</div>
                            </div>
                        </div>
                    </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p>
                `;
        } else {
          result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
        }
      })
      .catch(() => {
        result.innerHTML = `<h3 class="msg">Error Occured</h3>`;
      });
  }
};

searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie); //브라우저
