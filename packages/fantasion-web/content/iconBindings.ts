/* Icon bindings - centralized definitions to prevent icon confusion */

import { BsBasket2Fill, BsPersonFill } from "react-icons/bs";
import { FaCalendarWeek, FaCampground, FaClock, FaFacebook, FaInstagram } from "react-icons/fa";
import { GiJourney } from "react-icons/gi";
import { HiHome, HiMailOpen, HiMenu } from "react-icons/hi";
import { IoPricetags } from "react-icons/io5";
import {
	MdArrowDownward,
	MdArrowLeft,
	MdArrowRight,
	MdCancel,
	MdCheck,
	MdContentCopy,
	MdDepartureBoard,
	MdGppBad,
	MdGppGood,
	MdGppMaybe,
	MdLocationPin,
	MdLogout,
} from "react-icons/md";

export const BasketIcon = BsBasket2Fill;
export const BusDepartureIcon = MdDepartureBoard;
export const CancelIcon = MdCancel;
export const CheckIcon = MdCheck;
export const CloseIcon = MdCancel;
export const CopyIcon = MdContentCopy;
export const DateTimeIcon = FaClock;
export const DownIcon = MdArrowDownward;
export const DurationIcon = FaCalendarWeek;
export const EmailContactIcon = HiMailOpen;
export const FacebookIcon = FaFacebook;
export const HamburgerMenuIcon = HiMenu;
export const HomeIcon = HiHome;
export const InsecureIcon = MdGppBad;
export const InstagramIcon = FaInstagram;
export const LocationPinIcon = MdLocationPin;
export const LogoutIcon = MdLogout;
export const NextIcon = MdArrowRight;
export const PersonIcon = BsPersonFill;
export const PrevIcon = MdArrowLeft;
export const PriceIcon = IoPricetags;
export const SecureIcon = MdGppGood;
export const SecurityWarningIcon = MdGppMaybe;
export const SignupIcon = FaCampground;
export const StoryIcon = GiJourney;
