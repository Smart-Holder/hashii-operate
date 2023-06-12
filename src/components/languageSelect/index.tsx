import React from "react";
import { Select } from "antd";
import useChangeLanguage from "../../hooks/useChangeLanguage";
import useCurrentLocale from "../../hooks/useCurrentLocale";
import { LanguageType } from "../../i18n";

const LanguageSelect = () => {
	const currLocale = useCurrentLocale();
	const setLan = useChangeLanguage(currLocale);
	const changeLanguage = (e: LanguageType) => {
		setLan(e);
	};

	return (
		<Select
			defaultValue={currLocale}
			style={{ width: 120 }}
			onChange={changeLanguage}
			options={[
				{
					value: "JA",
					label: "日本語",
				},
				{
					value: "ZH",
					label: "中文",
				},
				{
					value: "EN",
					label: "English",
					disabled: true,
				},

				// {
				// 	value: "DE",
				// 	label: "Deutsch",
				// 	disabled: true,
				// },
			]}
		/>
	);
};

export default LanguageSelect;
