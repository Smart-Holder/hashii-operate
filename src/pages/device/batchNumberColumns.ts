import { ProColumns } from "@ant-design/pro-components";
import { DeviceSizeEnum, DeviceTypeEnum, IFrameMaterialEnum, ITestMachineEnum } from "../../interface";
import { IDeviceItemProps } from "../../models/device";

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
		// renderText: (_, ...rest) => rest[1] + 1,
	},

	{
		title: "SN码",
		dataIndex: "sn",
		ellipsis: true,
		fixed: true,
	},
	{
		title: "设备类型",
		dataIndex: "typeDesc",
		valueEnum: DeviceTypeEnum,
	},
	{
		title: "所属商家",
		dataIndex: "merchantName",
	},
	{
		title: "设备尺寸",
		dataIndex: "sizeDesc",
		valueEnum: DeviceSizeEnum,
	},
	{
		title: "主板",
		dataIndex: "mainboardSourceDesc",
		// valueEnum: IMainboardSourceEnum,
	},

	{
		title: "画框材质",
		dataIndex: "frameMaterialDesc",
		valueEnum: IFrameMaterialEnum,
	},
	{
		title: "屏幕镀膜",
		dataIndex: "screenMembraneDesc",
		// valueEnum: IScreenMembraneEnum,
	},
	{
		title: "是否测试机",
		dataIndex: "testMachineDesc",
		valueEnum: ITestMachineEnum,
	},
	{
		title: "状态",
		dataIndex: "activateStateDesc",
		valueType: "select",
		valueEnum: {
			0: {
				text: "未生产",
				status: "Default",
			},
			1: {
				text: "已生产",
				status: "Success",
			},
		},
	},
];

export default batchNumberColumns;
