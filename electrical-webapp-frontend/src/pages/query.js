import * as React from "react"
import {
  Button,
  FormControl,
  Card,
  Grid,
  TextField
} from "@mui/material"
import {useState} from 'react'
import $ from 'jquery'

// styles
const queryCardStyle = {
  m: 2,
  textAlign: "center"
};
const queryCardChildStyle = {
  margin: 2,
  width: "90%",
};
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
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
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

  const params = new URLSearchParams(location.search);
  var filledQuery = params.has("query") ? params.get("query") : ""

  return (
    <main style={pageStyle}>
      <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      style = {gridStyle}
    >
      <Grid item xs={4} sm={7} md={10}>
        <Card variant="outlined" sx={queryCardStyle}>
          <FormControl sx={queryCardChildStyle}>
            <TextField
              id="query"
              label="Query"
              helperText="Raw SQL Query"
              variant="outlined"
              multiline={true}
              minRows={5}
              onChange={event => setQuery(event.target.value)}
              defaultValue = {filledQuery}
            />
            <Button id = "query-submit" variant="contained" onClick={handleSubmit}>Submit</Button>
          </FormControl>
        </Card>
      </Grid>
    </Grid>
      
      
    </main>
  );
};

export default QueryPage;
