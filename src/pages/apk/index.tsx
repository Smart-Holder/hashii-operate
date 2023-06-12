import React, { useRef, useState } from "react";
import {
	ActionType,
	ModalForm,
	ProColumns,
	// ProDescriptions,
	ProFormDependency,
	ProTable,
	ProFormCascader,
} from "@ant-design/pro-components";
import {
	apkAdd,
	apkEdit,
	apkForbidden,
	apkLog,
	apkQuery,
	IApkAddProps,
	IApkItemProps,
	IApkLogItem,
} from "../../models/apk";
import { message, Popconfirm, Space } from "antd";
import Button from "../../components/button";
import { useForm } from "antd/es/form/Form";
import Radio from "../../components/radio";
import { convertValueEnum } from "../../components/select";
import ProFormInput from "../../components/input";
import ProFormInputNumber from "../../components/inputNumber";
import ProUpload, { IFileListItemProps } from "../../components/uploadPro";
import TextAreaInput from "../../components/textAreaInput";
import Text from "../../components/text";
// import useTextTranslation from "../../hooks/useTranslation";
// import { useTranslation } from "react-i18next";
import useTranslateColumns, { translateColumns } from "../../hooks/useTranslateColumns";
import IconFont from "../../components/icon_font";
import { formatTimeZoneTime } from "../../utils/tools";
import useTextTranslation from "../../hooks/useTranslation";
// import { translateColumns } from "../../utils/tools";
// import { t as ti18next } from "i18next";

enum apkTypeEnum {
	"手机" = 0,
	"设备" = 1,
	"系统固件zip" = 2,
}

// enum mainboardTypeEnum {
// 	"XKKJ3288" = 0,
// 	"SMDT3288" = 1,
// 	"T982" = 2,
// }

enum mustEnum {
	"否" = 0,
	"是" = 1,
}

enum forbiddenEnum {
	"启用" = 0,
	"禁用" = 1,
}

const initialValues = {
	apkType: 0,
	must: 0,
	mainboardType: "",
	versionCode: undefined,
	versionName: "",
	url: "",
	description: "",
};

