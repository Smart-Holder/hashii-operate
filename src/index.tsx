import store from "./store/store";
import { Provider } from "react-redux";

import { persistor } from "./store/store";
import { PersistGate } from "redux-persist/lib/integration/react";
// import "moment/locale/zh-cn";
import "./index.css";
import React from "react";
// import "antd/dist/antd.css";
import "antd/dist/reset.css";
// import App from "./App";

// ReactDOM.render(
// 	// <React.StrictMode>
// 	<Provider store={store}>
// 		<PersistGate loading={null} persistor={persistor}>
// 			<ConfigProvider locale={zhCN}>
// 				<App />
// 			</ConfigProvider>
// 		</PersistGate>
// 	</Provider>,
// 	// {/* </React.StrictMode>, */}
// 	document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import App from "./App";
import { createRoot } from "react-dom/client"; //更新后的写法
// import { message } from "antd";
// import Text from "./components/text";
// message.success = (text: string) => {
// 	return message.success(<Text>{text}</Text>);
// };
// import utils from "./somes";
// utils.onUncaughtException.on((e) => {
// 	console.log(e.data.message, "onUncaughtException");
// 	if (["ResizeObserver loop limit exceeded", "Script error."].includes(e.data.message)) return false;
// 	// errnoHandles(e.data);
// 	// handle(e.data);
// });
// utils.onUnhandledRejection.on((e) => {
// 	console.log(e.data, "onUnhandledRejection");
// 	// console.log(e.data, 'onUnhandledRejection');
// 	// handle(e.data.reason);
// });

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
);
