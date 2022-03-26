import React, { useState, useEffect, useRef } from 'react';
import { t as tradF } from 'i18next';
import { Box, Paper, Typography } from '@mui/material';
import {
    RemoveCircleOutline,
    Undo,
    Add,
    Remove,
    Clear,
} from '@mui/icons-material';

import ProfileManager from '../../components/MainSim/ProfileManager.jsx';
import { manageMarket } from '../../services/simulation.js';
import ControlButton from "../../components/MainSim/ControlButton.jsx";

const t = (arg) => tradF(arg, { ns : 'MainSim' });
const minYear = new Date().getFullYear();
const maxIgr = 30;
const maxIr = 6;
const unitConversion = 10;
const padding = 2;
const svgViewBox = [0, - maxIgr*unitConversion - padding, 100, 2 * maxIgr*unitConversion + padding];
const arrowWidth = 5;
const arrowHeight = 8;
const getArrowCoordinates = (posX, headY) => {
    return {
        body: {
            x1: posX,
            y1: 0,
            x2: posX,
            y2: headY
        },
        headLeft: {
            x1: - arrowWidth + posX,
            y1: headY + (headY < 0 ? 1 : -1) * arrowHeight,
            x2: posX,
            y2: headY
        },
        headRight: {
            x1: arrowWidth + posX,
            y1: headY + (headY < 0 ? 1 : -1) * arrowHeight,
            x2: posX,
            y2: headY
        }
    }
}
const drawArrow = (args) => (
    <>
        <line {...args.body} {...args.style} />
        <line {...args.headLeft} {...args.style} />
        <line {...args.headRight} {...args.style} />
        <text {...args.valueLabel} />
    </>
);

const Typo = ({ children, ...other }) => {
    return <Typography variant='h10' textAlign='center' {...other} >{children}</Typography>
}

const Arrow = (props) => {
    const { posX, headY, minHeadY, maxHeadY, mySvgID, myRect, setState, fillBackground, textBackground, valueLabel } = props;
    const color = (headY, op) => headY > 0 ? `rgba(170,0,0,${op}%)` : `rgba(0,110,0,${op}%)`;

    const [arrow, setArrow] = useState({
        headY,
        style: {
            stroke: color(headY, 80),
            strokeWidth: headY === 0 ? 0 : 1.5
        },
        valueLabel: { ...valueLabel, fill: color(headY, 100) },
        ...getArrowCoordinates(posX, headY)
    });

    const [arrowPreviz, setArrowPreviz] = useState({
        ...arrow,
        style: {
            ...arrow.style,
            stroke: color(0, 50),
            strokeWidth: 0
        }
    });

    const [rectStyle, setRectStyle] = useState({});
    const [showTextBackground, setShowTextBackground] = useState(false);
    const textBackgroundX = posX < 50 ? 30 : 85;
    const textBackgroundY = 0;

    const onMouseMove = (event) => {
        const mySvg = document.getElementById(mySvgID);
        const pt = mySvg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const headPoint = pt.matrixTransform(mySvg.getScreenCTM().inverse());
        let newHeadY = Math.round(headPoint.y / unitConversion) * unitConversion;
        if (newHeadY > maxHeadY) {
            newHeadY = maxHeadY;
        } else if (newHeadY < minHeadY) {
            newHeadY = minHeadY;
        }

        setArrowPreviz(current => {
            return {
                ...current,
                headY: newHeadY,
                style: { ...current.style, strokeWidth: newHeadY === 0 ? 0 : 2, stroke : color(newHeadY, 50) },
                ...getArrowCoordinates(posX, newHeadY)
            }
        });

        setRectStyle({ strokeDasharray : '5,5', strokeWidth : 1.5, stroke : color(newHeadY, 80) });
        setShowTextBackground(true);
    }

    const onMouseEnter = () => {
        setArrow(current => {
            return { ...current, style: { ...current.style, stroke : color(headY, 100) } };
        });

        setRectStyle({strokeDasharray : '5,5', strokeWidth : 1.5, stroke : color(headY, 80) });
        setShowTextBackground(true);
    }

    const onMouseLeave = () => {
        setArrow(current => {
            return { ...current, style: { ...current.style, stroke : color(headY, 80) } };
        });

        setArrowPreviz(current => {
            return { ...current, style: { ...current.style, strokeWidth : 0 } };
        });

        setRectStyle({});
        setShowTextBackground(false);
    }

    const onClick = () => {
        setState(- arrowPreviz.headY / unitConversion)
    }

    const handlers = { onMouseMove, onMouseEnter, onMouseLeave, onClick };

    return (
        <>
            <rect {...myRect} fill={fillBackground} />
            <rect x={myRect.x + 2} y={Math.max(minHeadY - 10, svgViewBox[1] + 1)} width={'46%'} height={Math.min(svgViewBox[3] - 2, maxHeadY - minHeadY + 20)} {...rectStyle} fill='transparent' />
            {
                showTextBackground ?
                <text x={textBackgroundX} y={textBackgroundY} textAnchor='middle'
                transform={`rotate(-90,${textBackgroundX},${textBackgroundY})`}
                letterSpacing={4} fillOpacity='30%' fontSize='larger'
                children={textBackground} />
                : null
            }
            <rect {...myRect} {...handlers} fill='transparent' />
            {drawArrow(arrow)}
            {drawArrow(arrowPreviz)}
        </>
    )
}