const Apk = () => {
	const [modalForm] = useForm<IApkAddProps>();
	const ref = useRef<ActionType>();
	const [defaultFileList, setdefaultFileList] = useState([]);
	const [currApk, setcurrApk] = useState<IApkItemProps>();
	const [open, setopen] = useState<boolean>(false);
	// const { t } = useTranslation<string>();
	const [showUpload, setshowUpload] = useState<boolean>(true);
	const { t } = useTextTranslation();
	const columns: ProColumns<IApkItemProps>[] = [
		{
			title: "ID",
			dataIndex: "id",
			search: false,
			width: 40,
		},
		{
			title: "APK类型",
			dataIndex: "apkType",
			search: false,
			valueEnum: apkTypeEnum,
			width: 100,
			renderText: (text: apkTypeEnum) => <Text>{apkTypeEnum[text]}</Text>,
		},
		{
			title: "env",
			dataIndex: "env",
			search: false,
			width: 60,
			// valueEnum: mainboardTypeEnum,
		},
		{
			title: "版本号",
			dataIndex: "versionCode",
			width: 80,
			search: false,
		},
		{
			title: "版本名称",
			dataIndex: "versionName",
			width: 120,
			search: false,
		},
		{
			title: "Apk包",
			dataIndex: "url",
			ellipsis: true,
			// width: "20%",
			width: 140,
			render: (_, item) => (
				<a href={item.url} rel="noreferrer" target="_blank" style={{ whiteSpace: "pre-line" }}>
					{_}
				</a>
			),
			// search: false,
		},

		{
			title: "是否必经",
			dataIndex: "must",
			valueEnum: mustEnum,
			search: false,
			width: 120,
			renderText: (text: mustEnum) => <Text>{mustEnum[text]}</Text>,
		},
		{
			title: "cn描述",
			dataIndex: "cnDescription",
			ellipsis: true,
			search: false,
			width: 120,

			// width: "22%",
		},
		{
			title: "jp描述",
			dataIndex: "jpDescription",
			ellipsis: true,
			search: false,
			// width: "22%",
			width: 120,
		},
		{
			title: "en描述",
			dataIndex: "enDescription",
			ellipsis: true,
			search: false,
			// width: "22%",
			width: 120,
		},
		{
			title: "createTime",
			dataIndex: "createTimestamp",
			// ellipsis: true,
			search: false,
			// fixed: true,
			width: 180,
			renderText: (_: string) => formatTimeZoneTime(_),
		},

		{
			title: "操作",
			dataIndex: "jpDescription",
			search: false,
			width: 280,
			// fixed: true,
			render: (_, item) => {
				return (
					<Space>
						<Button
							type="link"
							onClick={() => {
								setcurrApk(item);
								setopen(true);
								item.url && setdefaultFileList([{ url: item.url }]);
								const { apkType } = item;
								modalForm.setFieldsValue({
									...item,
									apkType: !apkType ? [apkType] : [undefined, apkType],
								});
							}}
						>
							编辑
						</Button>
						{Boolean(!item.forbidden) ? (
							<Popconfirm
								key="pop"
								placement="topRight"
								title={t("操作提示")}
								description={t("禁用后该版本将无法升级，确定要禁用该版本？")}
								onConfirm={async () => {
									await apkForbidden({ id: item.id, forbidden: 1 });
									message.success(t("禁用完成"));
									ref.current.reload();
								}}
							>
								<Button type="link">禁用</Button>
							</Popconfirm>
						) : (
							<Button
								type="link"
								onClick={async () => {
									await apkForbidden({ id: item.id, forbidden: 0 });
									message.success(t("启用完成"));
									ref.current.reload();
								}}
							>
								启用
							</Button>
						)}

						{apkLogModal(item)}
					</Space>
				);
			},
		},
	];

	const logColumns: ProColumns<IApkLogItem>[] = [
		{
			title: "操作时间",
			dataIndex: "create_time",
			hideInSearch: false,
			renderText: (_: string) => formatTimeZoneTime(_),
		},
		{
			title: "操作人",
			dataIndex: "accountName",
			hideInSearch: false,
		},
		{
			title: "动作",
			dataIndex: "apk_forbidden",
			hideInSearch: false,
			valueEnum: forbiddenEnum,
		},
	];

	const apkLogModal = (item?: IApkItemProps) => {
		return (
			<ModalForm<IApkAddProps>
				title="apk日志"
				trigger={
					<Button key="add" type="primary">
						操作日志
					</Button>
				}
				form={modalForm}
				grid={true}
				width="40%"
				modalProps={{
					destroyOnClose: true,
				}}
				submitter={false}
			>
				<ProTable<IApkLogItem>
					style={{ width: "100%" }}
					search={false}
					request={async () => {
						const {
							data: { list, count },
						} = await apkLog(item.id);
						return {
							data: list,
							total: count,
							success: true,
						};
					}}
					columns={translateColumns(logColumns)}
				/>
			</ModalForm>
		);
	};

	const text = currApk ? "编辑" : "新增Apk";

	const onCancel = () => {
		setcurrApk(undefined);
		setopen(false);
		setdefaultFileList([]);
		setshowUpload(true);
	};

	const changeUrl = (
		<IconFont style={{ fontSize: 20 }} type="icon-zhuanhuan1" onClick={() => setshowUpload(!showUpload)} />
	);

	return (
		<div>
			<ProTable<IApkItemProps>
				actionRef={ref}
				columns={useTranslateColumns(columns)}
				request={async ({ pageSize: limit, current: page, ...rest }) => {
					const {
						data: { list, count },
					} = await apkQuery({ limit, page, ...rest });
					return {
						data: list,
						total: count,
						success: true,
					};
				}}
				scroll={{ x: 1600 }}
				rowKey="id"
				search={{
					labelWidth: "auto",
					className: "search_part",
					optionRender: (...rest) => [...rest[2], <Button onClick={() => setopen(true)}>新增Apk</Button>],
				}}
				// actionRef={ref}
			/>

			<ModalForm<IApkAddProps>
				title={text}
				form={modalForm}
				open={open}
				grid={true}
				width="30%"
				modalProps={{
					destroyOnClose: true,
					onCancel,
				}}
				initialValues={initialValues}
				onFinish={async (e: IApkAddProps) => {
					const apkType0 = Number(e.apkType[0]);
					const apkType1 = Number(e.apkType[1]);
					e.apkType = apkType0 === 0 ? apkType0 : apkType1;
					console.log(e, "e");

					currApk?.id ? await apkEdit({ ...e, id: currApk.id }) : await apkAdd(e);
					onCancel();
					ref.current?.reload();
					message.success(t(`${currApk?.id ? "编辑" : "新增"}apk成功!`));
					return true;
				}}
			>
				{/* <Radio name="apkType" label="APK类型" valueEnum={convertValueEnum(apkTypeEnum)} required /> */}
				<ProFormCascader
					allowClear={false}
					placeholder={t("APK类型")}
					rules={[{ required: true, message: t("请选择APK类型") }]}
					name="apkType"
					label={t("APK类型")}
					// required
					fieldProps={{
						options: [
							{
								value: 0,
								label: t("手机"),
							},
							{
								// value: "设备",
								label: t("设备"),
								children: [
									{
										value: 1,
										label: t("Apk升级"),
									},
									{
										value: 2,
										label: t("固件升级"),
									},
								],
							},
						],
					}}
				/>

				<ProFormDependency name={["apkType"]}>
					{({ apkType }: { apkType: number[] }) => {
						if (apkType[1] === 2) {
							return (
								<ProFormInput
									name="servMd5"
									label="servMd5"
									placeholder="请输入servMd5"
									// required={apkType === 1}
									required={true}
									maxLength={150}
								/>
							);
						}
					}}
				</ProFormDependency>

				<ProFormDependency name={["apkType"]}>
					{({ apkType }) => {
						console.log(apkType, "apkType");
						return (
							<ProFormInput
								name="env"
								label="env"
								placeholder="请输入Env"
								// required={apkType === 1}
								required={Array.isArray(apkType) && apkType.length >= 2}
								maxLength={20}
							/>
						);
					}}
				</ProFormDependency>

				<ProFormInputNumber
					name="versionCode"
					label="versionCode"
					placeholder="请输入versioncode"
					required
					max={99999999999999}
				/>
				<ProFormInput
					name="versionName"
					label="versionName"
					placeholder="请输入versionName"
					required
					maxLength={150}
				/>

				<Radio name="must" label="是否必经" valueEnum={convertValueEnum(mustEnum)} required />

				{showUpload ? (
					<ProUpload
						form={modalForm}
						fieldProps={{ defaultFileList }}
						name="url"
						label="上传Apk"
						rules={[{ required: true, message: "请上传apk包" }]}
						max={1}
						transform={(e: IFileListItemProps[] | string, namePath: string) => {
							const url = Array.isArray(e) ? e[0]?.url : e;
							return { [namePath]: url };
						}}
						extra={changeUrl}
					/>
				) : (
					<ProFormInput name="url" label="上传Apk" placeholder="apk httpUrl" required extra={changeUrl} />
				)}

				<TextAreaInput name="cnDescription" label="cnDescription" maxLength={250} />
				<TextAreaInput name="jpDescription" label="jpDescription" maxLength={250} />
				<TextAreaInput name="enDescription" label="enDescription" maxLength={250} />
			</ModalForm>
		</div>
	);
};
export default Apk;
