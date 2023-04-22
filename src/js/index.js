import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');

document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('#search-box');
  input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
});

function handleInput(event) {
  const searchTerm = event.target.value.trim();
  if (searchTerm.length === 0) {
    clearCountryList();
    return;
  }    
  
  fetchCountries(searchTerm)
    .then(data => {
      if (data.length === 0) {
        Notiflix.Notify.warning('No country found with that name.');
        clearCountryList();
        return;
      }
      if (data.length > 10) {
        Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
        clearCountryList();
        return;
      }
      renderCountryListItems(data);
    })    
    .catch(error => {
      console.log(error);
      if (error.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        Notiflix.Notify.failure('Something went wrong. Please try again later.');
      }
    });
}

function clearCountryList() {
  countryList.innerHTML = '';
}
function renderCountryListItems(countries) {
  countryList.innerHTML = '';
  if (countries.length === 1) {
    renderCountryDetails(countries[0]);
    return;
  }
  countries.forEach(country => {
    const countryItem = `
      <li class="country-item" data-country-code="${country.alpha3Code}">
        <img src="${country.flags.svg}" alt="${country.name.official} flag" width="100">
        <h2>${country.name.official}</h2>
      </li>
    `;
    countryList.insertAdjacentHTML('beforeend', countryItem);
  });
  countryList.addEventListener('click', handleCountryClick);
}


function renderCountryDetails(country) {
  const languages = getLanguages(country);

  const countryInfo = `
    <div class="country-info">
      <img src="${country.flags.svg}" alt="${country.name.official} flag" width="100">
      <h2>${country.name.official}</h2>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${languages}</p>
    </div>
  `;
    
  countryList.innerHTML = countryInfo;
}


function getLanguages(country) {
  let languages = country.languages;
  if (languages && languages.length > 0) {
    languages = languages.map(lang => lang.name).join(', ');
  } else {
    languages = '';
  }
  return languages;
}
