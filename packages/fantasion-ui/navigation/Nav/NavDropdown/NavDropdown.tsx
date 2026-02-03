import clsx from "clsx";
import {
	createContext,
	forwardRef,
	type HTMLAttributes,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button } from "../../../buttons/Button";
import styles from "./NavDropdown.module.scss";

// ============================================
// NAV DROPDOWN CONTEXT
// ============================================

interface NavDropdownContextValue {
	show: boolean;
	onToggle: () => void;
	onClose: () => void;
}

const NavDropdownContext = createContext<NavDropdownContextValue | null>(null);

function useNavDropdownContext() {
	return useContext(NavDropdownContext);
}

// ============================================
// NAV DROPDOWN
// ============================================

export interface NavDropdownProps extends Omit<HTMLAttributes<HTMLLIElement>, "title" | "onToggle"> {
	/** Dropdown title/toggle text */
	title: ReactNode;
	/** Unique ID for accessibility */
	id?: string;
	/** Controlled show state */
	show?: boolean;
	/** Callback when dropdown is toggled */
	onToggle?: (show: boolean) => void;
	/** Menu alignment */
	align?: "start" | "end";
	/** Drop direction */
	drop?: "down" | "up" | "start" | "end";
	/** Auto close behavior */
	autoClose?: boolean | "inside" | "outside";
	/** Active state */
	active?: boolean;
	/** Disabled state */
	disabled?: boolean;
	children: ReactNode;
}

export const NavDropdown = forwardRef<HTMLLIElement, NavDropdownProps>(
	(
		{
			title,
			id,
			show: controlledShow,
			onToggle: controlledOnToggle,
			align,
			drop = "down",
			autoClose = true,
			active,
			disabled,
			className,
			children,
			...props
		},
		ref,
	) => {
		const [internalShow, setInternalShow] = useState(false);
		const dropdownRef = useRef<HTMLLIElement>(null);

		const isControlled = controlledShow !== undefined;
		const show = isControlled ? controlledShow : internalShow;

		const handleToggle = () => {
			if (disabled) return;
			const newShow = !show;
			if (isControlled && controlledOnToggle) {
				controlledOnToggle(newShow);
			} else {
				setInternalShow(newShow);
			}
		};

		const handleClose = () => {
			if (isControlled && controlledOnToggle) {
				controlledOnToggle(false);
			} else {
				setInternalShow(false);
			}
		};

		useEffect(() => {
			if (!show || autoClose === false) return;

			const handleClickOutside = (event: MouseEvent) => {
				const target = event.target as Node;
				const dropdown = dropdownRef.current;

				if (dropdown && !dropdown.contains(target)) {
					if (autoClose === true || autoClose === "outside") {
						handleClose();
					}
				} else if (dropdown && dropdown.contains(target)) {
					if (autoClose === true || autoClose === "inside") {
						const menuItem = (event.target as Element).closest(`.${styles.item}`);
						if (menuItem) {
							handleClose();
						}
					}
				}
			};

			const handleEscape = (event: KeyboardEvent) => {
				if (event.key === "Escape") {
					handleClose();
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscape);

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
				document.removeEventListener("keydown", handleEscape);
			};
		}, [show, autoClose]);

		return (
			<NavDropdownContext.Provider value={{ show, onToggle: handleToggle, onClose: handleClose }}>
				<li
					ref={dropdownRef}
					className={clsx(styles.navDropdown, drop === "up" && styles.dropUp, disabled && styles.disabled, className)}
					{...props}
				>
					<Button
						variant="inline"
						className={clsx(styles.toggle, show && styles.toggleShow)}
						onClick={handleToggle}
						aria-expanded={show}
						aria-haspopup="true"
						id={id}
						disabled={disabled}
					>
						{title}
						<span className={styles.caret} />
					</Button>
					<ul className={clsx(styles.menu, show && styles.menuShow, align === "end" && styles.menuEnd)}>{children}</ul>
				</li>
			</NavDropdownContext.Provider>
		);
	},
);

NavDropdown.displayName = "NavDropdown";

// ============================================
// NAV DROPDOWN ITEM
// ============================================

export interface NavDropdownItemProps extends HTMLAttributes<HTMLElement> {
	/** Render as different element */
	as?: "button" | "a";
	/** Href for anchor items */
	href?: string;
	/** Active state */
	active?: boolean;
	/** Disabled state */
	disabled?: boolean;
	children: ReactNode;
}

export const NavDropdownItem = forwardRef<HTMLElement, NavDropdownItemProps>(
	({ as: Component = "button", href, active, disabled, className, children, ...props }, ref) => {
		const context = useNavDropdownContext();

		const handleClick = (e: React.MouseEvent) => {
			if (context) {
				context.onClose();
			}
			if (props.onClick) {
				(props.onClick as (e: React.MouseEvent) => void)(e);
			}
		};

		const classes = clsx(styles.item, active && styles.itemActive, disabled && styles.itemDisabled, className);

		if (Component === "a") {
			return (
				<li>
					<a
						ref={ref as React.Ref<HTMLAnchorElement>}
						href={href}
						className={classes}
						aria-disabled={disabled ? "true" : undefined}
						onClick={handleClick}
						{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
					>
						{children}
					</a>
				</li>
			);
		}

		return (
			<li>
				<button
					ref={ref as React.Ref<HTMLButtonElement>}
					type="button"
					className={classes}
					disabled={disabled}
					onClick={handleClick}
					{...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
				>
					{children}
				</button>
			</li>
		);
	},
);

NavDropdownItem.displayName = "NavDropdownItem";

// ============================================
// NAV DROPDOWN DIVIDER
// ============================================

export interface NavDropdownDividerProps extends HTMLAttributes<HTMLHRElement> {}

export const NavDropdownDivider = forwardRef<HTMLHRElement, NavDropdownDividerProps>(({ className, ...props }, ref) => (
	<li>
		<hr ref={ref} className={clsx(styles.divider, className)} {...props} />
	</li>
));

NavDropdownDivider.displayName = "NavDropdownDivider";

// ============================================
// NAV DROPDOWN HEADER
// ============================================

export interface NavDropdownHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export const NavDropdownHeader = forwardRef<HTMLHeadingElement, NavDropdownHeaderProps>(
	({ className, children, ...props }, ref) => (
		<li>
			<h6 ref={ref} className={clsx(styles.header, className)} {...props}>
				{children}
			</h6>
		</li>
	),
);

NavDropdownHeader.displayName = "NavDropdownHeader";
