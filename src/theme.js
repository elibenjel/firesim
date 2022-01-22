import { createTheme } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';
import { ThemeContext } from '@emotion/react';

const myTheme = createTheme({
    palette: {
        primary: {
            main: red['A700'],
        },
        secondary: {
            main: grey[500],
            // '&:hover': {
            //   main: 'red'
            // }
        },
        error: {
          main: red['A700'],
        },
    },
    typography: {
        // htmlFontSize: 8,
        fontWeightRegular: 550
    }
});

const paperVariantsMaker = {
    filledPaper: (suffix) => {
        return {
            props: { variant : `filled-${suffix}`},
            style: {
                backgroundImage: `radial-gradient(ellipse, ${myTheme.palette.background.paper} 70%, ${myTheme.palette[suffix].light} 100%)`,
                borderRadius: 0,
                border: `thin solid ${myTheme.palette[suffix].light}`,
                boxShadow: myTheme.shadows[0],
                margin: 24,
                padding: 32
            }
        }
    },

    densePaper: (suffix) => {
        return {
            props: { variant : `dense-${suffix}`},
            style: {
                backgroundImage: `radial-gradient(circle at center, ${myTheme.palette[suffix].light} 70%, ${myTheme.palette[suffix].dark} 100%)`,
                borderRadius: 0,
                boxShadow: myTheme.shadows[0],
                margin: 24,
                padding: 32
            }
        }
    },

    solidPaper: (suffix) => {
        return {
            props: { variant : `solid-${suffix}` },
            style: {
                backgroundImage: `linear-gradient(0deg, rgba(255, 255, 255, 0) 98%, ${myTheme.palette[suffix].dark} 100%),
                linear-gradient(180deg, rgba(255, 255, 255, 0) 98%, ${myTheme.palette[suffix].dark} 100%),
                linear-gradient(90deg, rgba(255, 255, 255, 0) 99%, ${myTheme.palette[suffix].dark} 100%),
                linear-gradient(270deg, rgba(255, 255, 255, 0) 99%, ${myTheme.palette[suffix].dark} 100%),
                linear-gradient(-45deg, rgba(255, 255, 255, 0) 90%, ${myTheme.palette[suffix].main} 100%),
                linear-gradient(135deg, rgba(255, 255, 255, 0) 90%, ${myTheme.palette[suffix].main} 100%)`,
                borderRadius: 4,
                boxShadow: myTheme.shadows[5],
                margin: 32,
                padding: 16
            }
        }
    },

    roundedPaper: (suffix) => {
        return {
            props: { variant : `rounded-${suffix}` },
            style: {
                borderRadius: 24,
                border: 'double 1rem transparent',
                backgroundImage: `linear-gradient(white, white),
                linear-gradient(45deg, ${myTheme.palette[suffix].dark} 0%, ${myTheme.palette[suffix].light} 10%, ${myTheme.palette.background.paper} 50%, ${myTheme.palette[suffix].light} 90%, ${myTheme.palette[suffix].dark} 100%)`,
                boxShadow: myTheme.shadows[1],
                margin: 32,
                padding: 16,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
            }
        }
    },

    sidePaper: (suffix) => {
        return {
            props: { variant : `side-${suffix}` },
            style: {
                backgroundImage: `linear-gradient(90deg, ${myTheme.palette[suffix].light} 0%, ${myTheme.palette.background.paper} 15%)`,
                borderTop: `thin solid`,
                borderBottom: `1.5px solid`,
                borderImage: `linear-gradient(to right, ${myTheme.palette[suffix].light} 20%, ${myTheme.palette[suffix].dark} 80%) 0.5`,
                boxShadow: myTheme.shadows[2],
                borderRadius: 8,
                margin: 24,
                padding: 32,
                paddingLeft: 80
            }
        }
    },

    reversedSidePaper: (suffix) => {
        return {
            props: { variant : `side-${suffix}`, reversed : true },
            style: {
                backgroundImage: `linear-gradient(-90deg, ${myTheme.palette[suffix].light} 0%, ${myTheme.palette.background.paper} 15%)`,
                borderTop: `thin solid`,
                borderBottom: `1.5px solid`,
                borderImage: `linear-gradient(to left, ${myTheme.palette[suffix].light} 20%, ${myTheme.palette[suffix].dark} 80%) 0.5`,
                boxShadow: myTheme.shadows[2],
                borderRadius: 8,
                margin: 24,
                padding: 32,
                paddingRight: 80
            }
        }
    }
}

const paperVariants = Object.keys(paperVariantsMaker).reduce((prev, current) => {
    const maker = paperVariantsMaker[current];
    const next = [...prev, maker('primary'), maker('secondary')];
    return next;
}, []);

myTheme.components = {
    MuiPaper: {
        variants: paperVariants,
        // styleOverrides: {
        //     elevation2: {
        //         border: 'solid',
        //         borderWidth: 2,
        //         borderColor: myTheme.palette.secondary.main,
        //         p: 1,
        //         m: 2,
        //     }
        // }
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
    
    // MuiTab: {
    //     styleOverrides: {
    //         root: {
                
    //         },
    //     }
    // },

    // Mui: {
    //     styleOverrides: {
    //         selected : {
    //             backgroundColor: myTheme.palette.grey[50],
    //             borderRadius: 2,
    //             fontWeight: 'bold',
    //             m: 1
    //         },
    //     }
    // },

    // MuiTabScrollButton: {
    //     styleOverrides: {
    //         // color: myTheme.palette.grey[50],
    //         // backgroundColor: myTheme.palette.grey[50],
    //     }
    // },


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
                width: '100%',
                display: 'inline-flex'
            }
        }
    },
}

export default myTheme;