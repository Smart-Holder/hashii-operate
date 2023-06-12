import { axiosPost } from "../utils/axios";
import { RcFile } from "antd/es/upload";
interface ICompositeProps {
	waterMarkUrl: string;
	imgUrl: string;
}
export const upload = async (props: string | Blob | RcFile) => {
	const formData = new FormData();
	formData.append("file", props);
	return axiosPost<string>({
		url: "/file/upload",
		data: formData,
		headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "*/*" },
	});
};

export const composite = async (props: ICompositeProps) => {
	return axiosPost<string>({ url: "/file/composite", data: props });
};

// /service/file/composite
