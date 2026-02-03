"use client";

import FlexSearch from "flexsearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Heading } from "@/content/Heading";
import { MarkdownContent } from "@/content/MarkdownContent";
import { ControlledForm } from "@/forms/Form";
import { Input } from "@/forms/Input";
import { useTranslation } from "../lib/i18n-context";
import { reverse } from "../routeMap";

type FaqItem = {
	id: string | number;
	question: string;
	shortAnswer: string;
	detailedAnswer: string;
};

type FaqsResponse = {
	results: FaqItem[];
};

const Faq = ({
	question,
	detailedAnswer,
	shortAnswer,
}: Pick<FaqItem, "question" | "detailedAnswer" | "shortAnswer">) => (
	<>
		<dt>
			<MarkdownContent>{question}</MarkdownContent>
		</dt>
		<dd>
			<div className="lead">
				<MarkdownContent>{shortAnswer}</MarkdownContent>
			</div>
			<MarkdownContent>{detailedAnswer}</MarkdownContent>
		</dd>
	</>
);

const FaqFilter = () => {
	const { t } = useTranslation();
	return (
		<ControlledForm>
			<Input autoFocus={true} name="q" label={t("faq-quick-search")} placeholder={t("faq-quick-search-placeholder")} />
		</ControlledForm>
	);
};

const createIndex = (language: string, faqs: FaqItem[]) => {
	const index = new FlexSearch.Index({
		charset: "latin:extra",
		language: language,
	});
	for (const faq of faqs) {
		index.add(faq.id, `${faq.question} ${faq.shortAnswer} ${faq.detailedAnswer}`);
	}
	return index;
};

const sortByMatch = (matchIds: Array<string | number> | null) => (a: FaqItem, b: FaqItem) =>
	matchIds ? matchIds.indexOf(a.id) - matchIds.indexOf(b.id) : 0;

export const Faqs = ({ faqs }: { faqs: FaqsResponse }) => {
	const { i18n, t } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const lang = i18n.language;

	const rawQ = searchParams.get("q");
	const decodedQuery = rawQ ? decodeURIComponent(rawQ) : "";

	const form = useForm({ defaultValues: { q: decodedQuery } });
	const q = form.watch("q") as string;

	const index = useMemo(() => createIndex(lang, faqs.results), [lang, faqs.results]);

	const matchIds = q ? (index.search(q) as Array<string | number>) : null;

	useEffect(() => {
		if (q && q !== decodedQuery) {
			const encoded = encodeURIComponent(q);
			const target = `${reverse(lang, "faq")}?q=${encoded}`;
			router.push(target);
		}
	}, [q, lang, decodedQuery, router]);

	return (
		<>
			<Heading level={1}>{t("faq-title")}</Heading>
			<FormProvider {...form}>
				<FaqFilter />
			</FormProvider>
			<dl className="mt-3">
				{faqs.results
					.filter((faq: FaqItem) => !matchIds || matchIds.includes(faq.id))
					.sort(sortByMatch(matchIds))
					.map((faq: FaqItem) => (
						<Faq
							key={faq.id}
							question={faq.question}
							shortAnswer={faq.shortAnswer}
							detailedAnswer={faq.detailedAnswer}
						/>
					))}
			</dl>
		</>
	);
};
