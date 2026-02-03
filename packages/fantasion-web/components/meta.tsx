"use client";

type MetaPageProps = {
	title: string;
	description?: string;
};

type MetaUrlProps = {
	noRobots?: boolean;
	url: string;
};

// In App Router, metadata is handled via the metadata export in layout.tsx/page.tsx
// These components are kept for backwards compatibility but are now no-ops
// For dynamic metadata in App Router, use generateMetadata in server components

export const MetaBase = () => null;

export const MetaPage = ({ description: _description = "", title: _title }: MetaPageProps) => null;

export const MetaUrl = ({ noRobots: _noRobots, url: _url }: MetaUrlProps) => null;
