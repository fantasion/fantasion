export const describeError = (t: (key: string) => string, error: unknown) => {
	if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}
	if (typeof error === "string") {
		return error;
	}
	if (error && typeof error === "object" && "type" in error) {
		return t(`error-input-${String(error.type)}`);
	}
	return t("error-unknown");
};
