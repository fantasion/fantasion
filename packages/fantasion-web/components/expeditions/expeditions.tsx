"use client";

import { Button, Col, Container, Row } from "@fantasion/ui";
import classnames from "classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "@/datetime/DateRange";
import { ArticleBody } from "../../content/Article";
import { Heading } from "../../content/content";
import { Link } from "../../content/links";
import { PriceLabel } from "../../content/money/PriceLabel";
import { useTranslation } from "../../lib/i18n-context";
import { reverse } from "../../routeMap";
import { slug } from "../../slugs";
import { InteractiveButton } from "../buttons";
import { useActiveOrder, useSetActiveOrder, useSite, useToasts } from "../context";
import { LocationFuzzyName } from "../locations";
import { SignupDialog } from "../signups";
import { isBatchAvailable } from "./batches";
import styles from "./expeditions.module.scss";
import { TroopLabel } from "./troops";

export type Price = {
	id: number;
	price: number | string;
	active: boolean;
	expired?: boolean;
	future?: boolean;
	availableSince?: string | null;
	availableUntil?: string | null;
};

export type AgeGroup = {
	title?: string;
	ageMin: number;
	ageMax: number;
};

export type TroopType = {
	id: number;
	ageGroup: AgeGroup;
	startsAt: string;
	endsAt: string;
	priceIncludes?: string | null;
	prices: Price[];
};

export type Location = {
	fuzzyName?: string | null;
	title?: string | null;
};

export type LeisureCentre = {
	id: number;
	title: string;
	location?: Location | null;
};

export type ExpeditionThemeType = {
	id: number;
	title: string;
	description: string;
};

export type ExpeditionBatchType = {
	id: number;
	startsAt: string;
	endsAt: string;
	leisureCentre?: LeisureCentre | null;
	troops: TroopType[];
};

export type ExpeditionType = {
	id: number;
	title: string;
	description?: string | null;
	theme?: ExpeditionThemeType | null;
	batches?: ExpeditionBatchType[];
};

type Participant = {
	id: number;
	firstName?: string;
	lastName?: string;
	name?: string;
};

type SignupValues = {
	batchId: number;
	troopId: number;
	legalGuardian: boolean;
	note?: string;
	participantId?: number | null;
};

type TroopProps = {
	ageMin: number;
	ageMax: number;
	startsAt: string;
	endsAt: string;
	priceIncludes?: string | null;
};

const Troop = ({ ageMin, ageMax, startsAt, endsAt }: TroopProps) => (
	<div>
		<TroopLabel ageMin={ageMin} ageMax={ageMax} startsAt={startsAt} endsAt={endsAt} />
	</div>
);

const shouldOpen = (
	searchParams: ReturnType<typeof useSearchParams>,
	batch: ExpeditionBatchType | null | undefined,
	troop: TroopType | null | undefined,
) => {
	const signup = searchParams?.get("signup");
	if (!signup) {
		return false;
	}
	const signupId = Number.parseInt(signup, 10);
	return troop ? signupId === troop.id : signupId === batch?.id;
};

type SignupButtonProps = {
	expedition: ExpeditionType;
	batch: ExpeditionBatchType;
	troop?: TroopType | null;
};

