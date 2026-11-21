import { writeFile } from "node:fs/promises";
import { getCountryCallingCode, isSupportedCountry } from "libphonenumber-js/min";
import worldCountries from "world-countries";

const countries = worldCountries
  .map((country) => {
    const generatedFlag = [...country.cca2]
      .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
      .join("");
    let callingCodes = [];
    if (isSupportedCountry(country.cca2)) {
      callingCodes = [`+${getCountryCallingCode(country.cca2)}`];
    }
    // Countries and territories in the North American Numbering Plan share
    // +1 but often have their own regional prefix. Keep US/Canada at +1 and
    // expose the complete regional prefixes for the remaining territories.
    if (
      country.idd.root === "+1" &&
      !["US", "CA"].includes(country.cca2) &&
      country.idd.suffixes.length
    ) {
      callingCodes = country.idd.suffixes.map((suffix) => `+1${suffix}`);
    }
    return {
      code: country.cca2,
      name: country.name.common,
      flag: country.flag || generatedFlag,
      callingCodes
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name));

await writeFile(
  new URL("../src/data/countries.generated.json", import.meta.url),
  `${JSON.stringify(countries, null, 2)}\n`
);

console.log(`Generated ${countries.length} countries and territories.`);
