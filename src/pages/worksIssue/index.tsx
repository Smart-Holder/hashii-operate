import React, { useEffect, useState } from "react";
import FormPart from "../../components/formPart";
import { Row, Col, Image, Form, message, Space } from "antd";
import { ProForm, ProFormDependency } from "@ant-design/pro-components";
import { CloseOutlined } from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getWorkDetail, IWorksAddProps, workIssue, IExtensionsItemProps, IWorkIssueProps } from "../../models/works";
import { convertValueEnum } from "../../components/select";
// import { ChainNameEnum } from "../../interface";
import { getChainList, getUserSeriesList, IUserSeriesListItem } from "../../models/series";
import { DefaultOptionType } from "antd/es/select";
import Radio from "../../components/radio";
import { composite } from "../../models/file";
import ProFormInputNumber from "../../components/inputNumber";
// import SeriesForm from "../series/seriesForm";
import Medium from "../../components/medium";
import { isFile, isVideo } from "../../utils/reg";
import NftModal from "./nftModal";
import { t } from "../../utils/tools";
import "./index.scss";
import Button from "../../components/button";
import { isAdmin } from "../main/_defaultProps";
import { PlusOutlined } from "@ant-design/icons";
import Select from "../../components/select";

const useForm = Form.useForm;

interface IFormProps {
	workID: number;
	seriesID: number;
	issueType: issueTypeEnum;
	issueNumber: number;
	isWaterMark: isWaterMarkEnum;
	waterMarkUrl: string;
	workPictureType?: workPictureTypeEnum;
	nftUrl?: string;
	// extensions: string;
}

export enum issueTypeEnum {
	"普通发行" = 0,
	"定制发行" = 1,
}

enum isWaterMarkEnum {
	"是" = 1,
	"否" = 2,
}

enum workPictureTypeEnum {
	"使用作品原图发行，发行的NFT图片一样" = 1,
	"需上传子图片，发行的NFT图片不一样" = 2,
}

const timerTypeConfig = {
	day: "日出",
	night: "日落",
};

const seriesID = {
	dev: 1,
	development: 10,
	test: 10,
	production: 1,
};

interface IUserSeriesSelectItem extends DefaultOptionType, IUserSeriesListItem {}

