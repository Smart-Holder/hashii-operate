import React, { useState, useRef } from "react";
import type { ListToolBarProps, ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, ModalForm, ProFormDependency } from "@ant-design/pro-components";
import Button from "../../components/button";
import { Space, Form, message, Modal, Table } from "antd";
import FormPart from "../../components/formPart";
import {
	deviceQuery,
	IDeviceItemProps,
	deviceAdd,
	IDeviceAddProps,
	deviceBatchnumber,
	deviceQuerybybatch,
	IDeviceOtherProps,
	deviceTransfer,
	querylistbybatch,
	deviceBindLog,
	deviceNftList,
	IDeviceNftListItemProps,
} from "../../models/device";
import { merchantQuery } from "../../models/merchant";
import Select, { convertValueEnum } from "../../components/select";
import ProFormInputNumber from "../../components/inputNumber";
import Radio from "../../components/radio";
import { isAdmin } from "../main/_defaultProps";
// import tab2Columns from "./tab2Columns";
import useTranslateColumns from "../../hooks/useTranslateColumns";
// import columns from "./columns";
// import nftListColumns from "./nftListColumns";
import {
	IScreenMembraneEnum,
	DeviceSizeEnum,
	DeviceTypeEnum,
	IBrandEnum,
	IFrameMaterialEnum,
	IMainboardSourceEnum,
	IResearchBrandEnum,
	ITestMachineEnum,
	// activateStateEnum,
} from "../../interface";
// import bindLogColumns from "./bindLogColumns";
// import batchNumberColumns from "./batchNumberColumns";
import { formatTimeZoneTime, t } from "../../utils/tools";
import "./index.scss";
import Medium from "../../components/medium";
// export const activateStateEnum = {
// 	"0": { text: t("未激活"), status: "Default" },
// 	"1": { text: t("已激活"), status: "Success" },
// 	"2": { text: t("全部"), status: "Default" },
// };

const ExportJsonExcel = require("js-export-excel"); // eslint-disable-line

export type TableListItem = {
	batchNumber: string;
	type: string | number;
	sn: string;
	cpuId: string;
	deviceAddress: string;
	versionAttribute: string;
	version: string;
	activatedState: string;
	isProducted: string;
	key: number;
};

const createDeviceFormInitialValues = { testMachine: 0, screenMembrane: 0 };

