import { ProColumns } from "@ant-design/pro-components";
// import { deviceStatusEnum } from "../../interface";
import { IDeviceItemProps } from "../../models/device";
import { formatTimeZoneTime, t } from "../../utils/tools";

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
		// valueEnum: deviceStatusEnum,
		valueEnum: {
			"0": { text: t("绑定"), status: "Success" },
			"1": { text: t("解绑"), status: "Default" },
			"2": { text: t("预绑定"), status: "Processing" },
			"3": { text: t("绑定失败"), status: "Error" },
			"4": { text: t("预解绑"), status: "Processing" },
		},
		// renderText: (text: string) => t(deviceStatusEnum[text].text),
	},
];

export default bindLogColumns;
