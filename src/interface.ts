export namespace RouterConfig {
	// namespace Path {
	export const enum Path {
		main = "/main",
		login = "/login",
		page1 = "/main/page1",
		merchant = "/main/merchant",
		works = "/main/works",
		worksDetail = "/main/works/worksDetail",
		worksIssue = "/main/works/worksIssue",
		merchantDetail = "/main/merchant/merchantDetail",
		device = "/main/device",
		nft = "/main/nft",
		series = "/main/series",
		apk = "/main/apk",

		totalDeviceData = "/main/totalDeviceData",
	}
	// }
}

export enum ChainNameEnum {
	metis = "metis",
	以太坊 = "以太坊",
}

export enum airdropTypeEnum {
	"空投到设备" = 1,
	"空投到钱包" = 2,
}

export enum DeviceTypeEnum {
	"Hashii数字加密版画" = 0,
	"创维Hashii" = 1,
	"Sanova" = 2,
	"SmartHolder" = 3,
}

export const activateStateEnum = {
	"0": { text: "未激活", status: "Default" },
	"1": { text: "已激活", status: "Success" },
	"2": { text: "全部", status: "Default" },
};

export const deviceStatusEnum = {
	"0": { text: "绑定", status: "Success" },
	"1": { text: "解绑", status: "Default" },
	"2": { text: "预绑定", status: "Processing" },
	"3": { text: "绑定失败", status: "Error" },
	"4": { text: "预解绑", status: "Processing" },
};

export enum DeviceSizeEnum {
	"21寸" = 2,
	"32寸" = 0,
	"43寸" = 1,
}

export enum IMainboardSourceEnum {
	"采购" = 0,
	"自研" = 1,
}

export enum IBrandEnum {
	"视美泰RK3288" = 0,
	"T982" = 1,
	// "PK3399" = 2,
	// "PK3288" = 3,
	// "视美通T982" = 4,
}

export enum IResearchBrandEnum {
	"第一代(RK3288)" = 0,
	"第二代(T982)" = 1,
}

export enum IFrameMaterialEnum {
	"wood木头" = 0,
	"metal金属" = 1,
	"plastic塑料" = 2,
}

export enum IScreenMembraneEnum {
	"非镀膜" = 0,
	"镀膜" = 1,
}

export enum ITestMachineEnum {
	"否" = 0,
	"是" = 1,
}
