import * as React from "react";

interface CardAnalysisDataBoxProps {
    title: string,
    data: string,
    titleFontSize?: string,
    dataFontSize?: string
}

export const CardAnalysisDataBox = ({title, data, dataFontSize, titleFontSize}: CardAnalysisDataBoxProps) => {
    return (
        <div className="grow rounded-md border bg-gray-200 px-7 py-2 mr-3 mb-3 shadow-sm">
            <div className="flex flex-col items-center justify-center">
                            <span className={`font-montserrat font-light ${dataFontSize ? dataFontSize : 'text-3xl'}`}>
                                {data}
                            </span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <span
                    className={`text-cardographerThemeBG font-montserrat font-bold tracking-wide ${titleFontSize ? titleFontSize : 'text-sm'}`}>{title}</span>
            </div>
        </div>
    )
}