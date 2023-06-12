import React, { useState } from "react";
import { ProForm } from "@ant-design/pro-components";
import { Col, message, Row, Space, Form } from "antd";
import ReactQuill from "react-quill";
import FormPart from "../../components/formPart";
import { IWorksAddProps, workAdd, workEdit, getWorkDetail } from "../../models/works";
import ProUpload, { IFileListItemProps } from "../../components/uploadPro";
import ProFormInput from "../../components/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
import { t } from "../../utils/tools";

const useForm = Form.useForm;

const WorksDetail = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const workID = Number(searchParams.get("workID"));
	const readonly = Boolean(searchParams.get("readonly") && workID);
	const isEdit = Boolean(workID);
	const [defaultFileList, setdefaultFileList] = useState([]);

	const [form] = useForm();

	return (
		<div className="merchant_detail">
			<ProForm<IWorksAddProps | {}>
				layout="vertical"
				form={form}
				grid={true}
				submitter={{
					render: (props, doms) => {
						if (readonly) return false;
						return (
							<Row>
								<Col span={14} offset={4}>
									<Space>{doms}</Space>
								</Col>
							</Row>
						);
					},
				}}
				onReset={() => {
					setdefaultFileList([]);
				}}
				onFinish={async (values: IWorksAddProps) => {
					if (!values.workPictureUrl) return false;
					isEdit ? await workEdit({ ...values, workID }) : await workAdd(values);
					navigate(-1);
					message.success(t("提交成功"));
				}}
				request={async () => {
					if (!isEdit) return Promise.resolve({});
					const { data } = await getWorkDetail(workID);
					data.workPictureUrl && setdefaultFileList([{ url: data.workPictureUrl }]);

					return data;
				}}
				readonly={readonly}
			>
				<FormPart title="基础信息">
					<ProFormInput
						colProps={{ md: 24, xl: 12 }}
						maxLength={24}
						width="md"
						name="workName"
						label="作品名称"
						placeholder="请输入名称"
						required
					/>
					<ProFormInput
						maxLength={50}
						colProps={{ md: 24, xl: 12 }}
						width="md"
						name="creatorName"
						label="创作者"
						placeholder="请输入名称"
						required
					/>
					<ProFormInput
						colProps={{ md: 24, xl: 12 }}
						name="creatorTime"
						width="md"
						label="创作时间"
						placeholder="请输入名称"
						maxLength={50}
					/>
					<ProFormInput
						colProps={{ md: 24, xl: 12 }}
						label="时长/尺寸"
						placeholder="请输入时长/尺寸"
						name="size"
						width="md"
						maxLength={50}
					/>
					<ProFormInput
						required
						colProps={{ md: 24, xl: 12 }}
						name="owner"
						width="md"
						label="所属人/机构"
						placeholder="请输入所属人/机构"
						maxLength={50}
					/>
				</FormPart>

				<FormPart title="图片信息">
					<div className="card_upload">
						<ProUpload
							rules={[{ required: true, message: "请上传图片" }]}
							// accept="image/*,video/*"
							fieldProps={{ defaultFileList }}
							transform={(e: IFileListItemProps[] | string, namePath: string) => {
								const url = Array.isArray(e) ? e[0]?.url : e;
								return { [namePath]: url };
							}}
							max={1}
							form={form}
							label="作品信息"
							name="workPictureUrl"
							disabled={readonly}
						/>
					</div>
				</FormPart>

				<FormPart title="作品介绍">
					<Form.Item
						extra={t("字数限制2000")}
						name="workDesc"
						style={{ width: "100%" }}
						rules={[{ max: 2000, message: t("字数限制2000") }]}
						colon={false}
					>
						<ReactQuill readOnly={readonly} className="react_quill" theme="snow" />
					</Form.Item>
				</FormPart>
			</ProForm>
		</div>
	);
};

export default WorksDetail;
