import React from "react";
import { useRoutes, NonIndexRouteObject } from "react-router-dom";
import Main from "./pages/main";
import Login from "./pages/login";
import { RouterConfig } from "./interface";

import Page1 from "./pages/page1";
import Device from "./pages/device";
import TotalDeviceData from "./pages/totalDeviceData";
import Merchant from "./pages/merchant";
import Works from "./pages/works";
import WorksDetail from "./pages/worksDetail";
import WorksIssue from "./pages/worksIssue";
import Nft from "./pages/nft";
import Series from "./pages/series";
import Apk from "./pages/apk";
import Mobile from "./pages/mobile";
import MerchantDetail from "./pages/merchantDetail";

interface IRouteProps extends NonIndexRouteObject {
	title?: string;
	subTitle?: string;
}

export const mainRoutes: IRouteProps[] = [
	{ path: RouterConfig.Path.page1, element: <Page1 />, title: "page1", subTitle: "page1" },
	{ path: RouterConfig.Path.device, element: <Device />, title: "设备管理", subTitle: "device" },
	{
		path: RouterConfig.Path.totalDeviceData,
		element: <TotalDeviceData />,
		title: "设备总数据",
		subTitle: "totalDeviceData",
	},
	{ path: RouterConfig.Path.merchant, element: <Merchant />, title: "商户管理", subTitle: "merchant" },
	{ path: RouterConfig.Path.works, element: <Works />, title: "作品管理", subTitle: "works" },
	{ path: RouterConfig.Path.worksDetail, element: <WorksDetail />, title: "作品详情", subTitle: "worksDetail" },
	{ path: RouterConfig.Path.worksIssue, element: <WorksIssue />, title: "作品发行", subTitle: "worksIssue" },
	{ path: RouterConfig.Path.nft, element: <Nft />, title: "NFT管理", subTitle: "nft" },
	{ path: RouterConfig.Path.series, element: <Series />, title: "系列管理", subTitle: "series" },
	{ path: RouterConfig.Path.apk, element: <Apk />, title: "Apk管理", subTitle: "apk" },

	{
		path: RouterConfig.Path.merchantDetail,
		element: <MerchantDetail />,
		title: "商家详情",
		subTitle: "merchantDetail",
	},
];

const Router = () => {
	const ele = useRoutes([
		{
			path: "/",
			element: <Login />,
		},
		{
			path: RouterConfig.Path.login,
			element: <Login />,
		},

		{
			path: RouterConfig.Path.main,
			element: <Main />,
			children: mainRoutes,
		},
		{
			path: "/mobile",
			element: <Mobile />,
		},
	]);

	return ele;
};

export default Router;
