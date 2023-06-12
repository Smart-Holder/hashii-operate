import { ProColumns } from "@ant-design/pro-components";
import { DeviceTypeEnum } from "../../interface";
// import { DeviceTypeEnum } from ".";
import { IDeviceItemProps } from "../../models/device";
import { formatTimeZoneTime } from "../../utils/tools";

const tab2Columns: ProColumns<IDeviceItemProps>[] = [
	{
		title: "序号",
		dataIndex: "key",
		render: (...rest) => rest[2] + 1,
		search: false,
	},

	{
		title: "生产批次",
		dataIndex: "batchNumber",
		copyable: true,
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
		title: "授权商家",
		dataIndex: "merchantName",
		hideInSearch: true,
	},
	{
		title: "生产时间",
		dataIndex: "createTimestamp",
		hideInSearch: true,
		renderText: (_: string) => formatTimeZoneTime(_),
	},
];
export default tab2Columns;
