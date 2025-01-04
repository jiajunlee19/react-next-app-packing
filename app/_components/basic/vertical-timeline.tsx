import React from "react";

type VerticalTimelineProps = {
    data: {
        title: string,
        description: string,
        location: string,
        icon: React.ReactElement,
        date: string,
    }[];
};

export default function VerticalTimeline({ data }: VerticalTimelineProps) {

    return (

        // vertical-timeline
        // after:animate-expand
        <section className="relative max-sm:min-w-[320px] max-[350px]:min-w-[100vw]
            after:content-[''] after:absolute after:top-0 after:left-[50%] after:w-1 after:h-full after:-translate-x-[50%] 
            after:bg-black after:dark:bg-white
            after:max-sm:left-8 
            max-[350px]:after:hidden
        ">
            {data.map((d, index) => {
                return (

                    <React.Fragment key={index}>

                        {/* container */}
                        {/* animate-movedown [&:nth-child(3)]:animation-delay-0 */}
                        <div className="relative w-[50%] px-10 py-8 sm:odd:left-0 sm:even:left-[50%] group
                            max-sm:w-[100%] max-sm:left-8
                            max-[350px]:px-0 max-[350px]:left-0
                        ">

                            {/* icon */}
                            <div className="absolute w-10 top-8 sm:left-[100%] sm:group-even:left-0 -translate-x-[50%]
                                max-sm:left-0
                                max-[350px]:hidden
                            ">
                                {d.icon}
                            </div>

                            {/* text-box */}
                            <div className="relative border-4 rounded-md px-4 pb-2 text-start justify-start text-balance
                                bg-gray-100 border-black/30 dark:bg-slate-600 dark:border-white/30
                            ">
                                <h3>{d.title}</h3>
                                <h4 className="italic">{d.location}</h4>
                                <p>{d.description}</p>
                                {/* date time for double-column */}
                                <h4 className="italic sm:hidden">{d.date}</h4>
                            </div>

                            {/* date time for single-column */}
                            <h4 className="hidden sm:block absolute bottom-0 px-4">{d.date}</h4>

                            {/* arrow */}
                            <span className="absolute h-0 w-0 top-8
                                border-[calc(40px/2)] border-solid border-t-transparent border-b-transparent 
                                sm:group-odd:border-l-red-700 sm:group-odd:border-r-0 sm:group-odd:right-[calc(16px+4px)]
                                sm:group-even:border-r-red-700 sm:group-even:border-l-0 sm:group-even:left-[calc(16px+4px)]
                                max-sm: border-r-red-700 max-sm:border-l-0 max-sm:left-[calc(40px/2)]
                                max-[350px]:hidden
                            "></span>
                            
                        </div>

                    </React.Fragment>

                );
            })}

        </section>

    );
};