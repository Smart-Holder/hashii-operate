import { useSelector } from "react-redux";
import { IInitStateProps } from "../store/reducer";
import { LanguageType } from "../i18n";

const useCurrentLocale = () => {
	const { locale } = useSelector<IInitStateProps, { locale: LanguageType }>((state) => ({
		locale: state.locale || (navigator.language.toLocaleUpperCase() as LanguageType),
	}));
	return locale;
};

export default useCurrentLocale;