export const SignupButton = ({ expedition, batch, troop }: SignupButtonProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [show, setShow] = useState(false);
	const { t } = useTranslation();
	const { fetch, lang, user } = useSite();
	const [participants, setParticipants] = useState<Participant[]>([]);
	const order = useActiveOrder();
	const setOrder = useSetActiveOrder();
	const hideDialog = () => setShow(false);
	const toasts = useToasts();
	const loginFirst = () => {
		const redirectPath = reverse(lang, "expeditionDetail", {
			expeditionSlug: slug(expedition),
		});
		const query = `?signup=${(troop || batch).id}`;
		const redirectTo = `${redirectPath}${query}`;
		router.push(`${reverse(lang, "login")}?redirectTo=${encodeURIComponent(redirectTo)}`);
	};
	const showDialog = useCallback(async () => {
		const p = await fetch("/participants");
		setParticipants(p.results as Participant[]);
		setShow(true);
	}, [fetch]);
	useEffect(() => {
		if (!show && shouldOpen(searchParams, batch, troop)) {
			showDialog();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [batch, searchParams, show, showDialog, troop]);
	const addParticipant = (participant: Participant) => {
		setParticipants([...participants, participant]);
	};
	const createSignup = async (values: SignupValues) => {
		await fetch.post("/signups", {
			body: {
				...values,
				orderId: order?.id,
			},
		});
		const o = await fetch("/orders/active");
		toasts.add({
			subject: t("signup-was-created"),
			message: t("signup-created-buy-it"),
			persistent: true,
			priority: "high",
			actions: [
				{
					message: t("go-to-basket"),
					route: "basket",
				},
			],
		});
		// Remove the signup query param by navigating to the current path
		router.replace(pathname);
		setOrder(o);
		hideDialog();
	};
	const batches = expedition.batches || [batch];
	return (
		<>
			<SignupDialog
				expedition={expedition}
				batch={batch}
				batches={batches}
				troop={troop}
				show={show}
				participants={participants}
				onAddParticipant={addParticipant}
				onCreateSignup={createSignup}
				onHide={hideDialog}
				onCancel={hideDialog}
			/>
			<InteractiveButton className={styles.signupButton} onClick={user ? showDialog : loginFirst}>
				{t("signup-to-expedition")}
			</InteractiveButton>
		</>
	);
};

type ExpeditionBatchProps = {
	batch: ExpeditionBatchType;
	expedition: ExpeditionType;
};

type LowestPrice = {
	price: number;
};

const parsePriceValue = (priceValue: unknown): number | null => {
	if (priceValue === undefined) {
		return null;
	}
	if (typeof priceValue === "number") {
		return priceValue;
	}
	return Number.parseFloat(String(priceValue));
};

const ExpeditionBatch = ({ batch, expedition }: ExpeditionBatchProps) => {
	const { t } = useTranslation();
	const lowestPrice: LowestPrice | null = batch.troops.reduce<LowestPrice | null>((aggr, troop) => {
		const priceObj = troop.prices.find((p) => p.active);
		const priceValue = priceObj?.price;
		const price = parsePriceValue(priceValue);
		if (price === null) {
			return aggr;
		}
		if (!aggr || aggr.price > price) {
			return { price: price };
		}
		return aggr;
	}, null);
	return (
		<Container className={classnames("mt-3", styles.batch)}>
			<Row>
				<Col lg={6}>
					<Heading level={3}>
						<Link route="expeditionBatchDetail" params={{ expeditionBatchSlug: slug(batch.id, expedition.title) }}>
							<DateRange start={batch.startsAt} end={batch.endsAt} />
						</Link>
					</Heading>
					<p>
						{batch.leisureCentre?.location ? (
							<LocationFuzzyName
								location={{
									...batch.leisureCentre.location,
									fuzzyName: batch.leisureCentre.location.fuzzyName ?? undefined,
								}}
							/>
						) : null}
					</p>
					<div>
						{batch.troops.map((troop: TroopType) => (
							<Troop
								key={troop.id}
								ageMax={troop.ageGroup.ageMax}
								ageMin={troop.ageGroup.ageMin}
								endsAt={troop.endsAt}
								startsAt={troop.startsAt}
								priceIncludes={troop.priceIncludes}
							/>
						))}
					</div>
					{lowestPrice && (
						<p>
							<PriceLabel price={lowestPrice.price} />
						</p>
					)}
				</Col>
				<Col className={styles.batchButtons} lg={6}>
					{isBatchAvailable(batch) ? <SignupButton expedition={expedition} batch={batch} /> : null}
					<Link
						as={Button}
						className={styles.detailsButton}
						size="md"
						variant="secondary"
						route="expeditionBatchDetail"
						params={{ expeditionBatchSlug: slug(batch.id, expedition.title) }}
					>
						{t("expedition-batch-more-info")}
					</Link>
				</Col>
			</Row>
		</Container>
	);
};

type ExpeditionBatchesProps = {
	expedition: ExpeditionType;
	batches: ExpeditionBatchType[];
};

export const ExpeditionBatches = ({ expedition, batches }: ExpeditionBatchesProps) => {
	const { t } = useTranslation();
	if (batches.length === 0) {
		return null;
	}
	return (
		<div className="mt-3">
			<Heading level={2}>{t("expedition-batches")}</Heading>
			{batches.map((batch: ExpeditionBatchType) => (
				<ExpeditionBatch batch={batch} expedition={expedition} key={batch.id} />
			))}
		</div>
	);
};

export const getDefaultBase = (batches: ExpeditionBatchType[]): LeisureCentre | null => {
	const defaultBatch = batches[0];
	const defaultId = defaultBatch?.leisureCentre?.id;
	const allEqual = batches.every((batch) => batch?.leisureCentre?.id === defaultId);
	return allEqual ? (defaultBatch?.leisureCentre ?? null) : null;
};

type ExpeditionThemeProps = {
	theme: ExpeditionThemeType;
};

export const ExpeditionTheme = ({ theme }: ExpeditionThemeProps) => {
	const { t } = useTranslation();
	return (
		<section className="mt-3">
			<header>
				<Heading level={2}>
					<Link
						route="adventureDetail"
						params={{
							expeditionThemeSlug: slug(theme),
						}}
					>
						{t("expedition-what-is-it-about")}
					</Link>
				</Heading>
			</header>
			<ArticleBody text={theme.description} />
			<div className="mt-3">
				<Link
					as={Button}
					route="adventureDetail"
					params={{
						expeditionThemeSlug: slug(theme),
					}}
					variant="secondary"
				>
					{t("expedition-theme-more-info")}
				</Link>
			</div>
		</section>
	);
};

type LeisureCentreSummaryProps = {
	leisureCentre: LeisureCentre;
};

const LeisureCentreSummary = ({ leisureCentre }: LeisureCentreSummaryProps) => (
	<span className={styles.baseStamp}>
		{leisureCentre.location?.fuzzyName || leisureCentre.location?.title || leisureCentre.title}
	</span>
);

type ExpeditionBatchStampProps = {
	batch: ExpeditionBatchType;
	showBase?: boolean;
};

const ExpeditionBatchStamp = ({ batch, showBase = true }: ExpeditionBatchStampProps) => (
	<div>
		<DateRange start={batch.startsAt} end={batch.endsAt} />
		{showBase ? (
			<>
				<br />
				{batch.leisureCentre ? <LeisureCentreSummary leisureCentre={batch.leisureCentre} /> : null}
			</>
		) : null}
	</div>
);

type ExpeditionBatchSummaryProps = {
	batches: ExpeditionBatchType[];
	expedition: ExpeditionType;
	className?: string;
};

export const ExpeditionBatchSummary = ({ batches, expedition, className }: ExpeditionBatchSummaryProps) => {
	const defaultBase = getDefaultBase(batches);
	return (
		<div className={className}>
			{batches.map((batch: ExpeditionBatchType) => (
				<Link
					key={batch.id}
					route="expeditionBatchDetail"
					params={{
						expeditionBatchSlug: slug(batch.id, expedition.title),
					}}
				>
					<ExpeditionBatchStamp batch={batch} showBase={!defaultBase} />
				</Link>
			))}
			{defaultBase ? <LeisureCentreSummary leisureCentre={defaultBase} /> : null}
		</div>
	);
};