const MarketYear = (props) => {
    const { start, end, igr, setIgr, ir, setIr, myIndex, enlarge, disableEnlarge, shrink, disableShrink, remove, disableRemove } = props;
    
    const mySvgID = `market-year-svg-${myIndex}`;

    const labelText = end < start ? `${start} +` : (start === end ? `${start}` : [start, end].join('🠒'));
    const base = { x1 : svgViewBox[2] * 0.35, x2 : svgViewBox[2] * 0.65, y1 : 0, y2 : 0, stroke : '#000', strokeWidth : 3 };
    const arrowIgr = {
        posX: 0.4*svgViewBox[2],
        headY: - (igr * unitConversion),
        minHeadY: - maxIgr * unitConversion,
        maxHeadY: maxIgr * unitConversion,
        mySvgID,
        myRect: { x : 0, y : svgViewBox[1], width : '50%', height : '100%'},
        setState: setIgr,
        textBackground: t('igr').toUpperCase(),
        fillBackground: myIndex % 2 ? 'rgb(230,230,230)' : 'rgba(0,0,0,0)',
        valueLabel: { x : 17.5, y : 4, fontSize: 'smaller', textAnchor: 'middle', children : `${igr}%` }
    };

    const arrowIr = {
        posX: 0.6*svgViewBox[2],
        headY: - (ir * unitConversion),
        minHeadY: - maxIr * unitConversion,
        maxHeadY: 0,
        mySvgID,
        myRect: { x : svgViewBox[2] / 2, y : svgViewBox[1], width : '50%', height : '100%'},
        setState: setIr,
        textBackground: t('ir').toUpperCase(),
        fillBackground: myIndex % 2 ? 'rgb(230,230,230)' : 'rgba(0,0,0,0)',
        valueLabel: { x : 85, y : 4, fontSize: 'smaller', textAnchor: 'middle', children : `${ir}%` }
    }

    return (
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='flex-end'
            m={1} height='100%' width={90} >
            <svg id={mySvgID} viewBox={svgViewBox.join(' ')}>
                <Arrow {...arrowIgr} />
                <Arrow {...arrowIr} />
                <line {...base} />
            </svg>
            <Typo width='100%' mt={1} >{labelText}</Typo>
            <Box display='flex' justifyContent='space-evenly' alignItems='center' width='100%' mt={1}>
                <ControlButton onClick={shrink} icon={<Remove fontSize='small' />} disabled={disableShrink} />
                <ControlButton onClick={enlarge} icon={<Add fontSize='small' />} disabled={disableEnlarge} />
            </Box>
            <ControlButton onClick={remove} icon={<Clear fontSize='small' />} disabled={disableRemove} sx={{ alignSelf : 'center' }} />
        </Box>
    );
}

const AddYearButton = (props) => {
    const { title, add, ...other } = props;

    const handleClick = (event) => {
        add();
    }

    const sxIcon = {
        fill: (theme) => theme.palette.secondary.dark,
        border: 'solid',
        borderRadius:'50%',
        borderColor: (theme) => theme.palette.secondary.dark
    }

    const sxDisabledIcon = {};

    return (
        <ControlButton title={title} onClick={handleClick}
            icon={<Add fontSize='large' sx={other.disabled ? sxDisabledIcon : sxIcon} />} {...other} />
    )
}

