import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type UpdateButtonProps = {
    href: string,
};

export default function UpdateButton({ href }: UpdateButtonProps ) {
    return (
        <Link className="btn btn-primary w-min p-1 no-underline" href={href}>
            <PencilIcon className="h-5" />
        </Link>
    );
};