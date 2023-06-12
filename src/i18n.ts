import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "./utils/locales/en.json";
import JA from "./utils/locales/ja.json";
import ZH from "./utils/locales/zh.json";
export type LanguageType = "ZH" | "EN" | "DE" | "JA";
let locale = localStorage.getItem("locale");
if (locale === "zh-CN") locale = "zh";

// import { setLocale } from "./store/action";

// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';

// import resources from './utils/locales'
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
	// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
	// learn more: https://github.com/i18next/i18next-http-backend
	// .use(Backend)
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	// .use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		fallbackLng: locale || "ZH",
		lng: locale || "ZH",
		debug: true,
		ns: ["translations"],

		resources: {
			EN: {
				translations: EN,
			},
			ZH: {
				translations: ZH,
			},
			JA: {
				translations: JA,
			},
		},
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	})
	.finally(() => {
		console.log("finally");
	});
// const useChangeLanguage = async (lng: LanguageType) => {
// 	const dispatch = useDispatch();
// 	// dispatch(setLocale(lng));
// 	//定义多语言的change
// 	await i18n.changeLanguage(lng); //i18n会通过这个方法去改变它的语言
// };

// export { useChangeLanguage }; //导出
export default i18n;
