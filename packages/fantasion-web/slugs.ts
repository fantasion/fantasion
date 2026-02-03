type SlugifyOptions = {
	delimiter?: string;
	limit?: number;
	lowercase?: boolean;
	replacements?: Record<string, string>;
	transliterate?: boolean;
};

export type PublicObject = {
	id: number;
	title: string;
};

export const slugify = (str: string, options: Partial<SlugifyOptions> = {}): string => {
	let s = String(str ?? "");

	const defaults: SlugifyOptions = {
		delimiter: "-",
		limit: undefined,
		lowercase: true,
		replacements: {},
		transliterate: true,
	};

	// Merge options
	const opt: SlugifyOptions = { ...defaults, ...options };

	const charMap = {
		// Latin
		À: "A",
		Á: "A",
		Â: "A",
		Ã: "A",
		Ä: "A",
		Å: "A",
		Æ: "AE",
		Ç: "C",
		È: "E",
		É: "E",
		Ê: "E",
		Ë: "E",
		Ì: "I",
		Í: "I",
		Î: "I",
		Ï: "I",
		Ð: "D",
		Ñ: "N",
		Ò: "O",
		Ó: "O",
		Ô: "O",
		Õ: "O",
		Ö: "O",
		Ő: "O",
		Ø: "O",
		Ù: "U",
		Ú: "U",
		Û: "U",
		Ü: "U",
		Ű: "U",
		Ý: "Y",
		Þ: "TH",
		ß: "ss",
		à: "a",
		á: "a",
		â: "a",
		ã: "a",
		ä: "a",
		å: "a",
		æ: "ae",
		ç: "c",
		è: "e",
		é: "e",
		ê: "e",
		ë: "e",
		ì: "i",
		í: "i",
		î: "i",
		ï: "i",
		ð: "d",
		ñ: "n",
		ò: "o",
		ó: "o",
		ô: "o",
		õ: "o",
		ö: "o",
		ő: "o",
		ø: "o",
		ù: "u",
		ú: "u",
		û: "u",
		ü: "u",
		ű: "u",
		ý: "y",
		þ: "th",
		ÿ: "y",

		// Latin symbols
		"©": "(c)",

		// Greek
		Α: "A",
		Β: "B",
		Γ: "G",
		Δ: "D",
		Ε: "E",
		Ζ: "Z",
		Η: "H",
		Θ: "8",
		Ι: "I",
		Κ: "K",
		Λ: "L",
		Μ: "M",
		Ν: "N",
		Ξ: "3",
		Ο: "O",
		Π: "P",
		Ρ: "R",
		Σ: "S",
		Τ: "T",
		Υ: "Y",
		Φ: "F",
		Χ: "X",
		Ψ: "PS",
		Ω: "W",
		Ά: "A",
		Έ: "E",
		Ί: "I",
		Ό: "O",
		Ύ: "Y",
		Ή: "H",
		Ώ: "W",
		Ϊ: "I",
		Ϋ: "Y",
		α: "a",
		β: "b",
		γ: "g",
		δ: "d",
		ε: "e",
		ζ: "z",
		η: "h",
		θ: "8",
		ι: "i",
		κ: "k",
		λ: "l",
		μ: "m",
		ν: "n",
		ξ: "3",
		ο: "o",
		π: "p",
		ρ: "r",
		σ: "s",
		τ: "t",
		υ: "y",
		φ: "f",
		χ: "x",
		ψ: "ps",
		ω: "w",
		ά: "a",
		έ: "e",
		ί: "i",
		ό: "o",
		ύ: "y",
		ή: "h",
		ώ: "w",
		ς: "s",
		ϊ: "i",
		ΰ: "y",
		ϋ: "y",
		ΐ: "i",

		// Turkish
		Ş: "S",
		İ: "I",
		Ğ: "G",
		ş: "s",
		ı: "i",
		ğ: "g",

		// Russian
		А: "A",
		Б: "B",
		В: "V",
		Г: "G",
		Д: "D",
		Е: "E",
		Ё: "Yo",
		Ж: "Zh",
		З: "Z",
		И: "I",
		Й: "J",
		К: "K",
		Л: "L",
		М: "M",
		Н: "N",
		О: "O",
		П: "P",
		Р: "R",
		С: "S",
		Т: "T",
		У: "U",
		Ф: "F",
		Х: "H",
		Ц: "C",
		Ч: "Ch",
		Ш: "Sh",
		Щ: "Sh",
		Ъ: "",
		Ы: "Y",
		Ь: "",
		Э: "E",
		Ю: "Yu",
		Я: "Ya",
		а: "a",
		б: "b",
		в: "v",
		г: "g",
		д: "d",
		е: "e",
		ё: "yo",
		ж: "zh",
		з: "z",
		и: "i",
		й: "j",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		о: "o",
		п: "p",
		р: "r",
		с: "s",
		т: "t",
		у: "u",
		ф: "f",
		х: "h",
		ц: "c",
		ч: "ch",
		ш: "sh",
		щ: "sh",
		ъ: "",
		ы: "y",
		ь: "",
		э: "e",
		ю: "yu",
		я: "ya",

		// Ukrainian
		Є: "Ye",
		І: "I",
		Ї: "Yi",
		Ґ: "G",
		є: "ye",
		і: "i",
		ї: "yi",
		ґ: "g",

		// Czech
		Č: "C",
		Ď: "D",
		Ě: "E",
		Ň: "N",
		Ř: "R",
		Š: "S",
		Ť: "T",
		Ů: "U",
		Ž: "Z",
		č: "c",
		ď: "d",
		ě: "e",
		ň: "n",
		ř: "r",
		š: "s",
		ť: "t",
		ů: "u",
		ž: "z",

		// Polish
		Ą: "A",
		Ć: "C",
		Ę: "e",
		Ł: "L",
		Ń: "N",
		Ś: "S",
		Ź: "Z",
		Ż: "Z",
		ą: "a",
		ć: "c",
		ę: "e",
		ł: "l",
		ń: "n",
		ś: "s",
		ź: "z",
		ż: "z",

		// Latvian
		Ā: "A",
		Ē: "E",
		Ģ: "G",
		Ī: "i",
		Ķ: "k",
		Ļ: "L",
		Ņ: "N",
		Ū: "u",
		ā: "a",
		ē: "e",
		ģ: "g",
		ī: "i",
		ķ: "k",
		ļ: "l",
		ņ: "n",
		ū: "u",
	};

	// Make custom replacements
	if (opt.replacements) {
		for (const k of Object.keys(opt.replacements)) {
			s = s.replace(new RegExp(k, "g"), opt.replacements[k]);
		}
	}

	// Transliterate characters to ASCII
	if (opt.transliterate) {
		for (const [k, v] of Object.entries(charMap)) {
			s = s.replace(new RegExp(k, "g"), v);
		}
	}

	// Replace non-alphanumeric characters with our delimiter
	const alnum = /[^a-z0-9]+/gi;
	s = s.replace(alnum, opt.delimiter || "-");

	// Remove duplicate delimiters
	const delimiter = opt.delimiter || "-";
	s = s.replace(new RegExp(`[${delimiter}]{2,}`, "g"), delimiter);

	// Truncate slug to max. characters
	if (opt.limit) {
		s = s.substring(0, opt.limit);
	}

	// Remove delimiter from ends
	s = s.replace(new RegExp(`(^${delimiter}|${delimiter}$)`, "g"), "");

	return opt.lowercase ? s.toLowerCase() : s;
};

