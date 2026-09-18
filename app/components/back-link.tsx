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
            className="w-fit rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
        >
            <IoArrowBackSharp className="inline-block text-lg mr-1" /> Back to {label}
        </Link>
    );
}