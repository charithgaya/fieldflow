import Image from "next/image";

type FieldFlowLogoProps = {
    className?: string;
};

export default function FieldFlowLogo({
    className = "",
}: FieldFlowLogoProps) {
    return (
        <Image
            src="/logo.png"
            alt="FieldFlow - Field Service Management"
            width={1540}
            height={449}
            className={className}
            priority
        />
    );
}