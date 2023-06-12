import { axiosPost } from "../utils/axios";
import { IUserInfoProps } from "../utils/tools";

interface ILoginProps {
	email: string;
	password: string;
}
export interface IUserSetpasswordProps {
	email: string;
	verificationCode?: string;
	newPassword?: string;
}

export const userLogin = async (props: ILoginProps) => {
	return axiosPost<IUserInfoProps>({ url: "/user/login", data: props });
};

export const userVerificationCode = async (email: string, language: string) => {
	return axiosPost({ url: "/user/verificationReq", data: { email, language } });
};

export const userSetpassword = async (props: IUserSetpasswordProps) => {
	return axiosPost({ url: "/user/setpassword", data: props });
};
// /user/setpassword
// /user/verificationCode
