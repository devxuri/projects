const cardsContainer = document.querySelector('#cards-container');

const createCard = (country, id) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
  const img = document.createElement('img');
  img.src = country.flags.svg;
  img.alt = `${country.name.common} flag`;
  card.appendChild(img);
  const h2 = document.createElement('h2');
  h2.textContent = country.name.common;
  card.appendChild(h2);

  if (country.capital?.[0]) {
    const p = document.createElement('p');
    p.textContent = `Capital: ${country.capital[0]}`;
    card.appendChild(p);
  }

  const viewWeatherBtn = document.createElement('button');
  viewWeatherBtn.className = 'view-weather';
  viewWeatherBtn.textContent = 'View weather forecast';
  card.appendChild(viewWeatherBtn);

  const addFavBtn = document.createElement('button');
  addFavBtn.className = 'add-favourite';

  const favlist = JSON.parse(localStorage.getItem('favlist')) || [];
  const favIndex = favlist.findIndex((favCountry) => favCountry.name.common === country.name.common);
  addFavBtn.textContent = favIndex > -1 ?  'Remove' : 'Add to favourites';
  card.appendChild(addFavBtn);

  addFavBtn.addEventListener('click', () => {
    const favlist = JSON.parse(localStorage.getItem('favlist')) || [];
    const favIndex = favlist.findIndex((favCountry) => favCountry.name.common === country.name.common);
    if (favIndex > -1) {
      favlist.splice(favIndex, 1);
      addFavBtn.textContent = 'Add to favourites';
    } else {
      favlist.push(country);
      addFavBtn.textContent = 'Remove';
    }
    localStorage.setItem('favlist', JSON.stringify(favlist));
    console.log(favlist);
    card.remove();
    if (favlist.length === 0) {
      renderNoCountriesMessage();
    }
  });

  viewWeatherBtn.addEventListener('click', () => {
    window.location.href = `../pages/country-weather.html?country=${country.name.common}`;
  });

  return card;
};

const renderFavorites = () => {
  const favlist = JSON.parse(localStorage.getItem('favlist')) || [];
  cardsContainer.innerHTML = '';
  if (favlist.length === 0) {
    renderNoCountriesMessage();
  } else {
    favlist.forEach((country, index) => {
      const card = createCard(country, index);
      cardsContainer.appendChild(card);
    });
  }
};

const renderNoCountriesMessage = () => {
  const noCountriesMsg = document.createElement('p');
  noCountriesMsg.textContent = 'No countries added at the moment';
  cardsContainer.appendChild(noCountriesMsg);
};

renderFavorites();
