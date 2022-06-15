import * as React from "react"
import {
  Card,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormLabel,
  Autocomplete,
} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useState, useEffect, componentDidUpdate} from 'react'
import $, { event } from 'jquery'


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
  const [queryFromDate, setQueryFromDate] = useState("");
  const [queryToDate, setQueryToDate] = useState("");
  const [queryLimit, setQueryLimit] = useState(-1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading("true");
    // SQL Query Builder
    let startQuery = "SELECT vehicle, event, data, recorded_at as timestamp FROM `ubc-smc-telemetry.telemetry_dataset.telemetry_table` ";
    let vehicleQuery = "( " + queryVehicles.map(vehicle => "vehicle = '" + vehicle + "'").join(" OR ") + " )";
    let eventQuery = "( " + queryEvents.map(event => "event = '" + event + "'").join(" OR ") + " )";
    
    let fromTimestamp = queryFromDate === "" ? "" : "TIMESTAMP(recorded_at) >= '" + queryFromDate + ":00'";
    let toTimestamp = queryToDate === "" ? "" : "TIMESTAMP(recorded_at) <= '" + queryToDate + ":59'";
    let timestampQuery = "";
    if (fromTimestamp !== "" && toTimestamp !== "") {
      timestampQuery = "( " + fromTimestamp + " AND " + toTimestamp + " )";
    } else if (fromTimestamp !== "") {
      timestampQuery = fromTimestamp;
    } else if (toTimestamp !== "") {
      timestampQuery = toTimestamp;
    }
    let endQuery = "ORDER BY TIMESTAMP(recorded_at) DESC";

    // let query = startQuery + vehicleQuery + " AND " + eventQuery + " AND " + timestampQuery + " " + endQuery;
    let query = startQuery;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // WHERE BLOCK
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (vehicleQuery !== "(  )" || eventQuery != "(  )" || timestampQuery !== "") {
      query += " WHERE ";
    }
    if (vehicleQuery !== "(  )") {
      query += vehicleQuery;
    }
    if (eventQuery != "(  )" || timestampQuery !== ""){
      query += " AND ";
    } 
    if (eventQuery != "(  )") {
      query += eventQuery;
    }
    if (timestampQuery !== ""){
      query += " AND ";
    }
    query += timestampQuery
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // END WHERE BLOCK
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    query += endQuery
    if (queryLimit > 0){
      query += " LIMIT " + queryLimit;
    } else {
      query += " LIMIT " + 10000;
    }
    console.log(query);

    var formdata = JSON.stringify({'query': query});

    // Send query request to flaskapp
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
              setLoading(false);
          }
      },
      error: (res, status, err) => {
          alert("Error: " + res.responseText);
          setLoading(false);
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
            <LoadingButton id="query-submit" variant="contained" loading={loading} onClick={handleSubmit}>Submit</LoadingButton>
            </FormGroup>
          </form>
        </Card>
      </Grid>
    </Grid>
      
      
    </main>
  );
};

export default QueryPage;
