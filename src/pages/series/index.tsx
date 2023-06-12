import React, { useRef, useState } from "react";
import SeriesForm from "./seriesForm";
import Button from "../../components/button";
import Medium from "../../components/medium";
import { Space, message, Popconfirm } from "antd";
import { isAdmin } from "../main/_defaultProps";
import { ProTable } from "@ant-design/pro-components";
import { getNFTList, INftItemProps } from "../../models/nft";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { getSeriesList, ISeriesItemProps, seriesChangeStatus, seriesReChain } from "../../models/series";
import { ProColumns, ActionType, ModalForm } from "@ant-design/pro-components";
import "./index.scss";
import useTranslateColumns from "../../hooks/useTranslateColumns";
import { t } from "../../utils/tools";

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

const Series = () => {
	const ref = useRef<ActionType>();
	const [polling, setPolling] = useState<undefined | number>();
	const AirdropModal = SeriesForm;

	const columns: ProColumns<ISeriesItemProps>[] = [
		{
			title: "序号",
			dataIndex: "key",
			render: (...rest) => rest[2] + 1,
			search: false,
			width: 60,
		},
		{
			title: "添加人",
			dataIndex: "account",
			hideInSearch: true,
			ellipsis: true,
		},
		{
			title: "所属商家",
			dataIndex: "merchantName",
			valueType: "select",
			hideInSearch: true,
			hideInTable: !isAdmin,
			ellipsis: true,
		},

		{
			title: "系列名称",
			dataIndex: "seriesName",
			copyable: true,
		},
		{
			title: "描述",
			dataIndex: "seriesDesc",
			hideInSearch: true,
			ellipsis: true,
		},
		{
			title: "数量",
			dataIndex: "seriesNum",
			hideInSearch: true,
			render: (_, item) => {
				return nftList(item);
			},
		},

		{
			title: "已发行",
			dataIndex: "issueNum",
			hideInSearch: true,
		},
		{
			title: "可发行",
			dataIndex: "canIssueNum",
			hideInSearch: true,
		},

		{
			title: "状态",
			dataIndex: "seriesStatus",
			valueType: "select",
			valueEnum: {
				1: { text: "启用", status: "Success" },
				2: { text: "禁用", status: "Error" },
			},
			hideInSearch: true,
		},
		{
			title: "上链状态",
			dataIndex: "seriesIssueStatus",
			valueType: "select",
			valueEnum: {
				2: { text: t("上链中"), status: "Processing" },
				3: { text: t("上链成功"), status: "Success" },
				4: { text: t("上链失败"), status: "Error" },
				5: { text: t("合约abi错误"), status: "Error" },
			},
		},
		{
			title: "操作",
			key: "option",
			width: 120,
			hideInSearch: true,
			render: (_, { seriesStatus, seriesIssueStatus, seriesID }) => (
				<Space>
					{Boolean(seriesIssueStatus === 3) && (
						<div>
							{seriesStatus === 1 ? (
								<Popconfirm
									key="pop"
									placement="topRight"
									title={t("操作提示")}
									description={t("禁用后该系列无法用于发行，确定要禁用该系列？")}
									onConfirm={async () => {
										await seriesChangeStatus({ seriesID, seriesStatus: 2 });
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
										await seriesChangeStatus({ seriesID, seriesStatus: 1 });
										message.success(t("启用完成"));
										ref.current.reload();
									}}
								>
									启用
								</Button>
							)}
						</div>
					)}
					{Boolean([4, 5].includes(seriesIssueStatus)) && (
						<Button
							type="link"
							key="warn"
							onClick={async () => {
								await seriesReChain(seriesID);
								ref.current.reload();
								message.success(t("已重新发起上链"));
							}}
						>
							重新上链
						</Button>
					)}
				</Space>
			),
		},
	];

	const nftColumns: ProColumns<INftItemProps>[] = [
		{
			title: "藏品id",
			dataIndex: "nftID",
			hideInSearch: true,
			ellipsis: true,
			width: 60,
			fixed: "left",
		},

		{
			title: "作品名称",
			dataIndex: "workName",
			hideInSearch: true,
			ellipsis: true,
			width: 120,
		},

		{
			title: "水印图片",
			dataIndex: "waterMarkUrl",
			hideInSearch: true,
			valueType: "image",
			className: "waterMarkUrl",
			width: 120,
		},

		{
			title: "藏品图片",
			dataIndex: "nftUrl",
			hideInSearch: true,
			ellipsis: true,
			width: 120,
			render: (_, item) => {
				return <Medium path={item?.nftUrl || item.workPictureUrl} />;
			},
		},

		{
			title: "TokenId",
			dataIndex: "tokenID",
			hideInSearch: true,
		},
	];

	const nftList = (item: ISeriesItemProps) => {
		return (
			<ModalForm<ISeriesItemProps>
				title="NFT列表"
				trigger={<Button type="link">{item?.seriesNum}</Button>}
				grid={true}
				width="60%"
				key="nftModalForm"
				className="nftModalForm"
				modalProps={{
					destroyOnClose: true,
				}}
				submitter={false}
			>
				<ProTable<INftItemProps>
					columns={nftColumns}
					actionRef={ref}
					search={false}
					rowClassName="nft_row"
					request={async ({ pageSize: limit, current: page, seriesIssueStatus, ...rest }) => {
						const {
							data: { list, count },
						} = await getNFTList({ limit, page, seriesID: item?.seriesID, ...rest });
						return {
							data: list,
							success: true,
							total: count,
						};
					}}
				></ProTable>
			</ModalForm>
		);
	};

	return (
		<div>
			<ProTable<ISeriesItemProps>
				columns={useTranslateColumns(columns)}
				actionRef={ref}
				request={async ({ pageSize: limit, current: page, seriesIssueStatus, ...rest }) => {
					const {
						data: { list, count },
					} = await getSeriesList({ limit, page, seriesIssueStatus: Number(seriesIssueStatus), ...rest });
					return {
						data: list,
						success: true,
						total: count,
					};
				}}
				rowKey="seriesID"
				polling={polling}
				toolBarRender={() => [
					<Button
						key="3"
						type="primary"
						onClick={() => {
							if (polling) {
								setPolling(undefined);
								return;
							}
							setPolling(2000);
						}}
					>
						{polling ? (
							<>
								<LoadingOutlined />
								&nbsp; {t("停止轮询")}
							</>
						) : (
							<>
								<ReloadOutlined />
								&nbsp; {t("开始轮询")}
							</>
						)}
					</Button>,
				]}
				search={{
					labelWidth: "auto",
					className: "search_part",
					optionRender: (...rest) => [...rest[2], AirdropModal({ tableRef: ref })],
				}}
			/>
		</div>
	);
};

export default Series;
