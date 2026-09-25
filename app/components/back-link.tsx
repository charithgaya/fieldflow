import Link from "next/link";
import { IoArrowBackSharp } from "react-icons/io5";

type BackLinkProps = {
    href: string;
    label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-10 w-full items-center justify-center gap-1 whitespace-nowrap rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800 sm:w-fit"
        >
            <IoArrowBackSharp className="text-lg" />
            Back to {label}
        </Link>
    );
}