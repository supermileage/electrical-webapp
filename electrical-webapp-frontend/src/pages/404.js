import * as React from "react"
import {
  Grid,
} from "@mui/material"
import ubcst_logo from "../images/ubcst-logo-inverted.png"

// styles
const pageStyle = {
  backgroundColor: "#112445",
  color: "white",
  minHeight: "100vh",
  fontFamily: '"Roboto Slab", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
};

const gridStyle = {
  m: 1,
  height: "100vh"
};

const imgStyle={
  width: "100%"
};

// data
// markup
const errorPage = () => {

  return (
    <main style={pageStyle}>
      

      <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      direction="row"
      justifyContent="center"
      alignItems="center"
      style = {gridStyle}
    >
      <Grid item xs={4} sm={6} md={6} style={{textAlign: 'center'}}>
          <img src={ubcst_logo} style={imgStyle} alt="Supermileage logo"></img>
          <h1>404</h1>
          <h2>OOPS! We couldn't find that page!</h2>
      </Grid>
    </Grid>
    </main>
  );
};

export default errorPage;
