import {FC} from "react";
// @ts-ignore
import * as d3 from 'd3'
import {
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid, XAxis, YAxis, Bar
} from "recharts";
import * as React from "react";
import {PostProcessedCardAnalysis} from "../../types/ProcessedDataTypes";

type CardFrameBarChartProps = {
    usage: PostProcessedCardAnalysis
}

export const CardFrameBarChart: FC<CardFrameBarChartProps> = (props) => {
    const cardAnalysis = props.usage

    return <div className="flex flex-row items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    // width={500}
                    // height={300}
                    data={cardAnalysis.sortedFrames}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" style={{fontSize: '14px'}}/>
                    <YAxis dataKey={"count"} width={20} style={{fontSize: '8px'}}/>
                    <Tooltip/>
                    <Legend verticalAlign="top"
                            formatter={(value) => <span className="font-light text-xs">{value}</span>}/>
                    <Bar dataKey="count" fill="#8884d8" barSize={20}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
}