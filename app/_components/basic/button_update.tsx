import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type UpdateButtonProps = {
    href: string,
};

export default function UpdateButton({ href }: UpdateButtonProps ) {
    return (
        <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={href}>
            <button className="btn-primary w-min p-1">
                <PencilIcon className="h-5" />
            </button>
        </Link>
    );
};