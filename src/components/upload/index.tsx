import { Upload as AtUpload, UploadProps, Form, FormItemProps, FormInstance, UploadFile } from "antd";
import React, { useState, useEffect } from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";
// import { upload } from "../../models/utils";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import { omit } from "../../tools/utils";
import "./index.scss";
import { UploadChangeParam } from "antd/lib/upload";
import { upload } from "../../models/file";
import { RcFile } from "antd/es/upload";
import { RuleObject } from "antd/es/form";
import { useTranslation } from "react-i18next";

export interface IFileListItemProps extends UploadFile {
	uid: string;
	name: string;
	// status?: string;
	url?: string;
	image?: string;
}

/* eslint-disable */

const { Item } = Form;

// export type IUploadEventProps = 'start' | 'success' | 'error';
export type IUploadEventProps = "start" | string | "error";

interface IFormItemProps extends FormItemProps {
	rules?: RuleObject[];
}

interface IUploadQiniuProps extends UploadProps {
	children?: React.ReactNode;
	formItemConfig?: IFormItemProps;
	form?: FormInstance<any>;
	uploadEventChange?: (event: IUploadEventProps) => void;
}

const Upload = (props: IUploadQiniuProps) => {
	const [imageUrl, setimageUrl] = useState<string>("");

	const [loading, setloading] = useState<boolean>(false);

	const [fileList, setfileList] = useState<IFileListItemProps[]>([]);

	const { formItemConfig, form, uploadEventChange, defaultFileList, maxCount, ...rest } = props;
	const { t } = useTranslation();

	useEffect(() => {
		console.log(defaultFileList, "defaultFileList");

		defaultFileList && setfileList(defaultFileList);
	}, [defaultFileList]);

	useEffect(() => {
		const image = form?.getFieldValue(String(formItemConfig?.name));
		Array.isArray(image) ? setfileList(image) : typeof image === "string" && setimageUrl(image);
		// console.log(form?.getFieldValue(String(formItemConfig?.name)), Array.isArray(image));
	}, [form?.getFieldValue(String(formItemConfig?.name))]);

	// 移除文件
	const onRemove = (removeItem: IFileListItemProps) => {
		const uploadList = [...fileList];
		const index = uploadList.findIndex((item) => item.uid === removeItem.uid);
		uploadList.splice(index, 1);
		setfileList(uploadList);
	};

	// 上传完成
	const onChange = (e: UploadChangeParam<IFileListItemProps>) => {
		e.file.image = imageUrl;
		e && props.onChange && props.onChange(e);
	};

	// 上传图片事件 获取文件对象
	const uploadfile = async (e: UploadRequestOption) => {
		const { showUploadList = true } = props;
		const file = e.file as RcFile;

		try {
			uploadEventChange && uploadEventChange("start");
			setloading(true);
			const { data: path } = await upload(file);
			const image = path.endsWith(".mp4") ? path + "?vframe/jpg/offset/1" : path;
			setimageUrl(String(image));
			if (showUploadList) {
				const uploadList = [...fileList];
				const { uid, name } = file;
				const newItem: IFileListItemProps = { uid, name, status: "done", url: path };
				uploadList.push(newItem);
				setfileList(uploadList);

				Boolean(formItemConfig?.name) && form?.setFieldsValue({ [String(formItemConfig?.name)]: uploadList });
			} else {
				Boolean(formItemConfig?.name) && form?.setFieldsValue({ [String(formItemConfig?.name)]: path });
			}
			uploadEventChange && uploadEventChange(image);
		} catch (error) {
			setloading(false);
			uploadEventChange && uploadEventChange("error");
			// message.warning(error?.msg || "上传失败!");
		}
		setloading(false);
	};

	const uploadButton = (
		<div>
			{Boolean(loading && imageUrl) ? <LoadingOutlined className="loading_icon" /> : <PlusOutlined />}

			<div>Upload</div>
		</div>
	);

	const UploadBox = (
		<AtUpload
			// showUploadList={false}
			listType="picture-card"
			className="avatar-uploader"
			customRequest={uploadfile}
			fileList={fileList}
			// {...omit(props, "value")}
			onRemove={onRemove}
			onChange={onChange}
			{...rest}
		>
			{(!maxCount || maxCount > fileList.length) && (!props.children ? uploadButton : props.children)}
		</AtUpload>
	);

	if (!props.formItemConfig) return UploadBox;

	const rules = props.formItemConfig?.rules || [];
	return (
		<Item
			{...props.formItemConfig}
			rules={[
				{ required: props.formItemConfig.required },
				...rules.map((item) => ({ ...item, message: t(item.message) })),
			]}
		>
			{UploadBox}
		</Item>
	);
};

export default Upload;
