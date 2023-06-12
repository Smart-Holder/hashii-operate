import { LanguageType } from "../i18n";
export interface IInitStateProps {
	init: string;
	locale: LanguageType;
}
let locale = navigator.language;
if (locale === "zh-CN") locale = "zh";

const initState = { init: "", locale: locale.toUpperCase() };
/* eslint-disable */
const reducer = (state = initState, action: { type: string; value: any }) => {
	switch (action.type) {
		case "menu":
			return { ...state, currSubMenuKey: action.value };
		case "modal":
			return { ...state, modalConfig: action.value };
		case "isRefresh":
			return { ...state, isRefresh: action.value };
		case "token":
			return { ...state, token: action.value };
		case "locale":
			return { ...state, locale: action.value };
		default:
			return state;
	}
};

export default reducer;
