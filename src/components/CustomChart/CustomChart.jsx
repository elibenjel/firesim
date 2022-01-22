import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Chart,
    Layer,
    Ticks,
    Bars,
    Animate,
    Handlers,
    Dots
} from 'rumble-charts';

const CustomChart = (props) => {
    const { series, setSeries, width, height, minY, maxY, ticks, ...rest } = props;
    const theme = useTheme();
    let factor = 1;
    while ((maxY / factor) > 10) {
        console.log(maxY, factor)
        factor *= 10;
    }
    const mY = Math.ceil(maxY/factor)*factor;

    return (
        <Chart
            width={width}
            height={height}
            series={series}
            minY={minY}
            maxY={mY}
            style={{
                fontFamily: 'sans-serif',
                fontSize: theme.typography.fontSize
            }}
            {...rest}
        >
            {/* <Animate _ease='elastic'> */}
            <Layer width='80%' height='80%' position="middle center">
                <Ticks
                    axis="y"
                    lineLength="100%"
                    lineVisible
                    lineStyle={{
                        stroke: theme.palette.secondary.light
                    }}
                    labelStyle={{
                        dominantBaseline: 'middle',
                        fill: theme.palette.secondary.dark,
                        textAnchor: 'end'
                    }}
                    labelAttributes={{
                        x: -5
                    }}
                />
                <Ticks
                    axis="x"
                    ticks={[ ...Array(ticks).keys() ]}
                    label={(dataPoint) => {
                        const startYear = new Date().getFullYear();
                        const curr = dataPoint.tick.x;
                        if (dataPoint.ticksLength <= 5) return curr + startYear;
                        if (dataPoint.ticksLength <= 10) return curr % 2 === 0 ? curr + startYear : '';
                        return curr % 5 === 0 ? curr + startYear : '';
                    }}
                    labelStyle={{
                        dominantBaseline: 'text-before-edge',
                        fill: theme.palette.secondary.dark,
                        textAnchor: 'middle'
                    }}
                    labelAttributes={{
                        y: 3
                    }}
                />
                <Bars
                    // groupPadding='0.5%'
                    // innerPadding='2%'
                    colors={[theme.palette.primary.dark]}
                    barAttributes={{
                        onMouseMove: e => e.target.style.fillOpacity = 1,
                        onMouseLeave: e => e.target.style.fillOpacity = 0.5
                    }}
                    barStyle={{
                        fillOpacity: 0.5,
                        transitionProperty: 'opacity',
                        transitionDuration: '250ms'
                    }}
                    barWidth={`${Math.min(15, 80/ticks)}%`}
                />
            </Layer>
            {/* </Animate> */}
        </Chart>
    )
}

export default CustomChart;