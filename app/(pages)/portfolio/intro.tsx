import { GitHubIcon, LinkedInIcon } from "@/app/_components/basic/icons";
import { ArrowRightIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Intro() {
    return (
        <section id="intro" className="sm:min-w-[600px] max-w-[900px]">
            <div className="flex items-center justify-center">
                <div className="relative">
                    <Image src="/profile-pic.png" alt="Jia Jun Lee's Profile Image" 
                        width="192" height="192" quality="95" priority={true} 
                        className="h-24 w-24 rounded-full bg-slate-300 scale-90
                                hover:transition hover:duration-300 hover:opacity-90 hover:scale-100
                                border-4 border-emerald-400
                                "
                    />
                    <span className="absolute bottom-0 left-0 text-xl">👋</span>
                </div>
            </div>

            <p className="my-[2%] leading-[1.5] text-balance">
                <span>
                    Hello, I am <b>Jia Jun Lee</b>, a complex problem-solver with automation and analytical mindset, capable of self-learn and adapts to new technology/industry skills, posses various technical skillsets and ability to apply them in solution of business problems.<br/><br/>Try to resize the browser&apos;s window size for various responsiveness view.
                </span>
            </p>

            <div className="flex max-[500px]:flex-col items-center justify-center gap-6">
                <Link className="group btn btn-primary no-underline flex items-center justify-center gap-1 px-4 hover:scale-110" href="/portfolio/#contacts">
                    Contact Me <ArrowRightIcon className="h-4 group-hover:translate-x-1 transition" />
                </Link>
                <Link className="btn btn-secondary no-underline flex items-center justify-center gap-1 px-4 hover:scale-110" href="/Jia Jun Lee's CV.pdf" target="_blank" rel="noopener noreferrer" locale={false}>
                    Download CV <ArrowDownTrayIcon className="h-4" />
                </Link>
                <Link className="btn btn-secondary no-underline hover:scale-125" href="https://github.com/jiajunlee19" target="_blank" rel="noopener noreferrer">
                    <GitHubIcon className="h-6 w-6 fill-zinc-700 dark:fill-white" />
                </Link>
                <Link className="btn btn-secondary no-underline hover:scale-125" href="https://linkedin.com/in/jiajunlee19" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon className="h-6 w-6 fill-zinc-700 dark:fill-white" />
                </Link>
            </div>
        </section>
    );
};