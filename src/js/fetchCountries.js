export async function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name.official,capital,population,flags.svg,languages`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      return response.json();
    });
}
