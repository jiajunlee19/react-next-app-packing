import Image from "next/image";
import React from "react";
import { TProject } from '@/app/_libs/types';

export default function Project({ title, location, description, link, tags, imageUrl }: TProject) {

    return (
        <>
            {/* <motion.div initial={{opacity: 60, scale: 0.8}} whileInView={{opacity: 100, scale: 1}} transition={{duration: 0.8, ease: 'easeOut'}}> */}
            <section className="group card relative flex gap-4 items-start text-start px-4 pb-4 my-4 first:mt-0 last:mb-0">
                <div className="flex flex-col flex-wrap md:basis-[60%]">
                    <h3>{title}</h3>
                    <h4 className="italic">{location}</h4>
                    <p className="text-balance">{description}</p>
                    {link.toString() === "" ? <></> : 
                        <a className="mt-4 whitespace-normal" href={link} target="_blank" rel="noopener noreferrer">{title}</a>
                    }
                    <ul className="flex flex-wrap gap-2 mt-4">
                        {tags.map((tag, index) => {
                            return (
                                <li key={tag} className="card-tags">{tag}</li>
                            )
                        })}
                    </ul>
                </div>
                <div className="max-md:hidden md:flex-shrink-0 md:basis-[40%] md:relative md:mt-4 md:w-full md:min-h-[calc((100vh-56px-56px)*0.4)]">
                    <Image className="rounded-l-lg shadow-2xl scale-75 group-hover:scale-100 group-hover:transition" 
                        src={imageUrl} alt={title} fill sizes="(max-width: 768px) 0px, (max-width: 1280px) calc((100vw-256px)*0.4), calc((100vw-288px)*0.4)"
                        placeholder="blur" style={{objectFit: "cover", objectPosition: "left"}}
                    />
                </div>
            </section>
            {/* </motion.div> */}
        </>
    );

};