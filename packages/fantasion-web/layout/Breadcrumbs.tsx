import { BreadcrumbItem, Breadcrumb as BsBreadcrumb } from "@fantasion/ui";
import type React from "react";
import { HomeIcon } from "@/content/icons";
import { Link } from "@/content/links";

type BreadcrumbLink = {
	children: React.ReactNode;
	route?: string;
	params?: Record<string, string>;
};

type BreadcrumbProps = {
	active: boolean;
	link: BreadcrumbLink;
};

type BreadcrumbsProps = {
	links: BreadcrumbLink[];
};

const Breadcrumb = ({ active, link }: BreadcrumbProps) => {
	if (link.route && !active) {
		return (
			<Link as={BreadcrumbItem} route={link.route} params={link.params}>
				{link.children}
			</Link>
		);
	}
	return <BreadcrumbItem active={active}>{link.children}</BreadcrumbItem>;
};

export const Breadcrumbs = ({ links }: BreadcrumbsProps) => (
	<BsBreadcrumb>
		<Link as={BreadcrumbItem} route="home">
			<HomeIcon />
		</Link>
		{links.map((link, index) => (
			<Breadcrumb active={index === links.length - 1} key={link.route ?? index} link={link} />
		))}
	</BsBreadcrumb>
);