const isPublicObject = (obj: unknown): obj is PublicObject =>
	Boolean(
		obj &&
			typeof obj === "object" &&
			"id" in obj &&
			"title" in obj &&
			typeof (obj as PublicObject).id === "number" &&
			typeof (obj as PublicObject).title === "string",
	);

export const slugObject = (obj: PublicObject): string => `${slugify(obj.title)}-${obj.id}`;

export function slug(id: PublicObject): string;
export function slug(id: number | string, title: string): string;
export function slug(id: PublicObject | number | string, title?: string): string {
	if (isPublicObject(id)) {
		return slugObject(id);
	}

	// Handle case where an object was passed but doesn't have correct types
	if (typeof id === "object" && id !== null) {
		const obj = id as { id?: unknown; title?: unknown };
		let extractedId: string | number = "unknown";
		if (typeof obj.id === "number") {
			extractedId = obj.id;
		} else if (typeof obj.id === "string") {
			extractedId = obj.id;
		}
		const extractedTitle = typeof obj.title === "string" ? obj.title : "item";
		return `${slugify(extractedTitle)}-${extractedId}`;
	}

	return `${title ? slugify(title) : "o"}-${id}`;
}

export const parseSlug = (s: string): number => Number.parseInt(s.split("-").reverse()[0], 10);
