import Intro from "@/app/(pages)/portfolio/intro";
import About from "@/app/(pages)/portfolio/about";
import Projects from "@/app/(pages)/portfolio/projects";
import Skills from "@/app/(pages)/portfolio/skills";
import Experiences from "@/app/(pages)/portfolio/experiences";
import Contacts from "@/app/(pages)/portfolio/contacts";
import Divider from "@/app/(pages)/portfolio/divider";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Portfolio | Jia Jun Lee',
    },
    description: 'Developed by jiajunlee',
};

export default function Home() {
    return (
        <section className="flex flex-col items-center text-center">
            <h1>Portfolio | Jia Jun Lee</h1>
            <Intro />
            <Divider />

            <About />
            <Divider />

            <Experiences />
            <Divider />

            <Skills />
            <Divider />

            <Projects />
            <Divider />

            <Contacts />
            <Divider />
        </section>
    )
};