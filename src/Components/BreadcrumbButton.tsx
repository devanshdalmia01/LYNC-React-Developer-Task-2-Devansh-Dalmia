import { FC } from "react";

const BreadcrumbButton: FC<{ name: string }> = ({ name }: { name: string }) => {
    return <button className="text-xl font-semibold">{name}</button>;
};

export default BreadcrumbButton;
