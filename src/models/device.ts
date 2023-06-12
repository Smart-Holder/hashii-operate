import { axiosPost } from "../utils/axios";
import { IListResultProps, IListPageProps } from "./interface";

interface IDeviceQueryProps extends IListPageProps {
	sn?: string;
	batchNumber?: string;
	producted?: string | number;
	activateState?: string | number;
}

export interface IDeviceItemProps {
	id: number;
	batchNumber: string;
	type: string;
	SNCode: string;
	sn: string;
	cpuId: string;
	address: string;
	versionAttribute: string;
	version: string;
	activateState: number;
	isProducted: string;
	batchNumberDesc: string;
	typeDesc: string;
	sizeDesc: string;
	mainboardSourceDesc: string;
	brandDesc: string;
	frameMaterialDesc: string;
	screenMembraneDesc: string;
	testMachineDesc: string;
	activateStateDesc: string;
	productedDesc: string;
	merchantName: string;
	producted: number;
	createTimestamp: number;
}

export interface IDeviceAddProps {
	amount: number;
	batchNumber?: number;
	type: number;
	size: number;
	mainboardSource: number;
	brand: number;
	frameMaterial: number;
	screenMembrane: number;
	testMachine: number;
	userId: number;
}

export interface IDeviceOtherProps {
	size: number;
	fainboardSource: number;
	brand: number;
	frameMaterial: number;
	screenMembrane: number;
	testMachine: number;
}

interface IDeviceTransferProps {
	id: (string | number)[];
	userId: string | number;
}

interface IQuerylistbybatchProps extends IListPageProps {
	batchNumber: string;
	producted: number;
	activateState: number;
}

// interface IQuerylistbybatchItem

export interface IQuerytransferlogItemProps {
	id: number;
	account: number;
	record: string;
	record_type: number;
	device_id: number;
	from_merchant: number;
	to_merchant: number;
	fromMerchantName: string;
	toMerchantName: string;
	accountName: number;
	apk_forbidden: number;
	deleted: number;
	create_time: string;
	update_time: string;
}

export interface IDeviceNftListItemProps {
	id: number;
	pictureUrl: string;
	tokenId: string;
	mediaUrl: string;
	mediaOrigin: string;
	imageOrigin: string;
	image: string;
	chain: string;
	address: string;
	transferTime: string;
	status: number;
}

interface IQuerytransferlogProps extends IListPageProps {
	id: number;
}

interface IDeviceBindLogProps extends IListPageProps {
	address: string;
}

interface IDeviceNftListProps extends IListPageProps {
	sn: string;
}

export const deviceQuery = async (props?: IDeviceQueryProps) => {
	return axiosPost<IListResultProps<IDeviceItemProps[]>>({ url: "/device/query", data: props });
};

export const querybycondition = async (props?: IDeviceQueryProps) => {
	return axiosPost<IListResultProps<IDeviceItemProps[]>>({ url: "/device/querybycondition", data: props });
};

export const deviceAdd = async (props?: IDeviceAddProps) => {
	return axiosPost<IDeviceItemProps>({ url: "/device/add", data: props });
};

export const deviceDetail = async (id?: number) => {
	return axiosPost<IDeviceItemProps>({ url: "/device/detail", data: { id } });
};

export const deviceBatchnumber = async () => {
	return axiosPost<string[]>({ url: "/device/batchnumber" });
};

export const deviceQuerybybatch = async (batchNumber: string) => {
	return axiosPost<IDeviceOtherProps>({ url: "/device/querybybatch", data: { batchNumber } });
};

export const deviceTransfer = async (props: IDeviceTransferProps) => {
	return axiosPost({ url: "/device/transfer", data: props });
};

export const querylistbybatch = async (props: IQuerylistbybatchProps) => {
	return axiosPost<IListResultProps<IDeviceItemProps[]>>({ url: "/device/querylistbybatch", data: props });
};

export const querytransferlog = async (props: IQuerytransferlogProps) => {
	return axiosPost<IListResultProps<IQuerytransferlogItemProps[]>>({ url: "/device/querytransferlog", data: props });
};

export const deviceBindLog = async (props: IDeviceBindLogProps) => {
	return axiosPost<IListResultProps<IDeviceItemProps[]>>({ url: "/device/bindLog", data: props });
};

export const deviceNftList = async (props: IDeviceNftListProps) => {
	return axiosPost<IListResultProps<IDeviceNftListItemProps[]>>({ url: "/device/nftlist", data: props });
};

export const deviceQueryall = async (props: IDeviceQueryProps) => {
	return axiosPost<IListResultProps<IDeviceItemProps[]>>({ url: "/device/queryall", data: props });
};

// /service/nftList
// /service/nft/sendDeviceRandom
// /device/bindLog
// /device/querylistbybatch
// /device/querytransferlog
