import React from "react";
import Medium from "../../components/medium";
import { IWorksItemProps } from "../../models/works";
import { ProColumns } from "@ant-design/pro-components";

const workColumns: ProColumns<IWorksItemProps>[] = [
	{
		title: "序号",
		dataIndex: "key",
		search: false,
		render: (...rest) => rest[2] + 1,
	},

	{
		title: "作品图片",
		dataIndex: "workPictureUrl",
		valueType: "image",
		hideInSearch: true,
		ellipsis: true,
		width: 180,
		render: (_, item) => {
			return <Medium path={item.workPictureUrl} />;
		},
	},
	{
		title: "所属链",
		dataIndex: "chainName",
		hideInSearch: true,
	},
	{
		title: "所属系列",
		dataIndex: "seriesName",
		hideInSearch: true,
	},

	{
		title: "作品名称",
		dataIndex: "workName",
		ellipsis: true,
		width: "auto",
	},
	{
		title: "创作者",
		dataIndex: "creatorName",
	},

	{
		title: "发行数量",
		dataIndex: "issueNum",
		hideInSearch: true,
	},
	{
		title: "空投数量",
		dataIndex: "chainNum",
		hideInSearch: true,
		ellipsis: true,
	},
];

export default workColumns;
