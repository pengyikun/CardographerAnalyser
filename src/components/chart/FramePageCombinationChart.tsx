import {FC, useState} from "react";
// @ts-ignore
import * as d3 from 'd3'
import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector
} from "recharts";
import * as React from "react";
import {CACardAnalyse} from "../../types/ProcessedDataTypes";

type FramePageCombinationChartProps = {
    usage: { content: string, title: string, combinations: CACardAnalyse[], count: number }[]
}

// https://recharts.org/en-US/examples/CustomActiveShapePieChart
const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent} = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.title}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                  fill="#333" fontSize={8}>{`${payload.content}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        </g>
    );
};

export const FramePageCombinationChart: FC<FramePageCombinationChartProps> = (props) => {
    const {usage} = props
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index)
    };


    return (
        <ResponsiveContainer width="95%" height={300}>
            <PieChart width={150} height={250}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={usage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    onMouseEnter={onPieEnter}
                />
            </PieChart>
        </ResponsiveContainer>
    );

}