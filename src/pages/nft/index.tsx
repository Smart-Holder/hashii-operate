import React, { useState, useEffect, useRef } from "react";
import { Space, Modal, Form, message, Popconfirm } from "antd";
import { getWorkList, IWorksItemProps } from "../../models/works";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { ProTable, ModalForm, ProFormDependency } from "@ant-design/pro-components";
import { composite } from "../../models/file";
import { airdropTypeEnum, RouterConfig } from "../../interface";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import NftModal from "../worksIssue/nftModal";
import ProFormInput from "../../components/input";
import CountDown from "../../components/countdown";
import { issueTypeEnum } from "../worksIssue";
import { DefaultOptionType } from "antd/es/select";
import Select, { convertValueEnum } from "../../components/select";
import { IDeviceItemProps, querybycondition } from "../../models/device";
import {
	INftItemProps,
	getNFTList,
	nftEdit,
	IAirdropProps,
	airdrop,
	airdropCancel,
	INftEditProps,
	sendDeviceRandom,
} from "../../models/nft";
// import workColumns from "./workColumns";
// import nftTableColumns from "./nftColumns";
import "./index.scss";
import { formatTimeZoneTime, t, getUserInfo } from "../../utils/tools";
import useTranslateColumns from "../../hooks/useTranslateColumns";
import Medium from "../../components/medium";

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

const useForm = Form.useForm;

interface ISelectDeviceItemProps extends DefaultOptionType, IDeviceItemProps {}

