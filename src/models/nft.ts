import { axiosPost } from "../utils/axios";
import { IListResultProps, IListPageProps } from "./interface";

export interface INftItemProps {
	nftID?: number;
	nftUrl?: string;
	waterMarkUrl?: string;
	tokenID?: string;
	airdropType?: number;
	deviceSN?: string;
	receiveAddr?: string;
	airdropBeginTime?: string;
	airdropEndTime?: string;
	airdropStatus?: number;
	issueType: number;
	workPictureUrl?: string;
	workName?: string;
}

interface IGetNFTListProps extends IListPageProps {
	workID?: number;
	airdropStatus?: string;
	seriesID?: number;
}

export interface INftEditProps {
	nftID: number;
	imgUrl: string;
	waterMarkUrl: string;
	nftUrl: string;
}

export interface IAirdropProps {
	nftID: number;
	airdropType: number;
	key: string;
	random?: number | string;
	timeZone: string;
}

interface ISendDeviceRandomProps {
	sn: string;
	timeZone: string;
	nftID: number;
}

export const getNFTList = async (props?: IGetNFTListProps) => {
	return axiosPost<IListResultProps<INftItemProps[]>>({ url: "/nft/getNFTList", data: props });
};

export const nftEdit = async (props?: INftEditProps) => {
	return axiosPost({ url: "/nft/edit", data: props });
};

export const airdrop = async (props?: IAirdropProps) => {
	return axiosPost({ url: "/nft/airdrop", data: props });
};

export const airdropCancel = async (nftID: number) => {
	return axiosPost({ url: "/nft/airdropCancel", data: { nftID } });
};

export const sendDeviceRandom = async (props: ISendDeviceRandomProps) => {
	return axiosPost({ url: "/nft/sendDeviceRandom", data: props });
};

// /nft/airdropCancel
