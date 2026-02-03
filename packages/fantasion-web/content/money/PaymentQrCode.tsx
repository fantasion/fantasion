"use client";

import QrCode from "react-qr-code";
import type { MoneyAmount } from "./types";

const EMV_HEADER = "SPD*1.0*";

type PaymentQrCodeProps = {
	amount: MoneyAmount;
	bic: string;
	currency: string;
	iban: string;
	message?: string;
	variableSymbol: string;
};

export const PaymentQrCode = ({ amount, bic, currency, iban, message, variableSymbol }: PaymentQrCodeProps) => {
	const codeVars = Object.entries({
		ACC: `${iban}+${bic}`,
		AM: amount,
		CC: currency,
		RF: variableSymbol,
		MSG: message,
		"X-VS": variableSymbol,
	})
		.map((entry) => entry.join(":"))
		.join("*");
	const code = `${EMV_HEADER}${codeVars}`;
	return <QrCode value={code} />;
};
