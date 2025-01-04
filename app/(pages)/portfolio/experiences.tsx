import VerticalTimeline from "@/app/_components/basic/vertical-timeline";
import { experiences } from "@/app/_libs/data";
import React from "react";

export default function Experiences() {

    return (
        <section id="experiences" className="scroll-mt-8 w-full ">
            <h2 className="mt-0">My Experiences</h2>
            <VerticalTimeline data={experiences} />
        </section>
    );

};