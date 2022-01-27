import { createTheme } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

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
}, [
    {
        props: { variant : 'simple' },
        style: {
            borderRadius: 4,
            boxShadow: myTheme.shadows[2],
            margin: 24,
            padding: 32
        }
    }
]);

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
                backgroundColor: '#FF0000',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 1000'%3E%3Cg %3E%3Ccircle fill='%23FF0000' cx='50' cy='0' r='50'/%3E%3Cg fill='%23ff3939' %3E%3Ccircle cx='0' cy='50' r='50'/%3E%3Ccircle cx='100' cy='50' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ff5151' cx='50' cy='100' r='50'/%3E%3Cg fill='%23ff6363' %3E%3Ccircle cx='0' cy='150' r='50'/%3E%3Ccircle cx='100' cy='150' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ff7272' cx='50' cy='200' r='50'/%3E%3Cg fill='%23ff8080' %3E%3Ccircle cx='0' cy='250' r='50'/%3E%3Ccircle cx='100' cy='250' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ff8c8c' cx='50' cy='300' r='50'/%3E%3Cg fill='%23ff9797' %3E%3Ccircle cx='0' cy='350' r='50'/%3E%3Ccircle cx='100' cy='350' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ffa1a1' cx='50' cy='400' r='50'/%3E%3Cg fill='%23ffabab' %3E%3Ccircle cx='0' cy='450' r='50'/%3E%3Ccircle cx='100' cy='450' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ffb4b4' cx='50' cy='500' r='50'/%3E%3Cg fill='%23ffbdbd' %3E%3Ccircle cx='0' cy='550' r='50'/%3E%3Ccircle cx='100' cy='550' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ffc6c6' cx='50' cy='600' r='50'/%3E%3Cg fill='%23ffcece' %3E%3Ccircle cx='0' cy='650' r='50'/%3E%3Ccircle cx='100' cy='650' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ffd5d5' cx='50' cy='700' r='50'/%3E%3Cg fill='%23ffdddd' %3E%3Ccircle cx='0' cy='750' r='50'/%3E%3Ccircle cx='100' cy='750' r='50'/%3E%3C/g%3E%3Ccircle fill='%23ffe4e4' cx='50' cy='800' r='50'/%3E%3Cg fill='%23ffebeb' %3E%3Ccircle cx='0' cy='850' r='50'/%3E%3Ccircle cx='100' cy='850' r='50'/%3E%3C/g%3E%3Ccircle fill='%23fff2f2' cx='50' cy='900' r='50'/%3E%3Cg fill='%23fff9f9' %3E%3Ccircle cx='0' cy='950' r='50'/%3E%3Ccircle cx='100' cy='950' r='50'/%3E%3C/g%3E%3Ccircle fill='%23FFFFFF' cx='50' cy='1000' r='50'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundAttachment: 'fixed',
                backgroundSize: 'contain'
                /* background by SVGBackgrounds.com */
            },
            '.wrapper-size-specifier': {
                minHeight: '100vh',
                minWidth: '99vw',
                // // height: '100vh',
                // width: '100%',
                display: 'flex'
            }
        }
    },
}

myTheme.cssVariables = {
    appBarWidth : 150,
}

export default myTheme;

