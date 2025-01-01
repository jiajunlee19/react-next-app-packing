import Image from "next/image";
import React from "react";
import { TProject } from '@/app/_libs/types';

export default function Project({ title, location, description, link, tags, imageUrl }: TProject) {

    return (
        // <motion.div initial={{opacity: 60, scale: 0.8}} whileInView={{opacity: 100, scale: 1}} transition={{duration: 0.8, ease: 'easeOut'}}>
        <section className="group card flex gap-4 items-start text-start px-4 pb-4 my-4 first:mt-0 last:mb-0">
            <div className="basis-[100%] md:basis-[60%] ">
                <h3>{title}</h3>
                <h4 className="italic">{location}</h4>
                <p className="text-balance">{description}</p>
                {link.toString() === "" ? <p><br /></p> : 
                    <p><br />Link to Project: <a href={link} target="_blank" rel="noopener noreferrer">{title}</a></p>
                }
                <ul className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => {
                        return (
                            <li key={tag} className="card-tags">{tag}</li>
                        )
                    })}
                </ul>
            </div>
            <div className="hidden md:block md:basis-[40%] relative">
                <Image className="rounded-l-lg shadow-2xl scale-75 group-hover:scale-100 group-hover:transition" 
                    src={imageUrl} alt={title} quality={95} fill style={{objectFit: "contain"}}
                />
                {/* sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" */}
            </div>
        </section>
        // </motion.div>
    );

};