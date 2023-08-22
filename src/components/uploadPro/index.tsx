import { FormInstance, UploadFile, message } from "antd";
import React, { useState, useEffect } from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";
// import { upload } from "../../models/utils";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import { omit } from "../../tools/utils";
import "./index.scss";
// import { upload } from "../../models/file";
import { RcFile } from "antd/es/upload";
import { ProFormUploadButton, ProFormUploadButtonProps } from "@ant-design/pro-components";
import { t } from "../../utils/tools";
import { RuleObject } from "antd/es/form";
import { AwsUpload } from "../../utils/axios";
import moment from "moment";

export interface IFileListItemProps extends UploadFile {
	uid: string;
	name: string;
	// status?: string;
	url?: string;
	image?: string;
}

// export type IUploadEventProps = 'start' | 'success' | 'error';
export type IUploadEventProps = "start" | string | "error";

interface IUploadQiniuProps extends ProFormUploadButtonProps {
	children?: React.ReactNode;
	// formItemConfig?: IFormItemProps;
	form?: FormInstance;
	uploadEventChange?: IUploadEventChangeProps;
	banSuffix?: string[];
}

export type IUploadEventChangeProps = (event: IUploadEventProps) => void;

const ProUpload = (props: IUploadQiniuProps) => {
	const [loading, setloading] = useState<boolean>(false);

	const [fileList, setfileList] = useState<IFileListItemProps[]>([]);

	const { form, uploadEventChange, fieldProps = {}, disabled, label, rules = [], banSuffix = [], ...rest } = props;

	useEffect(() => {
		const { defaultFileList } = fieldProps;
		defaultFileList && setfileList(defaultFileList);
	}, [fieldProps.defaultFileList]); // eslint-disable-line

	useEffect(() => {
		return () => {
			uploadEventChange && uploadEventChange("");
		};
	}, []); // eslint-disable-line

	// 移除文件
	const onRemove = (removeItem: IFileListItemProps) => {
		const uploadList = [...fileList];
		const index = uploadList.findIndex((item) => item.uid === removeItem.uid);
		uploadList.splice(index, 1);
		uploadEventChange && uploadEventChange("");
		setfileList(uploadList);
	};

	// 上传图片事件 获取文件对象
	const uploadfile = async (e: UploadRequestOption) => {
		const { showUploadList = true } = fieldProps;
		const file = e.file as RcFile;
		const uploadList = [...fileList];
		console.log(file.type.split("/")[1], banSuffix, "file.type.split('/')[1]", e);

		try {
			if (banSuffix.includes(file.type.split("/")[1])) throw new Error("不支持的图片类型");
			if (!file) throw new Error("请选择上传的素材！");
			// uploadEventChange && uploadEventChange("start");
			setloading(true);
			// const { data: path } = await upload(file);
			const envType = process.env.REACT_APP_NODE_ENV;
			let KeyName = "images";
			const year = moment().year();
			const month = moment().format("MM");
			const folder = `${year}-${month}`;
			if (envType === "dev" || envType === "development") {
				KeyName = "dev-" + folder;
			} else if (envType === "test") {
				KeyName = "test-" + folder;
			} else if (envType === "production" || envType === "prod") {
				KeyName = "prod-" + folder;
			}

			const time = new Date().getTime();
			const fileName = file.name;
			const filename = fileName.substring(0, fileName.lastIndexOf("."));
			const filename_suffix = "." + fileName.split(".").pop();

			const data = await AwsUpload({
				Bucket: "hashii-img/img",
				Key: `${KeyName}/${filename}_${time}${filename_suffix}`,
				Body: file,
				ContentType: file.type,
			});
			// const image = path.endsWith(".mp4") ? path + "?vframe/jpg/offset/1" : path;
			// console.log(data,'data')
			const path = `https://files.smartholder.jp/${data.Key}`;
			const image = path;
			e.data.image = image;

			if (showUploadList) {
				const { uid, name } = file;
				const newItem: IFileListItemProps = { uid, name, status: "done", url: path };
				uploadList.push(newItem);
				setfileList(uploadList);
				Boolean(props.name) && form?.setFieldsValue({ [String(props.name)]: uploadList });
			} else {
				Boolean(props.name) && form?.setFieldsValue({ [String(props.name)]: path });
			}
			uploadEventChange && uploadEventChange(image);
		} catch (error) {
			setloading(false);
			uploadEventChange && uploadEventChange("");
			setfileList(uploadList);
			if (error instanceof Error) {
				form.resetFields();
				message.warning(error.message);
			}

			// message.warning(error?.msg || "上传失败!");
		}
		setloading(false);
	};
	// rules.map(item => {
	// 	item.
	// })
	const UploadBox = (
		<ProFormUploadButton
			title={"Upload"}
			{...rest}
			label={typeof label === "string" ? t(label) : label}
			disabled={loading || disabled}
			listType="picture-card"
			className="avatar-uploader"
			fileList={fileList}
			icon={loading ? <LoadingOutlined className="loading_icon" /> : <PlusOutlined />}
			rules={[
				{
					required: props.required,
					message: Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder,
				},
				...rules,
			].map((item: RuleObject) => {
				if (typeof item.message === "string") item.message = String(t(item.message));
				return item;
			})}
			fieldProps={{
				...(props?.fieldProps || {}),
				customRequest: uploadfile,
				onRemove,
			}}
		></ProFormUploadButton>
	);

	return UploadBox;
};

export default ProUpload;
