import generatedCountries from "./countries.generated.json";

export type CountryOption = {
  code: string;
  name: string;
  flag: string;
  callingCodes: string[];
};

export const countryOptions = generatedCountries as CountryOption[];

export const countries = countryOptions.map((country) => country.name);

export const callingCodes = countryOptions.flatMap((country) =>
  country.callingCodes.map((callingCode, index) => ({
    id: `${country.code}:${callingCode}`,
    countryCode: country.code,
    countryName: country.name,
    displayCode: callingCode === "+1" ? "+1" : callingCode.replace(/^(\+1)(\d{3})$/, "$1 $2"),
    value: callingCode,
    primary: index === 0
  }))
);

export const companySizes = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,001–5,000", "5,001+"];
export const industries = [
  "Agriculture",
  "Consumer goods",
  "Education",
  "Energy",
  "Financial services",
  "Government",
  "Healthcare",
  "Hospitality",
  "Manufacturing",
  "Professional services",
  "Retail",
  "Software & technology",
  "Telecommunications",
  "Transportation & logistics",
  "Other"
];
