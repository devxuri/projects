const searchInput = document.querySelector('#search-input');
const cardsContainer = document.querySelector('#cards-container');
let locationPerm = true;
let getLocationToggle = true;
let countryid = 0;
let tempUserCountry = '';
let reccurringUserCountry;

//debounce feature for cooldown when typing into search box
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

//basic card renderer
const createCard = country => {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `${countryid}`;
  countryid++;
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
  addFavBtn.textContent = 'Add to favourites';
  card.appendChild(addFavBtn);

  addFavBtn.addEventListener('click', () => {
    let favlist = JSON.parse(localStorage.getItem('favlist')) || [];
    const favIndex = favlist.findIndex(favCountry => favCountry.name.common === country.name.common);
    if (favIndex > -1) {
      favlist.splice(favIndex, 1);
      addFavBtn.textContent = 'Add to favourites';
    } else {
      favlist.push(country);
      addFavBtn.textContent = 'Remove from favourites';
    }
    localStorage.setItem('favlist', JSON.stringify(favlist));
  });
  
  viewWeatherBtn.addEventListener('click', () => {
    window.location.href = `country-weather.html?country=${country.name.common}`;
  });

  return card;
};

// Allows us to reshow all cards if user inputs nothing
const showall = () => {
  cardsContainer.innerHTML = '';
  getLocationToggle = false;
  fetchall();
}

// Main logic to allow sorting of countries as well as positioning user country at top, if conditions for variations with different points of user entrance
async function fetchall() {
    try {
      const data = await fetch('https://restcountries.com/v3.1/all').then(response => response.json());
      let userCountry = 'US';
      if(getLocationToggle){
        userCountry = await getUserCountry();
        tempUserCountry = userCountry;
      }
      else if (reccurringUserCountry){
        userCountry = reccurringUserCountry;
      }
      else{
        userCountry = tempUserCountry;
      }
      const sortedCountries = sortCountries(data, userCountry);
      sortedCountries.forEach(country => {
        const card = createCard(country);
        cardsContainer.appendChild(card);
      });
    } catch (error) {
      console.error(error);
      showErrorPopup();
    }
  }

  // API call to get the user's location country code, also saved to local storage for easier use later
  function getUserCountry() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            fetch(url)
              .then(response => response.json())
              .then(data => {
                const userCountry = data.countryCode;
                locationPerm = true;
                localStorage.setItem('locperm', JSON.stringify(locationPerm));
                localStorage.setItem('locuser', JSON.stringify(userCountry));
                resolve(userCountry);
              })
              .catch(error => {
                console.error(error);
                locationPerm = false;
                localStorage.setItem('locperm', JSON.stringify(locationPerm));
                reject(error);
              });
          },
          error => {
            console.error(error);
            locationPerm = false;
            localStorage.setItem('locperm', JSON.stringify(locationPerm));
            resolve('US'); // return default value 'US' if geolocation is blocked
          }
        );
      } else {
        reject(new Error('Geolocation is not available'));
      }
    });
  }
  
  
function sortCountries(countries, userCountry) {
    const sortedCountries = countries.sort((a, b) => {
      if (a.altSpellings[0] === userCountry) {
        return -1; // user's country comes first
      } else if (b.altSpellings[0]  === userCountry) {
        return 1; // user's country comes first
      } else {
        return a.name.common.localeCompare(b.name.common); // sort alphabetically
      }
    });
    return sortedCountries;
  }

const countrySearch = debounce((ev) => {
  let searchText = searchInput.value.trim().toLowerCase();
  if (searchText!='')
  {
    fetch(`https://restcountries.com/v3.1/name/${searchText}`)
    .then(response => response.json())
    .then(data => {
      cardsContainer.innerHTML = '';
      const filteredCountries = data.filter(country =>
        country.name.common.toLowerCase().includes(searchText)
      );
      filteredCountries.forEach(country => {
        const card = createCard(country);
        cardsContainer.appendChild(card);
      })
    })
    .catch(error => {
      console.error(error);
      showErrorPopup();
    });
  }
  else{
    showall();
  }
}, 500 );


function showErrorPopup() {
  const popupBox = document.querySelector('#cards-container');
  const popup = document.createElement('div');
  popup.className = 'error-popup';
  popup.textContent = 'Enter a valid country!';
  popupBox.appendChild(popup);
}

// decides whether to ask for location or continue if already there in local storage from before
async function checkLocalStorage() {
    const getDeciderData = localStorage.getItem('locperm');
    const getUserData = localStorage.getItem('locuser');
    const getDecider = JSON.parse(getDeciderData);
    const getUser = JSON.parse(getUserData);
    reccurringUserCountry = getUser;
    if (getDecider) {
        try {
            const data = await fetch('https://restcountries.com/v3.1/all').then(response => response.json());
            const sortedCountries = sortCountries(data, reccurringUserCountry);
            sortedCountries.forEach(country => {
                const card = createCard(country);
                cardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            showErrorPopup();
        }
    }
    else {
      fetchall();
    }
  }
  
checkLocalStorage();
searchInput.addEventListener('input', countrySearch);