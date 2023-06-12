import React, { useRef, useState } from "react";
import { ModalForm, ProColumns, ProTable } from "@ant-design/pro-components";
import {
	deviceDetail,
	deviceQueryall,
	IDeviceItemProps,
	IQuerytransferlogItemProps,
	querytransferlog,
	querylistbybatch,
	IDeviceAddProps,
} from "../../models/device";
import { Space } from "antd";
import Button from "../../components/button";
// import { activateStateEnum } from "../device";
import { formatTimeZoneTime, t } from "../../utils/tools";
import useTranslateColumns, { translateColumns } from "../../hooks/useTranslateColumns";
import Text from "../../components/text";
import "./index.scss";
import { DeviceTypeEnum } from "../../interface";

const TotalDeviceData = () => {
	// const [producted, setproducted] = useState(initialState);
	const deviceTableRef = useRef();

	const [currDeviceDetail, setcurrDeviceDetail] = useState<IDeviceItemProps>();
	const columns: ProColumns<IDeviceItemProps>[] = [
		{
			title: "序号",
			dataIndex: "key",
			search: false,
			renderText: (_, ...rest) => rest[1] + 1,
			width: 60,
		},
		// {
		// 	title: "生产批次",
		// 	dataIndex: "batchNumber",
		// 	// hideInSearch: true,
		// },
		// {
		// 	title: "所属商家",
		// 	dataIndex: "merchantName",
		// 	hideInSearch: true,
		// },
		// {
		// 	title: "设备类型",
		// 	dataIndex: "typeDesc",
		// 	hideInSearch: true,
		// 	renderText: (_: string) => t(_),
		// 	// valueEnum: convertValueEnum(DeviceTypeEnum),
		// },
		// {
		// 	title: "设备尺寸",
		// 	dataIndex: "sizeDesc",
		// 	// valueEnum: convertValueEnum(DeviceSizeEnum),
		// 	hideInSearch: true,
		// 	renderText: (_: string) => t(_),
		// },
		// {
		// 	title: "主板",
		// 	dataIndex: "mainboardSourceDesc",
		// 	// valueEnum: convertValueEnum(IMainboardSourceEnum),
		// 	hideInSearch: true,
		// 	renderText: (_: string) => t(_),
		// },
		// {
		// 	title: "画框材质",
		// 	dataIndex: "frameMaterialDesc",
		// 	// valueEnum: convertValueEnum(IFrameMaterialEnum),
		// 	hideInSearch: true,
		// 	renderText: (_: string) => t(_),
		// },
		// {
		// 	title: "屏幕镀膜",
		// 	dataIndex: "screenMembraneDesc",
		// 	// valueEnum: convertValueEnum(IScreenMembraneEnum),
		// 	hideInSearch: true,
		// 	renderText: (_: string) => t(_),
		// },
		// {
		// 	title: "是否测试机",
		// 	dataIndex: "testMachineDesc",
		// 	// valueEnum: ITestMachineEnum,
		// 	hideInSearch: true,
		// 	renderText: (_: string) => t(_),
		// },
		// {
		// 	title: "生产时间",
		// 	dataIndex: "createTimestamp",
		// 	hideInSearch: true,
		// 	renderText: (_: string) => formatTimeZoneTime(_),
		// },
		{
			title: "设备类型",
			dataIndex: "type",
			hideInSearch: true,
			valueEnum: DeviceTypeEnum,
			renderText: (text: DeviceTypeEnum) => <Text>{DeviceTypeEnum[text]}</Text>,
		},
		{
			title: "SN码",
			dataIndex: "sn",
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
			dataIndex: "activateState",
			valueType: "select",
			initialValue: "2",
			valueEnum: {
				"0": { text: t("未激活"), status: "Default" },
				"1": { text: t("已激活"), status: "Success" },
				"2": { text: t("全部"), status: "Default" },
			},
			fieldProps: { clearIcon: false },
		},
		{
			title: "操作",
			key: "option",
			width: 120,
			valueType: "option",
			render: (_, item) => (
				<Space>
					{/* <Button type="link">详情</Button> */}
					{/* {batchNumberDeviceModal(item)} */}
					{deviceDetailModal(item)}
				</Space>
			),
		},
	];

	const columnsDeviceDetail: ProColumns<IQuerytransferlogItemProps>[] = [
		{
			title: "序号",
			dataIndex: "key",
			search: false,
			renderText: (_, ...rest) => rest[1] + 1,
		},
		{
			title: "转移商家",
			dataIndex: "fromMerchantName",
			search: false,
		},
		{
			title: "接受商家",
			dataIndex: "toMerchantName",
			search: false,
		},
		{
			title: "转移时间",
			dataIndex: "create_time",
			renderText: (_: string) => formatTimeZoneTime(_),
			search: false,
		},
	];

	const batchNumberColumns: ProColumns<IDeviceItemProps>[] = [
		// {
		// 	title: "序号",
		// 	dataIndex: "key",
		// 	search: false,
		// 	fixed: true,
		// 	width: 80,
		// 	renderText: (_, ...rest) => rest[1] + 1,
		// },
		{
			title: "ID",
			dataIndex: "id",
			search: false,
			fixed: true,
			width: 80,
			hideInSearch: true,
			// renderText: (_, ...rest) => rest[1] + 1,
		},

		{
			title: "SN码",
			dataIndex: "sn",
			ellipsis: true,
			fixed: true,
			// hideInSearch: true,
		},
		// {
		// 	title: "设备类型",
		// 	dataIndex: "typeDesc",
		// 	valueEnum: DeviceTypeEnum,
		// 	hideInSearch: true,
		// },
		// {
		// 	title: "所属商家",
		// 	dataIndex: "merchantName",
		// 	hideInSearch: true,
		// },

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
		// {
		// 	title: "设备尺寸",
		// 	dataIndex: "sizeDesc",
		// 	valueEnum: DeviceSizeEnum,
		// 	hideInSearch: true,
		// },
		// {
		// 	title: "主板",
		// 	dataIndex: "mainboardSourceDesc",
		// 	hideInSearch: true,

		// 	// valueEnum: IMainboardSourceEnum,
		// },

		// {
		// 	title: "画框材质",
		// 	dataIndex: "frameMaterialDesc",
		// 	valueEnum: IFrameMaterialEnum,
		// 	hideInSearch: true,
		// },
		// {
		// 	title: "屏幕镀膜",
		// 	dataIndex: "screenMembraneDesc",
		// 	hideInSearch: true,
		// 	// valueEnum: IScreenMembraneEnum,
		// },

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
			valueType: "select",
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
			render: (_, item) => <Space>{deviceDetailModal(item)}</Space>,
		},
	];

	const batchNumberDeviceModal = (item: IDeviceItemProps) => {
		return (
			<ModalForm<IDeviceAddProps>
				title={`${t("批次详情")}-${item.batchNumber}`}
				trigger={
					// <Button type="link">{batchNumber}</Button>
					<Button type="link">详情</Button>
				}
				// grid={true}
				width="60%"
				modalProps={{ destroyOnClose: true }}
				submitter={false}
				layout="horizontal"
			>
				{/* <div>
					<Button style={{ marginBottom: 10 }} onClick={downloadExcel}>
						导出
					</Button>
				</div> */}
				<ProTable
					style={{ width: "100%" }}
					scroll={{ x: 2000 }}
					columns={translateColumns(batchNumberColumns)}
					// search={false}
					toolBarRender={false}
					search={{
						labelWidth: "auto",
					}}
					rowKey="sn"
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
							batchNumber: item?.batchNumber,
							producted,
							activateState,
							...rest,
						});

						const tlist = list.map((item) => {
							return {
								...item,
								activateStateDesc: t(item.activateStateDesc),
								productedDesc: t(item.productedDesc),
							};
						});

						return {
							data: tlist,
							total: count,
							success: true,
						};
					}}
				/>
			</ModalForm>
		);
	};
	console.log(batchNumberDeviceModal);

	const deviceDetailModal = (item: IDeviceItemProps) => {
		console.log(currDeviceDetail, "currDeviceDetail");

		return (
			<ModalForm
				className="device_detail_modal"
				title={t("设备详细信息")}
				trigger={<Button>详情</Button>}
				grid={true}
				width="56%"
				layout="horizontal"
				submitter={false}
				request={async () => {
					const { data } = await deviceDetail(item.id);
					setcurrDeviceDetail(data);
					return true;
				}}
			>
				<div className="device_detail_body">
					<div className="detail_box">
						<div className="row">
							<div className="label">{t("批次号")}: </div>
							<div className="value">{t(currDeviceDetail?.batchNumber)} </div>
						</div>
						<div className="row">
							<div className="label">{t("设备SN")}: </div>
							<div className="value">{t(currDeviceDetail?.sn)} </div>
						</div>
						<div className="row">
							<div className="label">{t("设备尺寸")}: </div>
							<div className="value">{t(currDeviceDetail?.sizeDesc)} </div>
						</div>
						<div className="row">
							<div className="label">{t("主板")}: </div>
							<div className="value">{t(currDeviceDetail?.mainboardSourceDesc)} </div>
						</div>
						<div className="row">
							<div className="label">{t("画框材质")}: </div>
							<div className="value">{t(currDeviceDetail?.frameMaterialDesc)} </div>
						</div>
						<div className="row">
							<div className="label">{t("屏幕镀膜")}: </div>
							<div className="value">{t(currDeviceDetail?.screenMembraneDesc)} </div>
						</div>
					</div>

					<ProTable<IQuerytransferlogItemProps>
						search={false}
						toolBarRender={false}
						actionRef={deviceTableRef}
						columns={translateColumns(columnsDeviceDetail)}
						request={async ({ pageSize: limit, current: page, activateState, ...rest }) => {
							const { data } = await querytransferlog({ id: item.id, limit, page, ...rest });
							return {
								data: data.list,
								total: data.count,
								success: true,
							};
						}}
						// params={  producted }}
						rowKey="id"
					/>
				</div>
			</ModalForm>
		);
	};

	return (
		<div>
			<ProTable<IDeviceItemProps>
				actionRef={deviceTableRef}
				columns={useTranslateColumns(columns)}
				search={{ labelWidth: "auto" }}
				scroll={{ x: 1300 }}
				request={async ({
					pageSize: limit,
					current: page,
					activateState,
					...rest
				}: {
					pageSize: number;
					current: number;
					activateState: string | number;
				}) => {
					activateState = Number(activateState);
					const { data } = await deviceQueryall({ limit, page, producted: 2, activateState, ...rest });
					return {
						data: data.list,
						total: data.count,
						success: true,
					};
				}}
				// params={{ producted }}
				rowKey="id"
			/>
		</div>
	);
};

export default TotalDeviceData;
