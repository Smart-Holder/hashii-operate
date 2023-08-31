// import moment from "moment-timezone";
import crypto from "./crypto";
import { t as textTranslation } from "i18next";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

export interface IUserInfoProps {
	email: string;
	expiresIn: string | number;
	token: string;
	userId: string | number;
	roleType: number;
	isDefaultPassword: boolean;
}

export const setUserInfo = (props: IUserInfoProps) => {
	const str = crypto.encrypt(props);
	localStorage.setItem("userInfo", str);
};

export const getUserInfo = () => {
	const userinfoStr = localStorage.getItem("userInfo") || "";
	const str = crypto.decrypt(userinfoStr);
	const userInfo: IUserInfoProps = userinfoStr && (JSON.parse(str) as IUserInfoProps);
	return userInfo;
};

export const logout = () => {
	localStorage.removeItem("userInfo");
	window.location.href = "/login";
};

export const t = (text: string | number) => {
	if (!text || typeof text !== "string") return String(text);
	// eslint-disable-next-line
	const res = textTranslation(String(text));
	// const t: (text: string) => string = (text: string) => translation(text);
	return res;
};

const timeZoneTime = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const formatTimeZoneTime = (timeString?: string | number): string => {
	if (!timeString) return "";
	// const time = moment.tz(timeString, "Asia/Shanghai").clone().tz(timeZoneTime).format("YYYY-MM-DD HH:mm:ss");
	const time = dayjs.tz(timeString, "Asia/Shanghai").clone().tz(timeZoneTime).format("YYYY-MM-DD HH:mm:ss");
	return time;
};