const Nft = () => {
	const navigate = useNavigate();
	const nftTableRef = useRef<ActionType>();
	const tableRef = useRef<ActionType>();
	const [modalForm] = useForm<IAirdropProps>();
	const [nftModalForm] = useForm<INftEditProps>();
	const [imgUrl, setimgUrl] = useState<string>("");
	const [nftUrl, setnftUrl] = useState<string>("");
	const [polling, setpolling] = useState<number>(2000);
	const [currNft, setcurrNft] = useState<INftItemProps>();
	const [waterMarkUrl, setwaterMarkUrl] = useState<string>("");
	const [nftModalOpen, setnftModalOpen] = useState<boolean>(false);
	const [currWorkInfo, setcurrWorkInfo] = useState<IWorksItemProps>();
	const [currDevice, setcurrDevice] = useState<ISelectDeviceItemProps>();

	const workColumns: ProColumns<IWorksItemProps>[] = [
		{
			title: "序号",
			dataIndex: "key",
			search: false,
			render: (...rest) => rest[2] + 1,
			width: 60,
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

		// {
		// 	title: "水印图片",
		// 	dataIndex: "waterMarkUrl",
		// 	hideInSearch: true,
		// 	valueType: "image",
		// 	className: "waterMarkUrl",
		// 	// hideInTable: Boolean(currWorkInfo?.isWaterMark === 2),
		// },

		{
			title: "藏品图片",
			dataIndex: "nftUrl",
			hideInSearch: true,
			ellipsis: true,
			width: 180,
			render: (_, item) => {
				return (
					<Medium
						// style={{ maxHeight: "140px" }}
						path={item.issueType === 2 ? item.workPictureUrl : item?.nftUrl}
					/>
				);
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
			renderText: (_: string, item) => (item.airdropType === 2 ? "" : _),
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
				6: { text: t("空投完成"), status: "Success" },
			},
		},
	];

	useEffect(() => {
		if (waterMarkUrl && imgUrl) getNftUrl(imgUrl, waterMarkUrl);
	}, [imgUrl, waterMarkUrl]);

	const getNftUrl = async (imgUrl: string, waterMarkUrl: string) => {
		const { data } = await composite({ imgUrl, waterMarkUrl });
		setnftUrl(data);
	};

	const editNftModal = (item?: INftItemProps) =>
		NftModal({
			onFinish: async (value: INftEditProps) => {
				const { nftID } = item;
				// console.log(value);
				console.log(value);

				await nftEdit({ nftID, imgUrl, nftUrl: nftUrl || imgUrl, waterMarkUrl });
				nftTableRef.current?.reload();
				return true;
			},
			form: nftModalForm,
			btn: <Button type="link">编辑</Button>,
			imgUrlChange: (e) => setimgUrl(e),
			waterMarkUrlChange: (e) => setwaterMarkUrl(e),
			showWaterMarkUrl: Boolean(item.waterMarkUrl),
			previewUrl: nftUrl,
			modalProps: {
				destroyOnClose: true,
				onCancel: () => setnftUrl(""),
			},
		});

	const AirdropModal = (
		<ModalForm<IAirdropProps>
			title={t("空投")}
			trigger={<Button type="link">空投</Button>}
			form={modalForm}
			grid={true}
			width="30%"
			modalProps={{
				destroyOnClose: true,
				onCancel: () => setcurrDevice(undefined),
				afterClose: () => setcurrDevice(undefined),
			}}
			onFinish={async (values: IAirdropProps) => {
				const { airdropType, key, random } = values;
				const { nftID } = currNft;
				await airdrop({
					airdropType,
					key,
					random,
					nftID,
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				});
				modalForm.resetFields();
				nftTableRef?.current.reload();
				message.success(t("提交成功"));
				return true;
			}}
			className="airdropModal"
			initialValues={{ issueType: currNft?.issueType }}
		>
			<Select
				name="airdropType"
				label="空投类型"
				placeholder="请选择空投类型"
				valueEnum={convertValueEnum(airdropTypeEnum)}
				required
				fieldProps={{
					onChange: () => {
						modalForm.setFieldValue("key", undefined);
						modalForm.setFieldValue("random", undefined);
					},
				}}
			/>

			<Select disabled name="issueType" label="发行类型" valueEnum={convertValueEnum(issueTypeEnum)} />

			<ProFormDependency className="sn_select" name={["airdropType"]}>
				{({ airdropType }) => {
					const activatedState = currDevice?.activateState;
					const sn = currDevice?.sn;
					console.log(currDevice, "currDevice");
					if (airdropType === 2) {
						return <ProFormInput name="key" label="钱包地址" placeholder="请输入钱包地址" required />;
					}
					return (
						<div className="sn_select">
							{/* <ProFormSelect<IDeviceItemProps> */}
							<Select
								name="key"
								label={t("SN   码")}
								placeholder={t("请选择SN   码")}
								required
								fieldProps={{
									fieldNames: { label: "sn", value: "sn" },
									showSearch: true,
									onChange: (_, item: ISelectDeviceItemProps) => {
										setcurrDevice(item);
									},
								}}
								debounceTime={2000}
								request={async () => {
									const { data } = await querybycondition({
										limit: 9999,
										page: 1,
										producted: 1,
										// activateState: 2,
									});
									return data.list;
								}}
								addonAfter={
									activatedState === 1 ? (
										<CountDown
											btnConfig={{ disabled: !modalForm.getFieldValue("key") }}
											onClick={async () => {
												await sendDeviceRandom({
													sn,
													timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
													nftID: currNft.nftID,
												});
											}}
										/>
									) : (
										false
									)
								}
								extra={
									Boolean(!activatedState && currDevice)
										? t(
												"设备还未激活，目前操作是预空投操作，提交成功后可在藏品管理里找到空投的藏品点击撤回解除预空投操作"
										  )
										: ""
								}
							/>
						</div>
					);
				}}
			</ProFormDependency>
			<ProFormDependency name={["airdropType"]}>
				{({ airdropType }) => {
					if (airdropType !== 2 && currDevice?.activateState === 1) {
						return <ProFormInput name="random" label="验证码" placeholder="请输入验证码" required />;
					}
				}}
			</ProFormDependency>
		</ModalForm>
	);

	const columns: ProColumns<IWorksItemProps>[] = [
		...workColumns,
		{
			title: "操作",
			key: "option",
			width: "22%",
			valueType: "option",

			render: (_, item) => (
				<Space>
					<Button
						type="link"
						tooltip="空投"
						onClick={() => {
							setcurrWorkInfo(item);
							setnftModalOpen(true);
						}}
					>
						藏品管理
					</Button>
				</Space>
			),
		},
	];

	const nftColumns: ProColumns<INftItemProps>[] = [
		...nftTableColumns,
		{
			title: "操作",
			dataIndex: "airdropStatus",
			hideInSearch: true,
			ellipsis: true,
			width: "16%",
			render: (_, item) => {
				if (item.airdropStatus === 4) return "-";
				return (
					<div style={{ display: "flex" }}>
						{item.airdropStatus === 4 && editNftModal(item)}
						{Boolean(item.airdropStatus === 2) && (
							<Popconfirm
								title={t("撤回提示")}
								description={t("撤回后设备将接收不到空投")}
								onConfirm={async () => {
									await airdropCancel(item.nftID);
									nftTableRef?.current.reload();
									message.success(t("撤回完成!"));
								}}
							>
								<Button type="link" key="2">
									撤回
								</Button>
							</Popconfirm>
						)}
						{![2, 3, 4, 6].includes(item.airdropStatus) && (
							<div onClick={() => setcurrNft(item)}>{AirdropModal}</div>
						)}
					</div>
				);
			},
		},
	];

	return (
		<div>
			<ProTable<IWorksItemProps>
				columns={useTranslateColumns(columns)}
				request={async ({ pageSize: limit, current: page, ...rest }) => {
					const { userId } = getUserInfo();
					const {
						data: { list, count },
					} = await getWorkList({ limit, page, issueStatus: 4, userId: Number(userId), ...rest });
					return {
						data: list,
						total: count,
						success: true,
					};
				}}
				actionRef={tableRef}
				rowKey="workID"
				search={{
					className: "search_part",
					optionRender: (...rest) => [
						...rest[2],
						<Button
							type="primary"
							key="out"
							onClick={() => navigate(`${RouterConfig.Path.works}?issueStatus=1`)}
						>
							新增发行
						</Button>,
					],
				}}
			/>

			<Modal
				footer={null}
				className="nftModal"
				title={t("藏品管理")}
				width="66%"
				open={nftModalOpen}
				onCancel={() => {
					setnftModalOpen(false);
					tableRef.current.reload();
				}}
				destroyOnClose
			>
				<ProTable<INftItemProps>
					search={false}
					columns={useTranslateColumns(nftColumns)}
					scroll={{ x: 1300 }}
					actionRef={nftTableRef}
					rowClassName="nft_row"
					polling={polling}
					rowKey="nftID"
					toolBarRender={() => [
						<Button
							key="3"
							type="primary"
							onClick={() => {
								if (polling) {
									setpolling(undefined);
									return;
								}
								setpolling(2000);
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
					request={async ({ pageSize: limit, current: page, ...rest }) => {
						const {
							data: { list, count },
						} = await getNFTList({ limit, page, workID: currWorkInfo?.workID, ...rest });
						return {
							data: list,
							success: true,
							total: count,
						};
					}}
				/>
			</Modal>
		</div>
	);
};

export default Nft;
