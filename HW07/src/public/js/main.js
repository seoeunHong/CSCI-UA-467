// TODO: add client side code for single page application
function main() {
  const addBtn = document.querySelector('#addBtn');
  addBtn.addEventListener('click', handleAdd);
  loadReviews();
  const filterBtn = document.querySelector('#filterBtn');
  filterBtn.addEventListener('click', handleFilter);
}

async function handleAdd(event) {
  event.preventDefault();
  const name = document.querySelector('#name').value;
  const semester = document.querySelector('#semester').value;
  const year = document.querySelector('#year').value;
  const professor = document.querySelector('#professor').value;
  const review = document.querySelector('#review').value;
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name, semester, year, professor, review}),
  };
  const res = await fetch('http://localhost:3000/api/review/create', config);
  const courseReview = await res.json();
  addReviewsToPage([courseReview]);
  console.log(res);
}

async function handleFilter(event) {
  event.preventDefault();
  const filterSemester = document.querySelector('#filterSemester').value;
  console.log(filterSemester);
  const filterYear = document.querySelector('#filterYear').value;
  const filterProf = document.querySelector('#filterProf').value;
  const APIurl = `http://localhost:3000/api/reviews/?semester=${filterSemester}&year=${filterYear}&professor=${filterProf}`;
  const res = await fetch(APIurl);
  const data = await res.json();
  const tableBody = document.querySelector('table > tbody');
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  addReviewsToPage(data);
}

async function loadReviews() {
  const res = await fetch('http://localhost:3000/api/reviews');
  const data = await res.json();
  addReviewsToPage(data);
}

function addReviewsToPage(data) {
  for (const d of data) {
    const tableBody = document.querySelector('table > tbody');
    const row = document.createElement('tr');
    for (const prop in d) {
      if (d.hasOwnProperty(prop) && prop !== '_id' && prop !== '__v') {
        const element = document.createElement('td');
        element.textContent = d[prop];
        row.appendChild(element);
      }
    }
    tableBody.appendChild(row);
  }
}

document.addEventListener('DOMContentLoaded', main);
