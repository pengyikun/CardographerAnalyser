import {FC} from "react";
// @ts-ignore
import * as d3 from 'd3'
import {
    RadarChart,
    PolarGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    PolarRadiusAxis,
    Radar, PolarAngleAxis
} from "recharts";
import * as React from "react";
import {PostProcessedCardAnalysis} from "../../types/ProcessedDataTypes";

type FrameChartChartProps = {
    usage: PostProcessedCardAnalysis
}

export const FrameChart: FC<FrameChartChartProps> = (props) => {
    const cardAnalysis = props.usage
    const domain = [0, cardAnalysis.sortedFrames.length > 0 ? cardAnalysis.sortedFrames[0].count : 1]

    return <div className="flex flex-row items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
                <RadarChart outerRadius={70} data={cardAnalysis.sortedFrames}>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="name" fontSize={"8px"} fontWeight={"700"} fontFamily={"montserrat"}/>
                    <PolarRadiusAxis angle={30} domain={domain}/>
                    <Radar name="Frame Usage" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                    <Tooltip/>
                    <Legend verticalAlign="bottom"
                            formatter={(value) => <span className="font-light text-xs">{value}</span>}/>
                </RadarChart>
            </ResponsiveContainer>
        </div>
    </div>
}