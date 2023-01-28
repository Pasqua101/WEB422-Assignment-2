/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Marco Pasqua Student ID: 100497213 Date: Sunday, Janauary 29, 2023
*
********************************************************************************/ 


// Global Variables
var page = 1;
var perPage = 10;
var url = 'https://peach-tadpole-wrap.cyclic.app/'; // Link to webpage made in previous assignment, so this way the database can be accesse

function loadMovieData(title = null) {
    if (title) {
        fetch(url + `api/movies?page=${page}&perPage=${perPage}&title=${title}`).then((res) => {
            return res.json()
        }).then((data) => {
            var pagi = document.querySelector('.pagination');
            pagi.classList.add("d-none");
            createMovieTable(data);
            setPageCount();
            createClickEventForRow();
            getPreviousPage();
            getNextPage();
            formSearchBtn();
            formClearBtn();
        })
    } else {
        fetch(url + `api/movies?page=${page}&perPage=${perPage}`).then((res) => {
            return res.json();
        }).then((data) => {
            createMovieTable(data);
            setPageCount();
            createClickEventForRow();
            getPreviousPage();
            getNextPage();
            formSearchBtn();
            formClearBtn();
        })

    }
}
document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
});


function createTrElement(movieData) {
    let trElem = `${
        movieData.map(movie => (`
        <tr movie-id=${movie._id}>
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot ? movie.plot : 'N/A'}</td>
            <td>${movie.rated ? movie.rated : 'N/A'}</td>
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
        </tr>
        `)).join('')
    }`

    return trElem;
}

function createMovieTable(movieData) {
    let trElem = createTrElement(movieData);
    let tbody = document.querySelector('#moviesTable tbody');
    tbody.innerHTML = trElem;
}

function setPageCount() {
    document.querySelector('#current-page').innerHTML = page;
}

function createClickEventForRow() {
    let movieRows = document.querySelectorAll('tbody tr');
    movieRows.forEach(row => {
        row.addEventListener("click", () => {
            let movieId = row.getAttribute('movie-id');
            fetch(url + `/api/movies/${movieId}`).then((res) => {
                return res.json();
            }).then((movie) => {
                document.querySelector('.modal-title').innerHTML = movie.title;
                if (movie.poster) {
                    document.querySelector('.modal-body').innerHTML = `
                        <img class="img-fluid w-100" src= ${movie.poster}><br><br>
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.plot ? movie.plot : 'N/A'}</p>
                        <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating}
                        (${movie.imdb.votes} votes)`
                } 
                else {
                    document.querySelector('.modal-body').innerHTML = `
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.plot ? movie.plot : 'N/A'}</p>
                        <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating}
                        (${movie.imdb.votes} votes)`
                }

                let movieModal = new bootstrap.Modal(document.querySelector('#detailsModal'), {
                    backdrop: 'static',
                    keyboard: false
                });
                movieModal.show();
            })
        })
    })
}
// For some reason the value of page increases and decreases exponetially, I'm not sure what could cause the issue other thank the event handling maybe
function getPreviousPage() {
    let bt = document.querySelector('#previous-page');
    bt.addEventListener('click', () => {
        if (page > 1) {
            page -= 1;
        }
        loadMovieData();
    })
}

function getNextPage() {
    let bt = document.querySelector('#next-page');
    bt.addEventListener('click', () => {
        page += 1;
        loadMovieData();
    })
}

function formSearchBtn() {
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        loadMovieData(document.querySelector('#title').value);
    });
}

function formClearBtn() {
    document.querySelector('#clearForm').addEventListener("click", () => {
        document.querySelector('#title').value = '';
        loadMovieData();
    })
}
