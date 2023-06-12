import { ProColumns } from "@ant-design/pro-components";
// import { activateStateEnum } from ".";
import { activateStateEnum, DeviceTypeEnum } from "../../interface";
import { IDeviceItemProps } from "../../models/device";
import { isAdmin } from "../main/_defaultProps";

const columns: ProColumns<IDeviceItemProps>[] = [
	{
		title: "序号",
		dataIndex: "key",
		search: false,
		fixed: true,
		width: 80,
		renderText: (_, ...rest) => rest[1] + 1,
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
		dataIndex: "type",
		hideInSearch: true,
		valueEnum: DeviceTypeEnum,
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
		fieldProps: { clearIcon: false },
		valueEnum: activateStateEnum,
	},
];
export default columns;
