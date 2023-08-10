import { axiosPost } from "../utils/axios";
import { IListResultProps, IListPageProps } from "./interface";
interface IApkQueryProps extends IListPageProps {
	name?: string;
}

export interface IApkItemProps {
	id: number;
	apkType: number;
	mainboardType: string;
	versionCode: number;
	versionName: string;
	url: string;
	must: number;
	description: string;
	time: string;
	forbidden: number;
}

export interface IApkAddProps {
	apkType?: number | number[];
	mainboardType?: string;
	versionCode?: number;
	versionName?: string;
	must?: number;
	url?: string;
	description?: string;
	id?: number;
	servMd5?: string;
	flags?: number;
}

interface IApkForbiddenProps {
	id: number;
	forbidden: number;
}

export interface IApkLogItem {
	account: number;
	accountName: string;
	apk_forbidden: number;
	create_time: string;
	deleted: number;
	device_id: number;
	fromMerchantName: string;
	from_merchant: number;
	id: number;
	record: string;
	record_type: number;
	toMerchantName: string;
	to_merchant: number;
	update_time: string;
}

export const apkQuery = async (props: IApkQueryProps) => {
	return axiosPost<IListResultProps<IApkItemProps[]>>({ url: "/apk/query", data: props });
};

export const apkAdd = async (props: IApkAddProps) => {
	return axiosPost({ url: "/apk/add", data: props });
};

export const apkEdit = async (props: IApkAddProps) => {
	return axiosPost({ url: "/apk/edit", data: props });
};

export const apkLog = async (id: number) => {
	return axiosPost<IListResultProps<IApkLogItem[]>>({ url: "/apk/log", data: { id } });
};

export const apkForbidden = async (props: IApkForbiddenProps) => {
	return axiosPost({ url: "/apk/forbidden", data: props });
};

export const apkQuerybyid = async (id: number) => {
	return axiosPost<IApkItemProps>({ url: "/apk/querybyid", data: { id } });
};

// /apk/querybyid
