"use client";

import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	AccordionItem,
	Container,
	Offcanvas,
	OffcanvasBody,
	OffcanvasTitle,
} from "@fantasion/ui";
import classnames from "classnames";
import { getCookie, setCookie } from "cookies-next";
import Script from "next/script";
import { useCallback, useEffect, useId, useState } from "react";
import { Form } from "../forms/Form";
import { FormControls } from "../forms/FormControls";
import { Input } from "../forms/Input";
import { useTranslation } from "../lib/i18n-context";
import { InteractiveButton } from "./buttons";
import styles from "./tracking.module.scss";

const COOKIE_CONSENT = "cookieConsent";
const CONSENT_FUNCTIONAL = "functional";
const CONSENT_TRACKING = "tracking";
const CONSENT_MARKETING = "marketing";

type Consent = {
	[CONSENT_FUNCTIONAL]: boolean;
	[CONSENT_TRACKING]: boolean;
	[CONSENT_MARKETING]: boolean;
	[key: string]: boolean;
};

const defaultConsent: Consent = {
	[CONSENT_FUNCTIONAL]: true,
	[CONSENT_TRACKING]: true,
	[CONSENT_MARKETING]: true,
};

type ConsentFormProps = {
	consent: Consent | null;
	formId: string;
	onCancel: () => void;
	onSubmit: (values: Consent) => undefined | Promise<unknown>;
};

