import i18n, { LanguageType } from "../i18n";
import { useDispatch } from "react-redux";
import { setLocale } from "../store/action";
import { useState, useEffect } from "react";

const useChangeLanguage = (lng: LanguageType) => {
	const [locale, setlocale] = useState(lng || "ZH");
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setLocale(locale));
		localStorage.setItem("locale", locale);
		i18n.changeLanguage(locale).finally(() => console.log(`i18n切换${locale}完成`)); //i18n会通过这个方法去改变它的语言
		// eslint-disable-next-line
	}, [locale]);
	return setlocale;
};

export default useChangeLanguage;
