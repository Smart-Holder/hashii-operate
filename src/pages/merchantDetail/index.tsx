import React, { useState, useEffect } from "react";
import { emailReg } from "../../utils/reg";
import { Col, message, Row, Space, Form } from "antd";
import { IFileListItemProps } from "../../components/upload";
import { ProForm, ProFormCascader } from "@ant-design/pro-components";
import Select from "../../components/select";
import cityJson from "../../utils/city_.json";
import areasJson from "../../utils/area.json";
import ProUpload from "../../components/uploadPro";
import ProFormInput from "../../components/input";
import useCurrentLocale from "../../hooks/useCurrentLocale";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IMerchantAddProps, merchantAdd, merchantQuerybyid, merchantEdit } from "../../models/merchant";

import "./index.scss";
import { t } from "../../utils/tools";

const useForm = Form.useForm;

const MerchantDetail = () => {
	const [form] = useForm();
	const navigate = useNavigate();
	const currLocale = useCurrentLocale();

	const [searchParams] = useSearchParams();
	const [defaultFileList, setdefaultFileList] = useState([]);
	const [merchantInfo, setmerchantInfo] = useState<IMerchantAddProps>();
	const [show, setshow] = useState(true);
	useEffect(() => {
		setshow(false);
		setTimeout(() => {
			setshow(true);
		}, 1000);
	}, [currLocale]);

	const userId = Number(searchParams.get("userId"));
	const isEdit = Boolean(userId);

	return (
		<div className="merchant_detail">
			<ProForm<IMerchantAddProps | {}>
				layout="vertical"
				form={form}
				grid={true}
				submitter={{
					searchConfig: { submitText: t("提交") },
					render: (props, doms) => {
						return (
							<Row>
								<Col span={14} offset={4}>
									<Space>{doms}</Space>
								</Col>
							</Row>
						);
					},
				}}
				onFinish={async (values: IMerchantAddProps) => {
					console.log(values, "res");
					isEdit ? await merchantEdit({ ...values, userId }) : await merchantAdd(values);
					navigate(-1);
					message.success(`${isEdit ? t("编辑") : t("提交")}${t("成功")}`);
				}}
				request={async () => {
					console.log(isEdit, "isEdit");

					if (!isEdit) return Promise.resolve({});
					const { data } = await merchantQuerybyid(userId);
					setmerchantInfo(data);
					data.license && setdefaultFileList([{ url: data.license }]);
					return data;
				}}
			>
				<ProFormInput
					colProps={{ md: 12, xl: 8 }}
					width="md"
					name="name"
					label="商家名称"
					placeholder="请输入商家名称"
					required
					maxLength={30}
				/>

				<ProFormInput
					colProps={{ md: 12, xl: 8 }}
					width="md"
					name="linkman"
					label="联系人"
					placeholder="请输入联系人"
					required
					maxLength={30}
				/>
				<ProFormInput
					colProps={{ md: 12, xl: 8 }}
					name={["email"]}
					width="md"
					label="邮箱"
					placeholder="请输入邮箱"
					required
					maxLength={30}
					rules={[{ pattern: emailReg, message: "请输入正确的邮箱格式" }]}
				/>

				{show ? (
					<ProFormCascader
						convertValue={(e: string[]) => {
							const { country, province, city } = merchantInfo || {};
							if (Array.isArray(e)) return e;
							const value = isEdit && country && e ? [country, province, city].filter((item) => item) : e;
							return value;
						}}
						transform={(e: string[] | string) => {
							const [country, province, city] = e || [];
							if (!Array.isArray(e)) {
								const { country, province, city } = merchantInfo || {};
								return { country, province, city };
							}

							return { country, province, city };
						}}
						colProps={{ md: 12, xl: 8 }}
						placeholder={t("请选择所在地区")}
						label={t("所在地区")}
						name="country"
						width="md"
						fieldProps={{
							showSearch: true,
							options: (() => cityJson.value)(),
							fieldNames: {
								label: currLocale === "ZH" ? "name" : "name_en",
								value: currLocale === "ZH" ? "name" : "name_en",
								children: "childrens",
							},
						}}
					/>
				) : (
					<ProFormCascader
						width="md"
						placeholder={t("请选择所在地区")}
						label={t("所在地区")}
						disabled={true}
						colProps={{ md: 12, xl: 8 }}
					/>
				)}

				<ProFormInput
					colProps={{ md: 12, xl: 8 }}
					name={"address"}
					width="md"
					label="详细地址"
					placeholder="请输入详细地址"
					maxLength={50}
				/>
				<Row className="phone_row">
					<Col>
						<Select
							name="globalRoaming"
							width="xs"
							label="手机号"
							options={areasJson.map((item) => item.label)}
							placeholder={"区号"}
						/>
					</Col>
					<Col>
						<ProFormInput name="phone" width="md" placeholder="请输入手机号" />
					</Col>
				</Row>

				<div className="card_upload">
					<ProUpload
						accept="image/*"
						fieldProps={{ defaultFileList }}
						transform={(e: IFileListItemProps[] | string, namePath: string) => {
							const url = Array.isArray(e) ? e[0]?.url : e;
							return { [namePath]: url };
						}}
						max={1}
						form={form}
						label="营业执照"
						name="license"
					/>
				</div>
			</ProForm>
		</div>
	);
};

export default MerchantDetail;