const ConsentForm = ({ consent, formId, onCancel, onSubmit }: ConsentFormProps) => {
	const { t } = useTranslation();
	const defaultValues: Consent = consent || defaultConsent;
	const stopPropagation = (e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation();
	return (
		<Form
			defaultValues={defaultValues}
			id={formId}
			onSubmit={(values: Consent) =>
				onSubmit({
					...values,
					[CONSENT_FUNCTIONAL]: true,
				})
			}
		>
			<Accordion>
				<AccordionItem eventKey={CONSENT_FUNCTIONAL}>
					<AccordionHeader>
						<Input
							type="checkbox"
							disabled={true}
							checked={true}
							name={CONSENT_FUNCTIONAL}
							label={t("cookie-functional")}
							onClick={stopPropagation}
						/>
					</AccordionHeader>
					<AccordionBody>
						<p>{t("cookie-functional-help-text")}</p>
					</AccordionBody>
				</AccordionItem>
				<AccordionItem eventKey={CONSENT_TRACKING}>
					<AccordionHeader>
						<Input type="checkbox" name={CONSENT_TRACKING} label={t("cookie-tracking")} onClick={stopPropagation} />
					</AccordionHeader>
					<AccordionBody>
						<p>{t("cookie-tracking-help-text")}</p>
					</AccordionBody>
				</AccordionItem>
				<AccordionItem eventKey={CONSENT_MARKETING}>
					<AccordionHeader>
						<Input type="checkbox" name={CONSENT_MARKETING} label={t("cookie-marketing")} onClick={stopPropagation} />
					</AccordionHeader>
					<AccordionBody>
						<p>{t("cookie-marketing-help-text")}</p>
					</AccordionBody>
				</AccordionItem>
			</Accordion>
			<FormControls submitLabel={t("cookie-confirm")} onCancel={onCancel} cancelLabel={t("cookie-go-back")} />
		</Form>
	);
};

type QuickConsentFormProps = {
	onAccept: () => void;
	onCustomize: () => void;
};

const QuickConsentForm = ({ onAccept, onCustomize }: QuickConsentFormProps) => {
	const { t } = useTranslation();
	return (
		<div className={styles.quickForm}>
			<InteractiveButton variant="secondary" size="lg" onClick={onCustomize}>
				{t("cookie-customize")}
			</InteractiveButton>
			<InteractiveButton size="lg" onClick={onAccept}>
				{t("cookie-confirm-all")}
			</InteractiveButton>
		</div>
	);
};

type ConsentDialogProps = {
	consent: Consent | null;
	onResolve: (values: Consent) => undefined | Promise<unknown>;
	show: boolean;
};

const ConsentDialog = ({ consent, onResolve, show }: ConsentDialogProps) => {
	const [showForm, setShowForm] = useState(false);
	const acceptAll = () => onResolve(defaultConsent);
	const formId = useId();

	const { t } = useTranslation();
	return (
		<Offcanvas show={show} placement="bottom" className={classnames(styles.canvas, { [styles.canvasBig]: showForm })}>
			<OffcanvasBody>
				<Container className={styles.container}>
					<OffcanvasTitle>{t("cookie-consent-title")}</OffcanvasTitle>
					<p>{t("cookie-consent-description")}</p>
					{showForm ? (
						<ConsentForm formId={formId} onCancel={() => setShowForm(false)} onSubmit={onResolve} consent={consent} />
					) : (
						<QuickConsentForm onAccept={acceptAll} onCustomize={() => setShowForm(true)} />
					)}
				</Container>
			</OffcanvasBody>
		</Offcanvas>
	);
};

type GoogleTagManagerProps = {
	scriptId: string;
};

const GoogleTagManager = ({ scriptId }: GoogleTagManagerProps) => (
	<Script
		id={scriptId}
		strategy="afterInteractive"
		// biome-ignore lint/security/noDangerouslySetInnerHtml: This is required for GTM script
		dangerouslySetInnerHTML={{
			__html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MSJFFPK');`,
		}}
	/>
);

const getConsentValue = (): Consent | null => {
	const cookie = getCookie(COOKIE_CONSENT);
	if (!cookie || typeof cookie !== "string") {
		return null;
	}
	const initial: Consent = { ...defaultConsent, [CONSENT_FUNCTIONAL]: true };
	return cookie.split(",").reduce((aggr, key) => Object.assign(aggr, { [key]: true }), initial);
};

type DataLayerItem = {
	event: string;
	marketingConsent?: boolean;
	trackingConsent?: boolean;
	[key: string]: unknown;
};

type WindowWithDataLayer = typeof globalThis & {
	dataLayer?: DataLayerItem[];
	showConsentDialog?: () => void;
};

const publishConsent = (consent: Consent | null) => {
	if (consent) {
		const w = globalThis as WindowWithDataLayer;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({
			event: "cookieConsentSubmit",
			marketingConsent: Boolean(consent[CONSENT_MARKETING]),
			trackingConsent: Boolean(consent[CONSENT_TRACKING]),
		});
	}
};

const SECONDS_PER_MINUTE_TRACKING = 60;
const MINUTES_PER_HOUR_TRACKING = 60;
const HOURS_PER_DAY_TRACKING = 24;
const DAYS_PER_YEAR = 365;
const YEARS_FOR_COOKIE_CONSENT = 5;
const FIVE_YEARS =
	SECONDS_PER_MINUTE_TRACKING *
	MINUTES_PER_HOUR_TRACKING *
	HOURS_PER_DAY_TRACKING *
	DAYS_PER_YEAR *
	YEARS_FOR_COOKIE_CONSENT;

export const Tracking = () => {
	const [consent, setConsent] = useState<Consent | null>(getConsentValue());
	const [showDialog, setShowDialog] = useState(false);
	const gtmScriptId = useId();

	const showConsentDialog = useCallback(() => setShowDialog(true), []);
	useEffect(() => {
		(globalThis as WindowWithDataLayer).showConsentDialog = showConsentDialog;
		return () => {
			if ((globalThis as WindowWithDataLayer).showConsentDialog === showConsentDialog) {
				(globalThis as WindowWithDataLayer).showConsentDialog = undefined;
			}
		};
	}, [showConsentDialog]);

	useEffect(() => {
		publishConsent(consent);
	}, [consent]);

	const saveConsent = (values: Consent): undefined => {
		setConsent(values);
		const cookieValue = Object.entries(values)
			.reduce<string[]>((aggr, [key, value]) => (value ? aggr.concat(key) : aggr), [])
			.join(",");
		setCookie(COOKIE_CONSENT, cookieValue, {
			maxAge: FIVE_YEARS,
			sameSite: "strict",
		});
		setShowDialog(false);
	};
	return (
		<>
			{showDialog && <ConsentDialog consent={consent} show={showDialog} onResolve={saveConsent} />}
			<GoogleTagManager scriptId={gtmScriptId} />
		</>
	);
};
