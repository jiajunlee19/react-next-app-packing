import { TSkill } from "@/app/_libs/types";

type SkillProps = {
    skill: TSkill,
    index: number,
}

export default function Skill({ skill, index }: SkillProps) {

    return (
        <li key={skill} className="card-tags"
            // initial={{opacity: 0, y: 100}} whileInView={{opacity: 100, y: 0}} 
            // transition={{duration: 0.8, delay: 0.03*index}} viewport={{once: true}}
        >
            {skill}
        </li>
    );

};