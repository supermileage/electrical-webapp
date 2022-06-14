import * as React from "react"
import {
  Button,
  FormControl,
  Card,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Container,
  FormLabel,
  Autocomplete,
  listItemTextClasses,
  Box
} from "@mui/material"
import {useState, useEffect, componentDidUpdate} from 'react'
import $, { event } from 'jquery'
import moment from 'moment'


// styles
const queryCardStyle = {
  m: 2,
  textAlign: "center"
};
const queryCardChildStyle = {
  margin: 1,
  width: "90%",
  textAlign: "center",
};
const formGroupStyle = {
  width: "100%",
  justifyContent: "space-around",
  textAlign: "center"
}
const submitFormGroupStyle = {
  width: "100%",
  justifyContent: "center",
  textAlign: "center"
}
const pageStyle = {
  backgroundColor: "#112445",
  minHeight: "100vh"
};
const gridStyle = {
  m: 1
}

// data
// markup
const QueryPage = ({location}) => {
  const [queryVehicles, setQueryVehicles] = useState([]);
  const [queryEvents, setQueryEvents] = useState([]);
  const [queryFromDate, setQueryFromDate] = useState("2000-01-01T00:00");
  const [queryToDate, setQueryToDate] = useState("3000-01-01T00:00");
  const [queryLimit, setQueryLimit] = useState(-1)

  const handleSubmit = () => {
    let startQuery = "SELECT vehicle, event, data, recorded_at as timestamp FROM `ubc-smc-telemetry.telemetry_dataset.telemetry_table` WHERE ";
    let vehicleQuery = "( " + queryVehicles.map(vehicle => "vehicle = '" + vehicle + "'").join(" OR ") + " )";
    let eventQuery = "( " + queryEvents.map(event => "event = '" + event + "'").join(" OR ") + " )";
    let timestampQuery = "( " + "TIMESTAMP(recorded_at) <= '" + queryToDate + ":59' AND TIMESTAMP(recorded_at) >= '" + queryFromDate + ":00'" + " ) ";
    let endQuery = "ORDER BY TIMESTAMP(recorded_at) DESC";

    // let query = startQuery + vehicleQuery + " AND " + eventQuery + " AND " + timestampQuery + " " + endQuery;
    let query = startQuery;
    if (vehicleQuery !== "(  )") {
      query += vehicleQuery + " AND ";
    }
    if (eventQuery != "(  )") {
      query += eventQuery + " AND ";
    }
    query += timestampQuery + endQuery
    if (queryLimit > 0){
      query += " LIMIT " + queryLimit;
    }
    console.log(query);

    var formdata = JSON.stringify({'query': query});

    $.ajax({
      type: "POST",
      url: "/api/query",
      data: formdata,
      dataType: "text",
      contentType: "application/json",
      success: (data, status, xhr) => {
          // definitely not copied off stackoverflow
          //Convert the Byte Data to BLOB object.
          var blob = new Blob([data], { type: "application/octetstream" });

          //Check the Browser type and download the File.
          var isIE = false || !!document.documentMode;
          if (isIE) {
              window.navigator.msSaveBlob(blob, "export.csv");
          } else {
              var url = window.URL || window.webkitURL;
              var link = url.createObjectURL(blob);
              var a = $("<a />");
              a.attr("download", "export.csv");
              a.attr("href", link);
              $("body").append(a);
              a[0].click();
              $("body").remove(a);
          }
      },
      error: (res, status, err) => {
          alert("Error: " + res.responseText);
      }
    })
  }

  const [vehicleCheckboxes, setVehicles] = useState([]);
  const [events, setEvents] = useState([]);
  

  useEffect(()=>{
    fetch('/api/columns')
    .then(response => response.json())
    .then(data => {
      let vehicles = [];
      data.vehicles.forEach(vehicle => {
        vehicles.push(
          <FormControlLabel
          key={"vehicleCheckbox" + vehicle}
          control={<Checkbox
            name = {vehicle}
            onChange={event=>{
              if (event.target.checked) {
                setQueryVehicles( arr => [...arr, event.target.name]);
              } else {
                setQueryVehicles( arr => arr.filter(function(e) { return e !== event.target.name }));
              }
            }}
          />}
          label={vehicle}
          />
        )
      });
      setVehicles(vehicles);

      setEvents(data.events);
    })
  }, [])

  return (
    <main style={pageStyle}>
      <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      style = {gridStyle}
    >
      <Grid item xs={4} sm={6} md={8} lg={6}>
        <Card variant="outlined" sx={queryCardStyle}>
          <form style={{margin: "2%", justifyContent: "center", alignItems: "Center", textAlign: "center"}}>
            <FormLabel id="vehicle-label">Vehicles</FormLabel>
            <FormGroup sx={formGroupStyle} row={true}>
              {vehicleCheckboxes}
            </FormGroup>
            <Autocomplete
              multiple
              id={"eventInput"}
              options = {events}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Events"
                  sx={queryCardChildStyle}
                />
              }
              onChange={(event, values) => {
                setQueryEvents(values)
              }}
              />
            <FormGroup sx={formGroupStyle} row={true}>
              <TextField
              id="from-date"
              label="From"
              type="datetime-local"
              InputLabelProps={
                {shrink: true}
              }
              onChange={event => setQueryFromDate(event.target.value)}
              sx={{m: 1}}
              />
              <TextField
              id="to-date"
              label="To"
              type="datetime-local"
              InputLabelProps={
                {shrink: true}
              }
              onChange={event => setQueryToDate(event.target.value)}
              sx={{m: 1}}
              />
            </FormGroup>
            <FormGroup
              display="flex"
              justifyContent="center"
              alignItems="center"
              row={true}
              sx={submitFormGroupStyle}
            >
            <TextField
            id="limit"
            label="Row Limit"
            type="number"
            onChange={event => setQueryLimit(parseInt(event.target.value))}
            sx={{m: 1}}
            />
            <Button id="query-submit" variant="contained" onClick={handleSubmit}>Submit</Button>
            </FormGroup>
          </form>
        </Card>
      </Grid>
    </Grid>
      
      
    </main>
  );
};

export default QueryPage;
