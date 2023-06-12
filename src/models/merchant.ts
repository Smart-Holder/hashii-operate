import { axiosPost } from "../utils/axios";
import { IListResultProps, IListPageProps } from "./interface";

interface IMerchantQueryProps extends IListPageProps {
	name?: string;
	email?: string;
}

export interface IMerchantQueryResult {
	userId: string;
	merchant: string;
	linkman: string;
	email: string;
	createTime: string;
	state: string;
	name: string;
}

export interface IMerchantAddProps {
	name: string;
	linkman: string;
	email: string;
	country?: string;
	province?: string;
	city?: string;
	address?: string;
	globalRoaming?: string;
	phone?: string;
	license?: string;
	userId?: string | number;
}

interface IMerchantForbiddenProps {
	userId: string;
	state: string | number;
}

export const merchantQuery = async (props?: IMerchantQueryProps) => {
	return axiosPost<IListResultProps<IMerchantQueryResult[]>>({ url: "/merchant/query", data: props });
};

export const merchantAdd = async (props?: IMerchantAddProps) => {
	return axiosPost({ url: "/merchant/add", data: props });
};

export const merchantEdit = async (props?: IMerchantAddProps) => {
	return axiosPost({ url: "/merchant/edit", data: props });
};

export const merchantForbidden = async (props?: IMerchantForbiddenProps) => {
	return axiosPost({ url: "/merchant/forbidden", data: props });
};

export const merchantQuerybyid = async (userId?: string | number) => {
	return axiosPost<IMerchantAddProps>({ url: "/merchant/querybyid", data: { userId } });
};
