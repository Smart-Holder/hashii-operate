import React, { useRef, useEffect } from "react";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RouterConfig } from "../../interface";
import Button from "../../components/button";
import IconFont from "../../components/icon_font";
import { Space, Popconfirm, message } from "antd";
import { getWorkList, IGetWorkListProps, IWorksItemProps, workDelete } from "../../models/works";
import { merchantQuery } from "../../models/merchant";
import Medium from "../../components/medium";
import { isAdmin } from "../main/_defaultProps";
import { getUserInfo, t } from "../../utils/tools";
import useTranslateColumns from "../../hooks/useTranslateColumns";

import "./model.scss";
// useGLTF.preload("/ShoeModelDraco.glb");

export type TableListItem = {
	merchantName: string;
	workNum: string | number;
	workName: string;
	creatorName: string;
	creatorTime: string;
	chainName: string;
	seriesName: string;
	issueNum: string;
	chainNum: string;
	key: string | number;
};

const Works = () => {
	const [searchParams] = useSearchParams();
	const issueStatus = Number(searchParams.get("issueStatus"));

	const navigate = useNavigate();
	const ref = useRef<ActionType>();
	const userinfo = getUserInfo();

	useEffect(() => {
		ref.current?.reload();
	}, [issueStatus]);

	// 获取商家列表
	const getMerchantQuery = async () => {
		const {
			data: { list },
		} = await merchantQuery({ limit: 999, page: 1 });
		return list;
	};

	const columns: ProColumns<IWorksItemProps>[] = [
		{
			title: "序号",
			dataIndex: "key",
			search: false,
			render: (...rest) => rest[2] + 1,
			width: 60,
		},
		{
			title: "所属商家",
			dataIndex: "userId",
			valueType: "select",
			request: getMerchantQuery,
			fieldProps: { fieldNames: { label: "name", value: "userId" } },
			render: (_, item) => item.merchantName,
			hideInTable: !isAdmin,
			hideInSearch: !isAdmin,
		},
		{
			title: "作品编号",
			dataIndex: "workID",
			hideInSearch: true,
		},
		{
			title: "作品图片",
			dataIndex: "workPictureUrl",
			valueType: "image",
			hideInSearch: true,
			fieldProps: { width: 120 },
			ellipsis: true,
			width: 120,
			render: (_, item) => {
				return <Medium path={item.workPictureUrl} />;
				// return <img alt="..." src={"workPictureUrl"} />;
			},
		},
		{
			title: "作品名称",
			dataIndex: "workName",
			hideInSearch: true,
			ellipsis: true,
		},
		{
			title: "创作者",
			dataIndex: "creatorName",
			copyable: true,
		},
		{
			title: "创建时间",
			dataIndex: "creatorTime",
			hideInSearch: true,
			// renderText: (_: string) => formatTimeZoneTime(_),
		},
		{
			title: "发行数量",
			dataIndex: "issueNum",
			hideInSearch: true,
			ellipsis: true,
		},
		{
			title: "上链数量",
			dataIndex: "chainNum",
			hideInSearch: true,
			ellipsis: true,
		},
		{
			title: "操作",
			key: "workID",
			hideInSearch: true,
			// ellipsis: true,
			width: "18%",
			render: (_, item) => {
				const isShowBtn = Boolean(item.issueNum);
				const isCurrUser = Boolean(item.userId === userinfo.userId);
				return (
					<Space>
						<Button
							btnType="info"
							tooltip="查看"
							onClick={() => {
								navigate(`${RouterConfig.Path.worksDetail}?workID=${item.workID}&readonly=readonly`);
							}}
						/>

						{!Boolean(item.chainNum) &&
							isCurrUser && [
								<Button
									btnType="edit"
									tooltip="编辑"
									key="edit"
									onClick={() => {
										navigate(`${RouterConfig.Path.worksDetail}?workID=${item.workID}`);
									}}
								/>,
								<Popconfirm
									key="pop"
									placement="topRight"
									title={t("操作提示")}
									description={t("删除后该作品将无法找回，确定要删除？")}
									onConfirm={async () => {
										await workDelete(item.workID);
										message.success(t("删除完成"));
										ref.current.reload();
									}}
								>
									<Button key="delete" btnType="delete" tooltip="删除" />
								</Popconfirm>,
							]}
						{!isShowBtn && isCurrUser && (
							<Button
								icon={<IconFont type="icon-a-fabuzhifeiji" />}
								tooltip="发行"
								onClick={() => {
									navigate(`${RouterConfig.Path.worksIssue}?workID=${item.workID}`);
								}}
							/>
						)}
					</Space>
				);
			},
		},
	];

	return (
		<div>
			{/* <Glb glb_url="test" /> */}
			<ProTable<IWorksItemProps>
				columns={useTranslateColumns(columns)}
				request={async ({ pageSize: limit, userId, current: page, ...rest }) => {
					const { roleType, userId: id } = getUserInfo();
					if (roleType === 1) {
						userId = Number(userId || 0);
					} else {
						userId = id;
					}
					// 表单搜索项会从 params 传入，传递给后端接口。

					const body: IGetWorkListProps = { limit, page, userId: Number(userId || 0), ...rest };
					if (issueStatus) body.issueStatus = issueStatus;
					console.log(body, "body", roleType);
					const {
						data: { list, count },
					} = await getWorkList({ limit, page, issueStatus, ...body });
					return {
						data: list,
						total: count,
						success: true,
					};
				}}
				rowKey="workID"
				actionRef={ref}
				onReset={() => {
					issueStatus && navigate(RouterConfig.Path.works, { replace: true });
				}}
				search={{
					className: "search_part",
					optionRender: (...rest) => [
						...rest[2],
						<Button type="primary" key="out" onClick={() => navigate(RouterConfig.Path.worksDetail)}>
							新增
						</Button>,
					],
				}}
			/>
		</div>
	);
};

export default Works;