const Device = () => {
	const batchNumberColumns: ProColumns<IDeviceItemProps>[] = [
		{
			title: "ID",
			dataIndex: "id",
			search: false,
			fixed: true,
			width: 80,
			hideInSearch: true,
		},
		{
			title: "SN码",
			dataIndex: "sn",
			ellipsis: true,
			fixed: true,
		},
		{
			title: "CPUID",
			dataIndex: "cpuid",
			hideInSearch: true,
		},
		{
			title: "Address",
			dataIndex: "address",
			hideInSearch: true,
			ellipsis: true,
		},
		{
			title: "当前版本",
			dataIndex: "version",
			hideInSearch: true,
		},
		{
			title: "激活状态",
			dataIndex: "activateStateDesc",
			valueType: "select",
			initialValue: "2",
			valueEnum: {
				0: {
					text: t("未激活"),
					status: "Default",
				},
				1: {
					text: t("已激活"),
					status: "Success",
				},
				2: {
					text: t("全部"),
					status: "Success",
				},
			},
		},
		{
			title: "生产状态",
			dataIndex: "productedDesc",
			initialValue: "2",
			valueEnum: {
				0: {
					text: t("未生产"),
					status: "Default",
				},
				1: {
					text: t("已生产"),
					status: "Success",
				},
				2: {
					text: t("全部"),
					status: "Success",
				},
			},
		},
		{
			title: "操作",
			key: "option",
			width: "20%",
			ellipsis: true,
			valueType: "option",
			render: (_, item) => (
				<Space>
					{Boolean(item.producted) && [
						<Button
							type="link"
							key="bind"
							onClick={() => {
								setcurrDevice(item);
								setbindLogOpen(true);
							}}
						>
							绑定日志
						</Button>,
						<Button
							key="nft"
							type="link"
							onClick={() => {
								setcurrDevice(item);
								setnftListOpen(true);
							}}
						>
							NFT列表
						</Button>,
						<Button
							type="link"
							key="tref"
							onClick={() => {
								settransferDevcieModalOpen(true);
								setselectedRows([item]);
							}}
						>
							转移
						</Button>,
					]}
				</Space>
			),
		},
	];

	const tbatchNumberColumns = useTranslateColumns(batchNumberColumns);
	const [modalForm] = Form.useForm<IDeviceAddProps>();
	const [transferModalForm] = Form.useForm<IDeviceAddProps>();
	const [transferDevcieModalOpen, settransferDevcieModalOpen] = useState<boolean>(false);
	const [selectedRows, setselectedRows] = useState<IDeviceItemProps[]>([]);
	// const [batchNumber, setbatchNumber] = useState<string>("");
	const [batchInfo, setbatchInfo] = useState<IDeviceItemProps>();

	const [bindLogOpen, setbindLogOpen] = useState<boolean>(false);
	const [nftListOpen, setnftListOpen] = useState<boolean>(false);
	const [deviceInfobybatch, setdeviceInfobybatch] = useState<IDeviceOtherProps>();
	const deviceTableRef = useRef<ActionType>();
	const deviceListref = useRef<ActionType>();

	const [listBatchData, setlistBatchData] = useState<IDeviceItemProps[]>([]);
	const [currDevice, setcurrDevice] = useState<IDeviceItemProps>();
	const [showbatchInfoModal, setshowbatchInfoModal] = useState<boolean>(false);

	const downloadExcel = () => {
		// console.log(batchNumber, "batchNumber");
		const tbatchInfo = [batchInfo].map((item) => {
			return {
				...item,
				typeDesc: t(item.typeDesc),
				merchantName: t(item.merchantName),
				sizeDesc: t(item.sizeDesc),
				mainboardSourceDesc: t(item.mainboardSourceDesc),
				frameMaterialDesc: t(item.frameMaterialDesc),
				screenMembraneDesc: t(item.screenMembraneDesc),
				testMachineDesc: t(item.testMachineDesc),
				activateStateDesc: t(item.activateStateDesc),
				createTimestamp: formatTimeZoneTime(item.createTimestamp),
			};
		});

		const sheetHeader = [...batchNumberColumns.map((item) => item.title)];
		const sheetFilter = [...batchNumberColumns.map((item) => item.dataIndex)];

		const sheetFilter2 = [...columns.map((item) => item.dataIndex)];
		const sheetHeader2 = [...columns.map((item) => item.title)];
		sheetFilter.pop();
		sheetHeader.pop();
		sheetFilter2.pop();
		sheetHeader2.pop();
		const option = {
			fileName: `${t("批次")}-${batchInfo?.batchNumber}`,
			datas: [
				{
					sheetData: [...listBatchData],
					sheetName: t("设备列表"),
					sheetFilter,
					sheetHeader,
				},
				{
					sheetData: tbatchInfo,
					sheetName: t("批次信息"),
					sheetFilter: sheetFilter2,
					sheetHeader: sheetHeader2,
				},
			],
		};

		const toExcel = new ExportJsonExcel(option); // eslint-disable-line
		toExcel.saveExcel(); // eslint-disable-line
	};

	const columns: ProColumns<IDeviceItemProps>[] = [
		{
			title: "ID",
			dataIndex: "id",
			search: false,
			fixed: true,
			width: 60,
			// renderText: (_, ...rest) => rest[1] + 1,
		},
		{
			title: "生产批次",
			dataIndex: "batchNumber",
			copyable: true,
			// hideInTable: !isAdmin,
			// hideInSearch: !isAdmin,
			fixed: true,
		},
		{
			title: "SN码",
			dataIndex: "sn",
			ellipsis: true,
			fixed: true,
			hideInTable: true,
			// hideInSearch: true,
		},
		{
			title: "所属商家",
			dataIndex: "merchantName",
			hideInSearch: true,
			hideInTable: !isAdmin,
			ellipsis: true,
		},
		{
			title: "设备类型",
			dataIndex: "typeDesc",
			hideInSearch: true,
			renderText: (_: string) => t(_),
		},
		{
			title: "设备尺寸",
			dataIndex: "sizeDesc",
			hideInSearch: true,
			renderText: (_: string) => t(_),
		},
		{
			title: "主板",
			dataIndex: "mainboardSourceDesc",
			hideInSearch: true,
			renderText: (_: string) => t(_),
		},
		{
			title: "画框材质",
			dataIndex: "frameMaterialDesc",
			hideInSearch: true,
			renderText: (_: string) => t(_),
		},
		{
			title: "屏幕镀膜",
			dataIndex: "screenMembraneDesc",
			hideInSearch: true,
			renderText: (_: string) => t(_),
		},
		{
			title: "是否测试机",
			dataIndex: "testMachineDesc",
			hideInSearch: true,
			renderText: (_: string) => t(_),
		},
		{
			title: "生产时间",
			dataIndex: "createTimestamp",
			hideInSearch: true,
			renderText: (_: string) => formatTimeZoneTime(_),
		},

		{
			title: "操作",
			key: "option",
			width: "20%",
			ellipsis: true,
			valueType: "option",
			render: (_, item) => (
				<Space>
					{/* {batchNumberDeviceModal(item)} */}
					<Button
						type="link"
						onClick={() => {
							setbatchInfo(item);
							setshowbatchInfoModal(true);
						}}
					>
						详情
					</Button>
				</Space>
			),
		},
	];

	const transfer_columns = [
		{
			title: "SN码",
			dataIndex: "sn",
		},
		{
			title: "设备类型",
			dataIndex: "type",
			valueEnum: DeviceTypeEnum,
		},
	];

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
			width: 100,
			valueEnum: {
				1: {
					text: t("预空投"),
					status: "Processing",
				},
				2: {
					text: t("存入成功"),
					status: "Success",
				},
			},
		},
	];

	// 获取商家列表
	const getMerchantQuery = async () => {
		const {
			data: { list },
		} = await merchantQuery({ limit: 999, page: 1 });
		return list;
	};

	// 生产设备弹框
	const CreateDeviceModal = (
		<ModalForm<IDeviceAddProps>
			title={t("生产设备")}
			trigger={<Button type="primary">生产设备</Button>}
			form={modalForm}
			grid={true}
			width="40%"
			modalProps={{
				destroyOnClose: true,
				onCancel: () => setdeviceInfobybatch(undefined),
			}}
			onFinish={async (value: IDeviceAddProps) => {
				console.log(value);
				const { data } = await deviceAdd(value);
				deviceTableRef?.current?.reload();
				setdeviceInfobybatch(undefined);
				setbatchInfo(data);
				setshowbatchInfoModal(true);
				message.success(t("提交成功"));
				return true;
			}}
			initialValues={createDeviceFormInitialValues}
		>
			<FormPart title="生产信息" gutter={8}>
				{/* <Select
					colProps={{ span: 12 }}
					name="userId"
					label="所属商家"
					placeholder="请选择所属商家"
					showSearch
					request={getMerchantQuery}
					fieldProps={{ fieldNames: { label: "name", value: "userId" } }}
					required
				/> */}
				<ProFormInputNumber
					required
					isInt
					maxLength={5}
					colProps={{ span: 12 }}
					name="amount"
					label="生产数量"
					placeholder="请输入生产数量"
					min={1}
				/>

				<Select
					colProps={{ span: 12 }}
					name="batchNumber"
					label="关联批次"
					showSearch
					debounceTime={2000}
					placeholder="请选择关联批次"
					request={async () => {
						const { data } = await deviceBatchnumber();
						return data.map((item) => ({ label: item, value: item }));
					}}
					fieldProps={{
						onChange: async (e: string) => {
							if (!e) {
								setdeviceInfobybatch(undefined);
								modalForm.resetFields();
								return false;
							}
							const { data } = await deviceQuerybybatch(e);
							const { batchNumber, amount, userId } = modalForm.getFieldsValue();
							modalForm.setFieldsValue(
								e ? { ...data, batchNumber, amount, userId } : createDeviceFormInitialValues
							);
							setdeviceInfobybatch(data);
						},
					}}
				/>
			</FormPart>
			<FormPart title="设备属性" gutter={8}>
				<Select
					readonly={Boolean(deviceInfobybatch)}
					colProps={{ span: 12 }}
					name="type"
					label="设备类型"
					placeholder="请选择设备类型"
					required
					valueEnum={convertValueEnum(DeviceTypeEnum)}
				/>
				<Select
					readonly={Boolean(deviceInfobybatch)}
					colProps={{ span: 12 }}
					name="size"
					label="设备尺寸"
					placeholder="请选择设备尺寸"
					required
					valueEnum={convertValueEnum(DeviceSizeEnum)}
				/>

				<Select
					readonly={Boolean(deviceInfobybatch)}
					colProps={{ span: 12 }}
					name="mainboardSource"
					label="主板"
					placeholder="请选择主板"
					required
					valueEnum={convertValueEnum(IMainboardSourceEnum)}
					fieldProps={{
						onChange: () => {
							modalForm.setFieldValue("brand", undefined);
						},
					}}
				/>

				<ProFormDependency name={["mainboardSource"]}>
					{({ mainboardSource }) => {
						return (
							<Select
								readonly={Boolean(deviceInfobybatch)}
								colProps={{ span: 12 }}
								name="brand"
								label="主板类型"
								placeholder="请选择主板类型"
								required
								valueEnum={convertValueEnum(!mainboardSource ? IBrandEnum : IResearchBrandEnum)}
							/>
						);
					}}
				</ProFormDependency>

				<Select
					readonly={Boolean(deviceInfobybatch)}
					colProps={{ span: 12 }}
					name="frameMaterial"
					label="画框材质"
					placeholder="请选择画框材质"
					required
					valueEnum={convertValueEnum(IFrameMaterialEnum)}
				/>

				<Radio
					readonly={Boolean(deviceInfobybatch)}
					colProps={{ span: 12 }}
					name="screenMembrane"
					label="屏幕镀膜"
					placeholder="请选择屏幕镀膜"
					required
					valueEnum={convertValueEnum(IScreenMembraneEnum)}
				/>

				<Radio
					readonly={Boolean(deviceInfobybatch)}
					colProps={{ span: 12 }}
					name="testMachine"
					label="测试机"
					placeholder="请选择测试机"
					required
					valueEnum={convertValueEnum(ITestMachineEnum)}
				/>
			</FormPart>
		</ModalForm>
	);

	const confirmTransfer = async () => {
		const { userId } = await transferModalForm.validateFields();
		await deviceTransfer({ userId, id: selectedRows.map((item) => item.id) });
		message.success(t("转移完成"));
		deviceListref.current.reload();
		deviceTableRef.current.reload();

		settransferDevcieModalOpen(false);
	};

	const TransferDevcieModal = (
		<ModalForm<IDeviceAddProps>
			title={t("转移")}
			form={transferModalForm}
			width="40%"
			layout="horizontal"
			modalProps={{
				destroyOnClose: true,
				onCancel: () => settransferDevcieModalOpen(false),
			}}
			className="transfer_modal"
			submitter={false}
			open={transferDevcieModalOpen}
		>
			<div className="transfer_merchant">
				<Select
					name="userId"
					label="转移给"
					placeholder="请选择转移商家"
					request={getMerchantQuery}
					fieldProps={{ fieldNames: { label: "name", value: "userId" } }}
					addonAfter={<Button onClick={confirmTransfer}>确认</Button>}
					required
				/>
			</div>

			<ProTable
				columns={useTranslateColumns(transfer_columns)}
				search={false}
				toolBarRender={false}
				dataSource={selectedRows}
			/>
		</ModalForm>
	);

	const request = async ({
		pageSize: limit,
		current: page,
		producted,
		activateState,
		...rest
	}: {
		pageSize: number;
		current: number;
		producted: string;
		activateState: string;
	}) => {
		const props = {
			limit,
			page,
			...rest,
		};
		const { data } = await deviceQuery(props);
		return {
			data: data.list,
			total: data.count,
			success: true,
		};
	};

	const toolbar: ListToolBarProps = {
		filter: [CreateDeviceModal],
	};

	const columns1 = useTranslateColumns(columns);

	const bindLogColumns: ProColumns<IDeviceItemProps>[] = [
		{
			title: "序号",
			dataIndex: "key",
			search: false,
			render: (...rest) => rest[2] + 1,
		},

		{
			title: "钱包地址",
			dataIndex: "owner",
		},
		{
			title: "绑定address",
			dataIndex: "address",
		},
		{
			title: "绑定时间",
			dataIndex: "bindTime",
			renderText: (_: string) => formatTimeZoneTime(_),
		},
		{
			title: "解绑时间",
			dataIndex: "unbindTime",
			renderText: (_: string) => formatTimeZoneTime(_),
		},

		{
			title: "状态",
			dataIndex: "status",
			valueType: "select",
			valueEnum: {
				"0": { text: t("绑定"), status: "Success" },
				"1": { text: t("解绑"), status: "Default" },
				"2": { text: t("预绑定"), status: "Processing" },
				"3": { text: t("绑定失败"), status: "Error" },
				"4": { text: t("预解绑"), status: "Processing" },
			},
			width: 120,
		},
	];

	return (
		<div>
			<ProTable<IDeviceItemProps>
				actionRef={deviceTableRef}
				columns={columns1}
				request={request}
				toolbar={isAdmin && toolbar}
				scroll={{ x: 1200 }}
				rowKey="id"
				search={{
					labelWidth: "auto",
				}}
			/>

			{TransferDevcieModal}

			<Modal
				open={showbatchInfoModal}
				title={`${t("批次详情")}-${batchInfo?.batchNumber}`}
				width="80%"
				destroyOnClose={true}
				footer={false}
				onCancel={() => setshowbatchInfoModal(false)}
			>
				<ProTable
					style={{ width: "100%" }}
					scroll={{ x: 2000 }}
					columns={tbatchNumberColumns}
					toolBarRender={false}
					actionRef={deviceListref}
					rowKey="sn"
					search={{
						labelWidth: "auto",
						optionRender: (...rest) => [...rest[2], <Button onClick={downloadExcel}>导出</Button>],
					}}
					rowSelection={{
						selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
						getCheckboxProps: (record: IDeviceItemProps) => ({
							disabled: record.producted === 0, // Column configuration not to be checked
						}),
					}}
					tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
						console.log(selectedRowKeys, selectedRows);
						return (
							<Space size={24}>
								<span>
									{t("已选")} {selectedRowKeys.length} {t("项")}
									<Button
										type="link"
										style={{ marginInlineStart: 8 }}
										onClick={() => {
											onCleanSelected();
											setselectedRows([]);
										}}
									>
										取消选择
									</Button>
								</span>
							</Space>
						);
					}}
					tableAlertOptionRender={({ selectedRows }) => {
						return (
							<Space size={16}>
								<Button
									type="link"
									onClick={() => {
										console.log(selectedRows, "selectedRows");

										settransferDevcieModalOpen(true);
										setselectedRows(selectedRows);
									}}
								>
									批量转移
								</Button>
							</Space>
						);
					}}
					request={async ({
						pageSize: limit,
						current: page,
						productedDesc = 2,
						activateStateDesc = 2,
						...rest
					}) => {
						const producted = Number(productedDesc);
						const activateState = Number(activateStateDesc);

						const {
							data: { list, count },
						} = await querylistbybatch({
							limit,
							page,
							batchNumber: batchInfo?.batchNumber,
							producted,
							activateState,
							...rest,
						});

						const tlist = list.map((item) => {
							return {
								...item,
								typeDesc: t(item.typeDesc),
								sizeDesc: t(item.sizeDesc),
								mainboardSourceDesc: t(item.mainboardSourceDesc),
								frameMaterialDesc: t(item.frameMaterialDesc),
								screenMembraneDesc: t(item.screenMembraneDesc),
								testMachineDesc: t(item.testMachineDesc),
								activateStateDesc: t(item.activateStateDesc),
								productedDesc: t(item.productedDesc),
							};
						});
						setlistBatchData(tlist);
						return {
							data: tlist,
							total: count,
							success: true,
						};
					}}
				/>
			</Modal>

			<Modal
				open={bindLogOpen}
				width="80%"
				title={t("绑定日志")}
				footer={false}
				onCancel={() => setbindLogOpen(false)}
				destroyOnClose={true}
			>
				<ProTable<IDeviceItemProps>
					columns={useTranslateColumns(bindLogColumns)}
					search={false}
					toolBarRender={false}
					request={async ({ pageSize: limit, current: page }) => {
						const {
							data: { list, count },
						} = await deviceBindLog({ page, limit, address: currDevice.address });
						return {
							data: list,
							total: count,
							success: true,
						};
					}}
				/>
			</Modal>

			<Modal
				open={nftListOpen}
				width="80%"
				title={t("NFT列表")}
				footer={false}
				onCancel={() => setnftListOpen(false)}
				destroyOnClose
			>
				<ProTable<IDeviceNftListItemProps>
					columns={useTranslateColumns(nftListColumns)}
					search={false}
					toolBarRender={false}
					request={async ({ pageSize: limit, current: page }) => {
						const {
							data: { list, count },
						} = await deviceNftList({ limit, page, sn: currDevice.sn });
						return Promise.resolve({
							data: list,
							total: count,
							success: true,
						});
					}}
				/>
			</Modal>
		</div>
	);
};

export default Device;
