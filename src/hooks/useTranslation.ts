import { useTranslation } from "react-i18next";

const useTextTranslation = () => {
	// eslint-disable-next-line
	const { t }: { t: (text: string) => string } = useTranslation();
	// const t: (text: string) => string = (text: string) => translation(text);
	return { t };
};

export default useTextTranslation;
