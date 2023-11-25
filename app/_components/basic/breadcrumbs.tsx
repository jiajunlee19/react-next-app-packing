import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type Breadcrumb = {
    label: string,
    href: string,
    active?: boolean,
};

export default function Breadcrumbs( { breadcrumbs }: { breadcrumbs: Breadcrumb[] } ) {
    return (
        <nav aria-label="Breadcrumb" className="my-6 mx-[2%] block">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li className="inline-flex flex-nowrap items-center" key={breadcrumb.href} aria-current={breadcrumb.active}>
                        <Link className={twMerge("no-underline", breadcrumb.active && "pointer-events-none underline font-semibold text-purple-500 dark:text-purple-200")} href={breadcrumb.href}>{breadcrumb.label}</Link>
                        {index < breadcrumbs.length -1 ?
                        <span className="mx-3 inline-block">/</span>
                         : null}
                    </li>
                ))}
        </nav>
    );
};