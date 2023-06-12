import React, { useRef } from "react";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import { RouterConfig } from "../../interface";
import { merchantQuery, IMerchantQueryResult, merchantForbidden } from "../../models/merchant";
import "./index.scss";
import { formatTimeZoneTime, t } from "../../utils/tools";
import useTranslateColumns from "../../hooks/useTranslateColumns";
import Button from "../../components/button";

export type TableListItem = {
	key: number;
	name: string;
	containers: number;
	creator: string;
	contacts: string;
	mailbox: string;
	create_time: string;
};

// const merchantStateEnum = {
// 	0: { text: "已启用", status: "Success" },
// 	1: { text: "已禁用", status: "Error" },
// };

const Merchant = () => {
	const navigate = useNavigate();
	const ref = useRef<ActionType>();
	const columns: ProColumns<IMerchantQueryResult>[] = [
		{
			title: "序号",
			dataIndex: "key",
			search: false,
			render: (...rest) => rest[2] + 1,
			width: 60,
		},
		{
			title: "商家名称",
			dataIndex: "name",
			copyable: true,
		},
		{
			title: "联系人",
			dataIndex: "linkman",
			hideInSearch: true,
		},
		{
			title: "邮箱",
			dataIndex: "email",
			ellipsis: true,
			width: "20%",
		},
		{
			title: "创建时间",
			dataIndex: "createTimestamp",
			renderText: (_: string) => formatTimeZoneTime(_),
			hideInSearch: true,
		},
		{
			title: "商家状态",
			dataIndex: "state",
			valueType: "select",
			hideInSearch: true,
			width: "8%",
			valueEnum: {
				0: { text: t("已启用"), status: "Success" },
				1: { text: t("已禁用"), status: "Error" },
			},
			// valueEnum: merchantStateEnum,
			// renderText: (text: 0 | 1) => {
			// 	return text;
			// },
		},
		{
			title: "操作",
			key: "state",
			width: 140,
			valueType: "option",
			render: (_, { state, userId }) => [
				<Button
					type="link"
					key="link"
					onClick={() => {
						navigate(`${RouterConfig.Path.merchantDetail}?userId=${userId}`);
					}}
				>
					编辑
				</Button>,
				<div key="action" style={{ width: "100%" }}>
					{!state ? (
						<Popconfirm
							key="pop"
							placement="topRight"
							title={t("操作提示")}
							description={t("禁用后该商家下用户无法登录系统，确定要禁用该项目？")}
							onConfirm={async () => {
								await merchantForbidden({ userId, state: 1 });
								message.success(t("禁用完成"));
								ref.current.reload();
							}}
						>
							<Button type="link" key="warn">
								禁用
							</Button>
						</Popconfirm>
					) : (
						<Button
							type="link"
							key="warn"
							onClick={async () => {
								await merchantForbidden({ userId, state: 0 });
								message.success(t("启用完成"));
								ref.current.reload();
							}}
						>
							启用
						</Button>
					)}
				</div>,
			],
		},
	];

	return (
		<ProTable<IMerchantQueryResult>
			columns={useTranslateColumns(columns)}
			request={async ({ pageSize: limit, current: page, ...rest }) => {
				const {
					data: { list, count },
				} = await merchantQuery({ limit, page, ...rest });
				return {
					data: list,
					success: true,
					total: count,
				};
			}}
			pagination={{ defaultPageSize: 10 }}
			rowKey="userId"
			actionRef={ref}
			search={{
				labelWidth: "auto",
				className: "search_part",
				optionRender: (...rest) => [
					...rest[2],
					<Button type="primary" key="out" onClick={() => navigate(RouterConfig.Path.merchantDetail)}>
						新增
					</Button>,
				],
			}}
		/>
	);
};
export default Merchant;