const MarketProfile = (props) => {
    const {
        initial,
        trackProfileData, setIsProfileLocked
    } = props;

    const [marketGrowth, setMarketGrowth] = useState(
        Object.values(initial.variations)
        .reduce((prev, { year, igr, ir }) => ({ ...prev, [year] : { igr, ir } }), {})
    );
    const modificationCounter = useRef({}); // used for the key prop of each MarketYear
    const setRate = (rateName) => (year) => (value) => {
        if (modificationCounter.current[year]) {
            modificationCounter.current[year] += 1;
        } else {
            modificationCounter.current[year] = 1;
        }
        setMarketGrowth(current => {
            return {
                ...current,
                [year]: {
                    ...current[year],
                    [rateName]: value
                }
            }
        });
    }

    useEffect(() => {
        setIsProfileLocked(true);
    }, []);

    const setIgr = setRate('igr');
    const setIr = setRate('ir');

    // default value for igr and ir
    let lastIgr = 8;
    let lastIr = 2;

    // retrieve the years for which igr and/or ir are specified
    const years = [ ...new Set(Object.keys(marketGrowth).map((year) => parseInt(year, 10))) ];
    years.sort((prev, next) => prev < next ? -1 : 1);
    
    // build the props for each MarketYear to render
    const marketYears = [];
    years.forEach((start, index, years) => {
        let { igr, ir } = marketGrowth[start];
        if (igr) {
            lastIgr = igr;
        } else {
            igr = lastIgr;
        }

        if (ir) {
            lastIr = ir;
        } else {
            ir = lastIr;
        }

        const end = years[index+1] || 0;
        const enlargeLeft = () => {
            if (index === 0 || start - years[index - 1] === 1) {
                return
            }
            setMarketGrowth((current) => {
                return {
                    ...current,
                    [start-1]: current[start]
                }
            });
        }

        const enlarge = () => {
            // if (index === years.length - 1) {
            //     return
            // }

            setMarketGrowth((current) => {
                const newState = {};
                Object.keys(current).forEach((year) => {
                    const value = parseInt(year, 10);
                    if (value > start) {
                        newState[value + 1] = current[value];
                    } else {
                        newState[value] = current[value];
                    }
                });
                return newState;
            });
        }

        const shrink = () => {
            // if (index === years.length - 1 || years[index + 1] - start === 1) {
            //     return
            // }

            setMarketGrowth((current) => {
                const newState = {
                    ...current,
                    [years[index + 1] - 1]: current[years[index + 1]]
                };
                delete newState[years[index + 1]];
                return newState;
            });
        }

        const remove = () => {
            setMarketGrowth((current) => {
                const newState = { ...current };
                delete newState[start];
                if (index === 0) {
                    newState[minYear] = newState[years[1]];
                    delete newState[years[1]];
                }
                return newState;
            });
        }

        marketYears.push({
            start, end: end - 1, igr, setIgr : setIgr(start), ir, setIr : setIr(start),
            enlarge, shrink, remove,
            disableEnlarge: index === years.length - 1,
            disableShrink: index === years.length - 1 || years[index + 1] - start === 1,
            disableRemove: years.length === 1
        });
    });

    const addYear = () => {
        const lastYear = marketYears.at(-1);
        const newYear = lastYear.start - - 1;
        setMarketGrowth((current) => {
            return {
                ...current,
                [newYear]: { igr : lastIgr, ir : lastIr}
            }
        });
    }

    trackProfileData(marketGrowth);

    return (
        <Box display='flex' alignItems='flex-start' justifyContent='space-evenly' component={Paper} elevation={0} p={1} m={2} >
            {
                marketYears.map((marketYearProps, index) => {
                    const { start, end } = marketYearProps;
                    const key = [start, modificationCounter.current[start], end, modificationCounter.current[end]];
                    return (
                        <MarketYear key={key} {...marketYearProps} myIndex={index} />
                        // <ResetButton /> // reset that year to the state of the preceding year
                        // showed only for years that differ from the preceding
                    );
                })
            }
            <AddYearButton title={t('add')} add={addYear} sx={{ mt : 16 }} />
        </Box>
        // <MarketYearPopUp addMarketYear={add} /> // popup wrapping a MarketYear and maintaining its own igr and ir state
        // <GlobalController setCondensedDisplay={setCondensedDisplay} /> // contains two buttons to condense or spread the display
        // setCondensedDisplay also removes from marketGrowth the years that have same igr and ir than the preceding
    );
}

// const initialProfileData = { igr: { 2022 : 8 }, ir : { 2022 : 2 } };
const initialProfileData = { variations : [{ year : 2022, igr : 8, ir : 2 }] };

const Market = (props) => {

    const profileData = useRef({});
    const trackProfileData = (data) => {
        profileData.current = {
            variationsValue : Object.entries(data).map(([year, { igr, ir }]) => ({ year : parseInt(year, 10), igr, ir }))
        };
    }

    const profileManagerProps = {
        tradHook: t,
        initialProfileData,
        managerFunctions: manageMarket,
        profileData
    }

    return (
        <ProfileManager {...profileManagerProps} >
            {
                ({ key, props }) => <MarketProfile key={key} {...props} trackProfileData={trackProfileData} />
            }
        </ProfileManager>
    );
}

export default Market;