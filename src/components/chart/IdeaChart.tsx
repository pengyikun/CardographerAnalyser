import {FC} from "react";
// @ts-ignore
import * as d3 from 'd3'
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import * as React from "react";
import {CASnapshotCardAnalyseWithCount} from "../../types/ProcessedDataTypes";
import {format, parseISO} from "date-fns";

type IdeaChartProps = {
    usage: CASnapshotCardAnalyseWithCount[]
}

export const IdeaChart: FC<IdeaChartProps> = (props) => {
    const cardHistoricalData = props.usage

    const data = cardHistoricalData.map((snapshot) => {
        return {
            ...snapshot,
            //snapshotId: snapshot.snapshotId.slice(-3),
            date: format(parseISO(snapshot.date), 'dd/MM hh:mm:ss')
        }
    })
    console.log(data)

    return <div className="flex flex-row items-center justify-center">
        <div className="w-full">
            <ResponsiveContainer width="95%" height={200}>
                <AreaChart
                    data={data}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    {/*<XAxis dataKey="snapshotId" interval={0} style={{fontSize: '8px'}}/>*/}
                    <XAxis dataKey="snapshotId"
                           style={{fontSize: '8px'}}/>
                    <YAxis dataKey="ideaCount" width={20} style={{fontSize: '8px'}}/>
                    <Tooltip/>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <Legend verticalAlign="top"
                            formatter={(value) => <span className="font-light text-xs">{value}</span>}/>
                    {/*<Line type="monotone" dataKey="count" stroke="#ff7300" yAxisId={0}/>*/}
                    {/*<Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1}/>*/}
                    <Area name="Idea count" type="monotone" dataKey="ideaCount"
                          stroke="#8884d8" fillOpacity={1}
                          fill="url(#colorUv)"/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
}