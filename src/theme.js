import { createTheme } from '@mui/material/styles';
import {red, blue} from '@mui/material/colors';

const myTheme = createTheme({
    palette: {
        primary: {
            main: red['A700'],
        },
        secondary: {
            main: blue[900],
            // '&:hover': {
            //   main: 'red'
            // }
        },
        error: {
          main: red['A700'],
        },
    }
});

myTheme.components = {
    MuiPaper: {
        styleOverrides: {
            elevation2: {
                border: 'solid',
                borderWidth: 2,
                borderColor: myTheme.palette.secondary.main,
                p: 1,
                m: 2,
            }
        }
    },

    MuiTabs: {
        styleOverrides: {
            root : {
                flex: 1,
                m: 20,
                backgroundColor: myTheme.palette.grey[50],
                '& .Mui-selected': {
                    backgroundColor: myTheme.palette.grey[50],
                    borderRadius: 2,
                    fontWeight: 'bold',
                    m: 1
                }
            },
            indicator : {
                // backgroundColor: 'black',
            },
            // '&$selected': {
            //     backgroundColor: myTheme.palette.grey[50],
            //     borderRadius: 2,
            //     fontWeight: 'bold',
            //     m: 1
            // }
        },
    },
    
    MuiTab: {
        styleOverrides: {
            root: {
                
            },
        }
    },

    Mui: {
        styleOverrides: {
            selected : {
                backgroundColor: myTheme.palette.grey[50],
                borderRadius: 2,
                fontWeight: 'bold',
                m: 1
            },
        }
    },

    MuiTabScrollButton: {
        styleOverrides: {
            // color: myTheme.palette.grey[50],
            // backgroundColor: myTheme.palette.grey[50],
        }
    },

    MuiCssBaseline: {
        styleOverrides: {
            html: {
            // colorScheme: 'dark'
            },
            body: {
                // backgroundSize: 'cover',
                // backgroundPosition: 'center center',
                // backgroundAttachment: 'local',
                // overflowY: 'hidden',
                // minHeight: '100vh',
                // minWidth: '700px',
                // height: '100vh',
                // width: '100vw',
                // backgroundImage: `linear-gradient(to top, white 70%, ${myTheme.palette.primary.dark} 70%)`,
            },
            '.wrapper-size-specifier': {
                minHeight: '100vh',
                minWidth: '700px',
                height: '100vh',
                width: '100vw',
                display: 'inline-flex'
            }
        }
    },
}

export default myTheme;