import React, { ReactNode } from "react";
import { ModalForm, ProForm, ModalFormProps } from "@ant-design/pro-components";
import { Form, Image, FormItemProps } from "antd";
import ProUpload, { IFileListItemProps, IUploadEventChangeProps } from "../../components/uploadPro";
import Button from "../../components/button";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "../../utils/tools";
interface INftModalProps extends ModalFormProps {
	hideBtn?: boolean;
	showImgUrl?: boolean;
	showWaterMarkUrl?: boolean;
	previewUrl?: string;
	imgUrlChange?: IUploadEventChangeProps;
	waterMarkUrlChange?: IUploadEventChangeProps;
	expand?: ReactNode;
	btn?: ReactNode;
	formItemConfig?: FormItemProps;
}
const NftModal = (props: INftModalProps) => {
	const {
		hideBtn = false,
		showImgUrl = true,
		showWaterMarkUrl = true,
		previewUrl,
		waterMarkUrlChange,
		imgUrlChange,
		form,
		btn,
		expand,
		formItemConfig,
		...rest
	} = props;

	return (
		<ModalForm
			title={t("上传子图信息")}
			trigger={
				<div
					style={{
						display: Boolean(hideBtn) ? "none" : "block",
						paddingLeft: 4,
						width: "100%",
					}}
				>
					<Form.Item style={{ margin: 0 }} required {...formItemConfig}>
						{btn ? (
							btn
						) : (
							<Button type="primary">
								<PlusOutlined />
								{t("上传图片")}
							</Button>
						)}
					</Form.Item>
				</div>
			}
			grid={true}
			width="34%"
			layout="horizontal"
			className="extensions_modal"
			form={form}
			{...rest}
			key="extensions_modal"
		>
			<div className="extensions_modal_body">
				<ProForm.Group colProps={{ span: 8 }}>
					{showImgUrl && (
						<ProUpload
							banSuffix={["gif"]}
							uploadEventChange={(e) => imgUrlChange && imgUrlChange(e)}
							rules={[{ required: true, message: "请上传作品子图片" }]}
							accept="image/*"
							// fieldProps={{ defaultFileList }}
							transform={(e: IFileListItemProps[] | string, namePath: string) => {
								const url = Array.isArray(e) ? e[0]?.url : e;
								return { [namePath]: url };
							}}
							max={1}
							form={form}
							listType="picture-card"
							label="作品子图"
							name="imgUrl"
						/>
					)}
					{showWaterMarkUrl && (
						<ProUpload
							uploadEventChange={(e) => waterMarkUrlChange && waterMarkUrlChange(e)}
							rules={[{ required: true, message: "请上传水印图片" }]}
							accept="image/png"
							// fieldProps={{ defaultFileList }}
							transform={(e: IFileListItemProps[] | string, namePath: string) => {
								const url = Array.isArray(e) ? e[0]?.url : e;
								return { [namePath]: url };
							}}
							max={1}
							form={form}
							listType="picture-card"
							label="水印图片"
							name="waterMarkUrl"
						/>
					)}
					{expand}
				</ProForm.Group>
				{previewUrl && <Image width="100%" src={previewUrl} />}
			</div>
		</ModalForm>
	);
};

export default NftModal;
