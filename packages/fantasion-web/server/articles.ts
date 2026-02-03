import { withPageProps } from "./props";

type Fetcher = (path: string) => Promise<unknown>;

export const getArticleByKey = async (fetch: Fetcher, articleKey: string) =>
	await fetch(`/static-articles/${articleKey}`);

export const createStaticArticlePageGetter = (articleKey: string) =>
	withPageProps(async ({ fetch }: { fetch: Fetcher }) => ({
		props: {
			article: await getArticleByKey(fetch, articleKey),
		},
	}));
