import React from "react";
import Router from "./router";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ZH from "antd/es/locale/zh_CN";
import EN from "antd/es/locale/en_US";
import JA from "antd/es/locale/ja_JP";
import DE from "antd/es/locale/de_DE";
import { useSelector } from "react-redux";
import { IInitStateProps } from "./store/reducer";

import "./i18n";
// import { initI18n } from "./i18n";
import { LanguageType } from "./i18n";

const localeConfig = { ZH, EN, JA, DE };

function App() {
	// 通过useSelector获取到store中的数据
	const { locale } = useSelector<IInitStateProps, { locale: LanguageType }>((state) => ({
		locale: state.locale,
	}));
	// initI18n();
	console.log(locale, "locale");

	return (
		<div className="App">
			<ConfigProvider locale={localeConfig[locale]}>
				<BrowserRouter>
					<Router />
				</BrowserRouter>
			</ConfigProvider>
		</div>
	);
}

export default App;
