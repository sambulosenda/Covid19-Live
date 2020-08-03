import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./infoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./utils";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80736, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, []);

 

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(responce => responce.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async event => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log("country Info >>", countryInfo);
  return (
    <div className="app">
      <div className="div app__left">
        <div className="app__header">
          <h1>Covid19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
              {/* <MenuItem value="worldwide">worldwide</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">wOption3</MenuItem>
            <MenuItem value="worldwide">worldwide</MenuItem> */}{" "}
            </Select>
          </FormControl>
        </div>
        {/* Header */}
        {/* Title + Select input drop down field */}
        {/* Infobox */}
        <div className="app__stats">
          <InfoBox
            title="coronavirus Cases"
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          />
          <InfoBox
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          />
          <InfoBox
            title="Deaths"
            total={countryInfo.deaths}
            cases={country.todayDeaths}
          />
        </div>
        {/* Table */}
        {/* Graph */}
        {/* Map */}
        <Map 
        center={mapCenter}
        zoom={mapZoom}
      
        />{" "}
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Coutry</h3>
          <Table countries={tableData}/>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
