import styles from "./TravelSpinner.module.scss";

export const TravelSpinner = () => (
	<div className={styles.container}>
		<div className={styles.chevron} />
		<div className={styles.chevron} />
		<div className={styles.chevron} />
	</div>
);
