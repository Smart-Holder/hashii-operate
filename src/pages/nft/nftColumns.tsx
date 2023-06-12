import { ProColumns } from "@ant-design/pro-components";
// import moment from "moment-timezone";
import React from "react";
import Medium from "../../components/medium";
import { convertValueEnum } from "../../components/select";
import { airdropTypeEnum } from "../../interface";
import { INftItemProps } from "../../models/nft";
import { formatTimeZoneTime, t } from "../../utils/tools";

const nftTableColumns: ProColumns<INftItemProps>[] = [
	{
		title: "序号",
		dataIndex: "key",
		render: (...rest) => rest[2] + 1,
		search: false,
		width: 60,
	},
	{
		title: "藏品id",
		dataIndex: "nftID",
		hideInSearch: true,
		ellipsis: true,
		width: 60,
		fixed: "left",
	},

	{
		title: "水印图片",
		dataIndex: "waterMarkUrl",
		hideInSearch: true,
		valueType: "image",
		className: "waterMarkUrl",
		// hideInTable: Boolean(currWorkInfo?.isWaterMark === 2),
	},

	{
		title: "藏品图片",
		dataIndex: "nftUrl",
		hideInSearch: true,
		ellipsis: true,
		width: 180,
		render: (_, item) => {
			return <Medium path={item.issueType === 2 ? item.workPictureUrl : item?.nftUrl} />;
		},
	},

	{
		title: "TokenId",
		dataIndex: "tokenID",
		hideInSearch: true,
	},
	{
		title: "空投类型",
		dataIndex: "airdropType",
		valueEnum: convertValueEnum(airdropTypeEnum),
		renderText: (_: string | number) => (_ === 0 ? "-" : _),
		hideInSearch: true,
	},
	{
		title: "设备SN",
		dataIndex: "deviceSN",
		hideInSearch: true,
	},
	{
		title: "接收address",
		dataIndex: "receiveAddr",
		hideInSearch: true,
	},
	{
		title: "空投提交时间",
		dataIndex: "airdropBeginTime",
		hideInSearch: true,
		renderText: (_: string) => formatTimeZoneTime(_),
	},
	{
		title: "空投完成时间",
		dataIndex: "airdropEndTime",
		hideInSearch: true,
		renderText: (_: string) => formatTimeZoneTime(_),
	},
	{
		title: "空投状态",
		dataIndex: "airdropStatus",
		hideInSearch: true,
		valueEnum: {
			1: { text: t("未空投"), status: "Default" },
			2: { text: t("预空投"), status: "Default" },
			3: { text: t("空投中"), status: "Processing" },
			4: { text: t("上链成功"), status: "Processing" },
			5: { text: t("空投失败"), status: "Error" },
			6: { text: t("同步完成"), status: "Success" },
		},
	},
];

export default nftTableColumns;
