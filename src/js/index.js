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
      renderCountryList(data);
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

function renderCountryList(countries) {
  countryList.innerHTML = '';
  countries.forEach(country => {
    const flagImg = `<img src="${country.flags.svg}" alt="${country.name.official} flag" width="100">`;
    const countryName = `<h2>${country.name.official}</h2>`;
    const capital = `<p><strong>Capital:</strong> ${country.capital}</p>`;
    const population = `<p><strong>Population:</strong> ${country.population}</p>`;
    const languages = `<p><strong>Languages:</strong> ${country.languages.map(lang => lang.name).join(', ')}</p>`;

    const countryInfo = document.createElement('div');
    countryInfo.classList.add('country-info');
    countryInfo.innerHTML = `${flagImg} ${countryName} ${capital} ${population} ${languages}`;

    const countryItem = document.createElement('li');
    countryItem.classList.add('country-item');
    countryItem.appendChild(countryInfo);

    countryList.appendChild(countryItem);
  });
}
