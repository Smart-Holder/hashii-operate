import { axiosPost } from "../utils/axios";
import { IListResultProps, IListPageProps } from "./interface";

export interface ISeriesAddProps {
	chainName: string;
	seriesName: string;
	count: string;
	desc: string;
}

interface IGetSeriesListPorps extends IListPageProps {
	seriesName?: string;
	seriesIssueStatus?: number;
}

export interface ISeriesItemProps {
	seriesID: number;
	account: string;
	merchantName: string;
	seriesName: string;
	seriesDesc: string;
	seriesNum: string;
	issueNum: string;
	canIssueNum: string;
	seriesStatus: string | number;
	seriesIssueStatus: number;
}

interface ISeriesChangeStatusProps {
	seriesID: number;
	seriesStatus: number;
}

export interface IUserSeriesListItem {
	chainCanMintNum: number;
	seriesID: number;
	seriesIssueStatus: number;
	seriesName: string;
	disabled?: boolean;
}

interface IGetChainListProps {
	chainID: string;
	name: number;
}

interface IGetUserSeriesListItemProps {
	chainID: number;
	seriesStatus?: number;
}

// chainID: 1;
// name: "metis";
export const getSeriesList = async (props: IGetSeriesListPorps) => {
	return axiosPost<IListResultProps<ISeriesItemProps[]>>({ url: "/series/getSeriesList", data: props });
};

export const getUserSeriesList = async (props: IGetUserSeriesListItemProps) => {
	return axiosPost<IListResultProps<IUserSeriesListItem[]>>({
		url: "/series/getUserSeriesList",
		data: props,
	});
};

export const seriesAdd = async (props: ISeriesAddProps) => {
	return axiosPost({ url: "/series/add", data: props });
};

export const seriesChangeStatus = async (props: ISeriesChangeStatusProps) => {
	return axiosPost({ url: "/series/changeStatus", data: props });
};

export const seriesReChain = async (seriesID: number) => {
	return axiosPost({ url: "/series/reChain", data: { seriesID } });
};

export const getChainList = async () => {
	return axiosPost<IListResultProps<IGetChainListProps[]>>({ url: "/chain/getChainList" });
};
// /service/chain/getChainList
