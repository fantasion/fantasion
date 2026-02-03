import styles from "../components/layout.module.scss";
import Rune01 from "./runes/rune-01.svg";
import Rune02 from "./runes/rune-02.svg";
import Rune03 from "./runes/rune-03.svg";
import Rune04 from "./runes/rune-04.svg";
import Rune05 from "./runes/rune-05.svg";

const runes = [Rune01, Rune02, Rune03, Rune04, Rune05];

export const Runes = () => {
	const getSrc = (asset: string | { src?: string }) => (typeof asset === "string" ? asset : (asset?.src ?? ""));
	return (
		<div className={styles.runes}>
			{runes.map((rune, index) => {
				const src = getSrc(rune);
				return <img width="48" height="48" className={styles.rune} key={String(index)} src={src} alt="" />;
			})}
		</div>
	);
};