const WorksIssue = () => {
	const [form] = useForm();
	const [modalForm] = useForm<IExtensionsItemProps>();
	const [searchParams] = useSearchParams();
	const navigator = useNavigate();
	const workID = Number(searchParams.get("workID"));
	const [workInfo, setworkInfo] = useState<IWorksAddProps>();
	const [userSeries, setuserSeries] = useState([]);
	const [series, setseries] = useState<IUserSeriesSelectItem>();
	const [extensions, setextensions] = useState<IExtensionsItemProps[]>([]);
	const [waterMarkUrl, setwaterMarkUrl] = useState<string>("");
	const [imgUrl, setimgUrl] = useState<string>("");
	const [nftUrl, setnftUrl] = useState<string>("");
	useEffect(() => {
		getWorkInfo();
		getUserSeries(1);
	}, []); // eslint-disable-line

	useEffect(() => {
		if (waterMarkUrl && imgUrl) getNftUrl(imgUrl, waterMarkUrl);
	}, [imgUrl, waterMarkUrl]);

	const getNftUrl = async (imgUrl: string, waterMarkUrl: string) => {
		const { data } = await composite({ imgUrl, waterMarkUrl });
		setnftUrl(data);
	};

	const getWorkInfo = async () => {
		const { data } = await getWorkDetail(workID);
		setworkInfo(data);
	};

	const getUserSeries = async (chainID?: number) => {
		chainID = chainID || Number(form.getFieldValue("chainID"));

		const {
			data: { list },
		} = await getUserSeriesList({ chainID, seriesStatus: 1 });
		list.map((item) => {
			item.disabled = Boolean(item.seriesIssueStatus !== 3);
			return item;
		});
		if (list[0]?.seriesID && !form.getFieldValue("seriesID")) {
			form.setFieldValue("seriesID", list[0]?.seriesID);
			setseries(list[0] as IUserSeriesSelectItem);
		}
		console.log(userSeries, series);

		setuserSeries(list);
	};

	// 删除子图中的一项
	const removeExtensionItem = (extensionItem: IExtensionsItemProps) => {
		const newExtensions = [...extensions];
		const index = newExtensions.findIndex((item) => item.index === extensionItem.index);
		newExtensions.splice(index, 1);
		setextensions(newExtensions);
	};

	return (
		<div className="works_issue_page">
			<FormPart title="作品信息">
				<Row className="works_info" align="middle">
					<Col className="img_col">
						{/* <Image src={workInfo?.workPictureUrl} alt="..." /> */}
						<Medium path={workInfo?.workPictureUrl} />
					</Col>
					<Col>
						<Row className="works_creator" style={{ flexDirection: "column" }}>
							<Col>{workInfo?.workName}</Col>
							<Col>{workInfo?.creatorName}</Col>
						</Row>
					</Col>
				</Row>
			</FormPart>

			<FormPart title="发行信息">
				<ProForm<IFormProps>
					layout="inline"
					form={form}
					grid={true}
					initialValues={{
						issueNumber: 1,
						isWaterMark: 2,
						issueType: 0,
						workPictureType: 1,
						chainID: 1,
					}}
					className="issue_form"
					onFinish={async (values) => {
						// await waitTime(2000);
						// const res = await form.validateFields();
						// console.log(form.getFieldsValue(), "res");
						let body: IWorkIssueProps = {
							...values,
							workID,
							nftUrl: workInfo?.workPictureUrl,
							issueType: 0,
							// seriesID,
							// seriesID: Number(seriesID[process.env.REACT_APP_NODE_ENV]),
							extensions,
						};
						console.log(process.env, seriesID[process.env.REACT_APP_NODE_ENV], "process.env");

						const { issueType, workPictureType, issueNumber, isWaterMark } = body;
						if (
							issueType === issueTypeEnum.普通发行 &&
							workPictureType === 2 &&
							issueNumber !== extensions.length
						) {
							message.warning(t("请上传与发行数量一致的作品子图片"));
							return;
						}
						if (issueType === issueTypeEnum.定制发行 && extensions.length !== 2) {
							message.warning(t("定制类型请上传2张定制图片"));
							return;
						}

						// 如果仅上传水印
						if (workPictureType === 1 && isWaterMark === 1) {
							if (!extensions.length) {
								message.warning(t("请上传水印图片"));
								return;
							}
							const { waterMarkUrl, nftUrl } = extensions[0];
							body = { ...body, nftUrl, waterMarkUrl };
							delete body.extensions;
						}
						!extensions.length && delete body.extensions;
						console.log(body, "body");

						await workIssue(body);
						message.success(t("提交成功"));
						navigator(-1);
					}}
					submitter={{
						render: (props, doms) => {
							return (
								<Row style={{ marginTop: "40px" }}>
									<Col span={14} offset={4}>
										<Space>{doms}</Space>
									</Col>
								</Row>
							);
						},
					}}
					onReset={() => {
						setextensions([]);
					}}
				>
					<Row className="chain_row">
						<Col>
							<Select
								width="xs"
								name="chainID"
								label="选择系列"
								placeholder="请选择网络"
								disabled={!isAdmin}
								allowClear={false}
								request={async () => {
									const {
										data: { list },
									} = await getChainList();
									form.setFieldValue("chainID", list[0]?.chainID);
									return list;
								}}
								fieldProps={{
									fieldNames: { label: "name", value: "chainID" },
									onChange: (e: number) => {
										getUserSeries(e);
										form.setFieldValue("seriesID", undefined);
										setseries(undefined);
									},
								}}
								required
							/>
						</Col>
						<Col>
							<Select
								width="sm"
								name="seriesID"
								disabled={Boolean(form.getFieldValue("seriesName") && !isAdmin)}
								colon
								placeholder="请选择系列"
								fieldProps={{
									fieldNames: { label: "seriesName", value: "seriesID" },
									onChange: (val, item: IUserSeriesSelectItem) => {
										setseries(item);
									},
									onDropdownVisibleChange: (e) => {
										e && getUserSeries();
									},
								}}
								options={userSeries}
								required
								// addonAfter={<SeriesForm done={() => getUserSeries()} />}
								extra={`${t("当前系列")}${series?.chainCanMintNum || 0}${t("剩余可发行")}`}
							/>
						</Col>
					</Row>

					{/* <Radio
						colProps={{ md: 24, xl: 24 }}
						width="sm"
						name="issueType"
						label="发行类型"
						placeholder="请选择发行类型"
						// valueEnum={convertValueEnum(issueTypeEnum)}
						required
						options={[
							{
								label: t("普通发行"),
								value: 0,
							},
							{
								label: t("定制发行"),
								value: 1,
								disabled: true,
							},
						]}
						fieldProps={{ onChange: () => setextensions([]) }}
						disabled={isVideo(workInfo?.workPictureUrl) || isFile(workInfo?.workPictureUrl)}
					/> */}
					<ProFormInputNumber
						colProps={{ md: 24, xl: 24 }}
						name="issueNumber"
						width="md"
						label="发行数量"
						placeholder="请输入名称"
						required
						isInt
						min={1}
						max={999}
					/>
					<Radio
						colProps={{ md: 24, xl: 24 }}
						width="md"
						name="isWaterMark"
						label="是否添加水印"
						placeholder="请选择发行类型"
						valueEnum={convertValueEnum(isWaterMarkEnum)}
						required
						fieldProps={{ onChange: () => setextensions([]) }}
						disabled={isVideo(workInfo?.workPictureUrl) || isFile(workInfo?.workPictureUrl)}

						// fieldProps={{ onChange: (e) => setisWaterMark(Number(e.target.value)) }}
					/>
					<ProFormDependency name={["issueType"]}>
						{({ issueType }) => {
							if (issueType === issueTypeEnum.普通发行) {
								return (
									<Radio
										// colProps={{ md: 12, xl: 8 }}
										width="md"
										name="workPictureType"
										label="作品图片"
										placeholder="请选择作品图片类型"
										valueEnum={convertValueEnum(workPictureTypeEnum)}
										fieldProps={{ onChange: () => setextensions([]) }}
										required
										disabled={isVideo(workInfo?.workPictureUrl) || isFile(workInfo?.workPictureUrl)}
									/>
								);
							}
						}}
					</ProFormDependency>
					<ProFormDependency name={["isWaterMark", "workPictureType", "issueType", "issueNumber"]}>
						{({ isWaterMark, workPictureType, issueType }) => {
							console.log(isWaterMark, workPictureType, "workPictureType");
							// 如果不需要上传图片 或子图片
							if (isWaterMark === 2 && workPictureType === 1 && issueType !== issueTypeEnum.定制发行)
								return false;

							// 是否原图发行并且添加水印并且上传了所有图片
							const isOriginMarkeImage =
								workPictureType === workPictureTypeEnum["使用作品原图发行，发行的NFT图片一样"] &&
								isWaterMark === isWaterMarkEnum.是 &&
								issueType !== issueTypeEnum.定制发行;

							// 是否定制发行并且上传了所有图片;
							const isCustomImage = issueType === issueTypeEnum.定制发行 && extensions.length === 2;

							const onFinish = async (values: IExtensionsItemProps) => {
								// await waitTime(2000);
								const { waterMarkUrl } = values;
								if ((!waterMarkUrl && isWaterMark === isWaterMarkEnum.是) || !values.imgUrl) {
									return false;
								}
								if (!values.imgUrl && !isOriginMarkeImage) {
									message.warning(t("请上传作品子图"));
									return;
								}

								const imgUrl = values.imgUrl || workInfo?.workPictureUrl;
								let nftUrl = imgUrl;
								if (waterMarkUrl) {
									const { data } = await composite({ imgUrl, waterMarkUrl });
									nftUrl = data;
								}
								const newExtensions = [...extensions];
								newExtensions.push({ ...values, nftUrl });
								newExtensions.map((item, index) => (item.index = index));
								setextensions(newExtensions);
								setnftUrl("");
								message.success(t("提交成功"));
								return true;
							};

							const showImgUrl = workPictureType === 2 || issueType === issueTypeEnum.定制发行;
							const showWaterMarkUrl = isWaterMark === 1;
							const hideBtn = Boolean(isCustomImage || (isOriginMarkeImage && extensions.length));
							const timerRadio = (
								<Radio
									width="md"
									name="timerType"
									label="显示时段"
									placeholder="请选择发行类型"
									options={[
										{
											label: "日出",
											value: "day",
											disabled: extensions[0]?.timerType === "day",
										},
										{
											label: "日落",
											value: "night",
											disabled: extensions[0]?.timerType === "night",
										},
									]}
									required
								/>
							);
							return NftModal({
								// label:"666",
								formItemConfig: {
									label:
										workPictureType === workPictureTypeEnum["需上传子图片，发行的NFT图片不一样"]
											? t("作品子图片")
											: t("水印图片"),
								},
								onFinish,
								showImgUrl,
								showWaterMarkUrl,
								hideBtn,
								form: modalForm,
								imgUrlChange: (e) => setimgUrl(e),
								waterMarkUrlChange: (e) => setwaterMarkUrl(e),
								previewUrl: nftUrl,
								expand: issueType === issueTypeEnum.定制发行 ? timerRadio : "",
								btn: (
									<>
										<Button type="primary" onClick={() => setnftUrl("")}>
											<PlusOutlined />
											{t("上传图片")}
										</Button>
									</>
								),
								modalProps: {
									destroyOnClose: true,
									onCancel: () => setnftUrl(""),
									afterClose: () => setnftUrl(""),
								},
							});
							// return (
							// 	<FormPart
							// 		title={
							// 			workPictureType === workPictureTypeEnum["需上传子图片，发行的NFT图片不一样"]
							// 				? "作品子图片"
							// 				: "水印图片"
							// 		}
							// 	>
							// 		{NftModal({
							// 			onFinish,
							// 			showImgUrl,
							// 			showWaterMarkUrl,
							// 			hideBtn,
							// 			form: modalForm,
							// 			imgUrlChange: (e) => setimgUrl(e),
							// 			waterMarkUrlChange: (e) => setwaterMarkUrl(e),
							// 			previewUrl: nftUrl,
							// 			expand: issueType === issueTypeEnum.定制发行 ? timerRadio : "",
							// 			modalProps: {
							// 				destroyOnClose: true,
							// 				onCancel: () => setnftUrl(""),
							// 			},
							// 		})}
							// 	</FormPart>
							// );
						}}
					</ProFormDependency>

					<div className="extensions_box">
						{extensions.map((item) => {
							return (
								<div className="extension_item">
									<CloseOutlined className="close_icon" onClick={() => removeExtensionItem(item)} />
									<Image src={item.nftUrl} />
									{form.getFieldValue("issueType") === issueTypeEnum.定制发行 && (
										<div className="timer_type">显示类型:{timerTypeConfig[item.timerType]}</div>
									)}
								</div>
							);
						})}
					</div>
				</ProForm>
			</FormPart>
		</div>
	);
};

export default WorksIssue;
