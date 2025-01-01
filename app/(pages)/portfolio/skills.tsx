import { skills } from "@/app/_libs/data";
import Skill from "@/app/(pages)/portfolio/skill";

export default function Skills() {

    return (
        <section id="skills" className="scroll-mt-8 sm:min-w-[600px] max-w-[900px]">
            <h2 className="mt-0">My Skills</h2>
            <ul className="flex flex-wrap gap-2 justify-center">
                {skills.map((skill, index) => {
                    return (
                        <Skill key={skill} skill={skill} index={index} /> 
                    );
                })}
            </ul>
        </section>
    );

};