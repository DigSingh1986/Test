import React, { Component } from 'react';
import './App.css';
import Main from './Components/Main.js';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	  shadows: ["none"],
    palette: {
        primary: {
            main: '#005984'
        },
        secondary: {
            main: '#006fa4'
        }
    },
    typography: {
        fontFamily: "'NewsGothicFamily', sans-serif",
    },

},
)

export default class App extends Component {
    static displayName = App.name;
    
  render () {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Main id="content" title={Main} />
            </div>
        </MuiThemeProvider>
    );
  }
}
