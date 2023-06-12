import { ProColumns } from "@ant-design/pro-components";
import Medium from "../../components/medium";
import { IDeviceNftListItemProps } from "../../models/device";
import React from "react";
import { formatTimeZoneTime } from "../../utils/tools";
const nftListColumns: ProColumns<IDeviceNftListItemProps>[] = [
	{
		title: "序号",
		dataIndex: "id",
		search: false,
	},

	{
		title: "图片",
		dataIndex: "imageUrl",
		width: 120,
		render: (_, item) => {
			const mediaUrl = item.mediaOrigin || item.mediaUrl;
			const image = item.imageOrigin || item.image;
			return <Medium path={mediaUrl || image || item.pictureUrl} />;
		},
	},
	{
		title: "tokenID",
		dataIndex: "tokenId",
		renderText: (_) => <div style={{ wordBreak: "break-all" }}>{_}</div>,
	},
	{
		title: "网络",
		dataIndex: "chainDesc",
	},
	{
		title: "存入address",
		dataIndex: "address",
		renderText: (_) => <div style={{ wordBreak: "break-all" }}>{_}</div>,
	},
	{
		title: "存入时间",
		dataIndex: "transferTime",
		renderText: (_: string) => formatTimeZoneTime(_),
	},

	{
		title: "状态",
		dataIndex: "status",
		valueType: "select",
		valueEnum: {
			1: {
				text: "预空投",
				status: "Processing",
			},
			2: {
				text: "存入成功",
				status: "Success",
			},
		},
	},
];

export default nftListColumns;
