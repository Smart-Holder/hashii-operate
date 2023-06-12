import React from "react";
import { SmileFilled } from "@ant-design/icons";
import { RouterConfig } from "../../interface";
import { getUserInfo, t } from "../../utils/tools";
import IconFont from "../../components/icon_font";
const userInfo = getUserInfo();
export let isAdmin = userInfo?.roleType === 1;

export default () => {
	const userInfo = getUserInfo();
	isAdmin = userInfo?.roleType === 1;
	// console.log(userInfo, "userInfo");
	return {
		route: {
			path: RouterConfig.Path.main,
			routes: [
				// {
				// 	path: RouterConfig.Path.page1,
				// 	name: "测试page1",
				// 	icon: <SmileFilled />,
				// },
				{
					path: RouterConfig.Path.merchant,
					name: "商户管理",
					icon: <IconFont type="icon-shangjia" />,
					hideInMenu: !isAdmin,
				},
				{
					path: RouterConfig.Path.merchantDetail,
					name: "商户详情",
					icon: <IconFont type="icon-zuopin" />,
					hideInMenu: true,
				},
				{
					path: RouterConfig.Path.works,
					name: "作品管理",
					icon: <IconFont type="icon-zuopin" />,
				},
				{
					path: RouterConfig.Path.worksDetail,
					name: "作品详情",
					icon: <SmileFilled />,
					hideInMenu: true,
				},
				{
					path: RouterConfig.Path.worksIssue,
					name: "作品发行",
					icon: <SmileFilled />,
					hideInMenu: true,
				},
				{
					path: RouterConfig.Path.nft,
					name: "NFT管理",
					icon: <IconFont type="icon-NFT" />,
				},
				{
					path: RouterConfig.Path.device,
					name: "设备管理",
					icon: <IconFont type="icon-shebei" />,
				},
				{
					path: RouterConfig.Path.totalDeviceData,
					name: "设备总数据",
					icon: <IconFont type="icon-icshowall" />,
					hideInMenu: !isAdmin,
				},
				// {
				// 	path: RouterConfig.Path.series,
				// 	name: "系列管理",
				// 	icon: <IconFont type="icon-xilie" />,
				// 	hideInMenu: !isAdmin,
				// },
				{
					path: RouterConfig.Path.apk,
					name: "Apk管理",
					icon: <IconFont type="icon-anzhuangbao" />,
					hideInMenu: !isAdmin,
				},
			].map((item) => ({ ...item, name: t(item.name) })),
		},

		location: {
			pathname: "/",
		},
	};
};
