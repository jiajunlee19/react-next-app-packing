import React from "react";
import { projects } from '@/app/_libs/data';
import Project from '@/app/(pages)/portfolio/project';

export default function Projects() {

    return (
        <section id="projects" className="scroll-mt-8">
            <h2 className="mt-0">My Projects & Achievements</h2>
            {projects.map((project, index) => {
                return (
                    <React.Fragment key={index}>
                        <Project {...project} />
                    </React.Fragment>
                )
            })}
        </section>
    );
};