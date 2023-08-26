import { axiosPost } from "../utils/axios";
import { IListResultProps, IListPageProps } from "./interface";

export interface IGetWorkListProps extends IListPageProps {
	userId?: number;
	workName?: string;
	creatorName?: string;
	issueStatus?: number;
}

export interface IWorksItemProps {
	workID: number;
	merchantName: string;
	workPictureUrl: string;
	workName: string;
	creatorName: string;
	creatorTime: string;
	chainName: string;
	seriesName: string;
	issueNum: string;
	chainNum: string;
	isWaterMark: number;
	userId: number;
}

export interface IWorksAddProps {
	workName: string;
	creatorName: string;
	creatorTime: string;
	size: string;
	owner: string;
	workPictureUrl: string;
	workDesc: string;
	workID?: string | number;
	is_transfer: string;
	issueExtension: string;
}

export interface IWorkIssueProps {
	workID: number;
	seriesID: number;
	issueType: number;
	issueNumber: number;
	isWaterMark: number;
	workPictureType?: number;
	waterMarkUrl?: number | string;
	nftUrl?: number | string;
	extensions?: IExtensionsItemProps[];
}

export interface IExtensionsItemProps {
	timerType: string;
	editNumber: string;
	imgUrl: string;
	waterMarkUrl: string;
	nftUrl: string;
	index?: number;
}

export const getWorkList = async (props?: IGetWorkListProps) => {
	return axiosPost<IListResultProps<IWorksItemProps[]>>({ url: "/work/getWorkList", data: props });
};

export const workAdd = async (props?: IWorksAddProps) => {
	return axiosPost({ url: "/work/add", data: props });
};

export const workEdit = async (props?: IWorksAddProps) => {
	return axiosPost({ url: "/work/edit", data: props });
};

export const getWorkDetail = async (workID?: number) => {
	return axiosPost<IWorksAddProps>({ url: "/work/getWorkDetail", data: { workID } });
};

export const workDelete = async (workID: number) => {
	return axiosPost({ url: "/work/delete", data: { workID } });
};

export const workIssue = async (props: IWorkIssueProps) => {
	return axiosPost({ url: "/work/issue", data: props });
};
