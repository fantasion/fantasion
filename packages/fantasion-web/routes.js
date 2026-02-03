const cs = {
	about: {
		source: "/o-nas",
		destination: "/about",
	},
	contacts: {
		source: "/kontakty",
		destination: "/contact",
	},
	faq: {
		source: "/casto-kladene-otazky",
		destination: "/faq",
	},
	home: {
		source: "/",
		destination: "/index",
	},
	adventureList: {
		source: "/dobrodruzstvi",
		destination: "/adventures",
	},
	bestiary: {
		source: "/bestiar",
		destination: "/bestiary",
	},
	monsterDetail: {
		source: "/monsters/:monsterSlug",
		destination: "/monsters/:monsterSlug",
	},
	confirmRegistration: {
		source: "/potvrzeni-registrace",
		destination: "/confirm-registration",
	},
	expeditionDetail: {
		source: "/tabory/:expeditionSlug",
		destination: "/expeditions/:expeditionSlug",
	},
	expeditionBatchDetail: {
		source: "/turnusy/:expeditionBatchSlug",
		destination: "/expedition-batches/:expeditionBatchSlug",
	},
	transportDetail: {
		source: "/doprava/:transportId",
		destination: "/transports/:transportId",
	},
	forgottenPassword: {
		source: "/zapomenute-heslo",
		destination: "/forgotten-password",
	},
	adventureDetail: {
		source: "/dobrodruzstvi/:expeditionThemeSlug",
		destination: "/adventures/:expeditionThemeSlug",
	},
	leisureCentreList: {
		source: "/stredisko",
		destination: "/leisure-centres",
	},
	leisureCentreDetail: {
		source: "/strediska/:leisureCentreSlug",
		destination: "/leisure-centres/:leisureCentreSlug",
	},
	basket: {
		source: "/objednavka/kosik",
		destination: "/orders/basket",
	},
	paymentAndDelivery: {
		source: "/objednavka/platba-a-doruceni",
		destination: "/orders/payment-and-delivery",
	},
	checkout: {
		source: "/objednavka/potvrzeni",
		destination: "/orders/checkout",
	},
	login: {
		source: "/prihlaseni",
		destination: "/login",
	},
	participants: {
		source: "/druzina/ucastnici",
		destination: "/circle/participants",
	},
	participantDetail: {
		source: "/druzina/ucastnici/:participantId",
		destination: "/circle/participants/:participantId",
	},
	profileDetail: {
		source: "/tym/:profileSlug",
		destination: "/team/:profileSlug",
	},
	privacyPolicy: {
		source: "/zasady-ochrany-osobnich-udaju",
		destination: "/privacy-policy",
	},
	register: {
		source: "/registrace",
		destination: "/register",
	},
	team: {
		source: "/tym",
		destination: "/team",
	},
	termsAndConditions: {
		source: "/obchodni-podminky",
		destination: "/terms-and-conditions",
	},
	cookiesPolicy: {
		source: "/cookies-podminky",
		destination: "/cookies-policy",
	},
	codex: {
		source: "/kodex",
		destination: "/codex",
	},
	orderDetail: {
		source: "/objednavky/:orderId",
		destination: "/orders/:orderId",
	},
	signupDetail: {
		source: "/prihlasky/:signupId",
		destination: "/signups/:signupId",
	},
	circleLog: {
		source: "/druzina/denik",
		destination: "/circle/log",
	},
	status: {
		source: "/prehled",
		destination: "/status",
	},
};

export const defaultLang = "cs";

export const routes = {
	cs: cs,
};

export const getRewrites = () => {
	const rewrites = [];

	for (const [lang, paths] of Object.entries(routes)) {
		for (const [routeName, route] of Object.entries(paths)) {
			// Skip identity mappings (source === destination)
			if (route.source === route.destination) {
				continue;
			}

			// Skip home route - App Router handles it via page.tsx
			if (routeName === "home") {
				continue;
			}

			rewrites.push({
				source: `/${lang}${route.source}`,
				destination: `/${lang}${route.destination}`,
			});
		}
	}

	return rewrites;
};
