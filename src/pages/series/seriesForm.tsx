import { ModalForm } from "@ant-design/pro-components";
import { seriesAdd, ISeriesAddProps, getChainList } from "../../models/series";
import Button from "../../components/button";
import { message, Modal } from "antd";
import type { ActionType } from "@ant-design/pro-components";
import ProFormInput from "../../components/input";
import TextAreaInput from "../../components/textAreaInput";
import ProFormInputNumber from "../../components/inputNumber";
import React from "react";
// import { ChainNameEnum } from "../../interface";
import Select from "../../components/select";
import { t } from "../../utils/tools";

interface ISeriesFormProps {
	tableRef?: React.MutableRefObject<ActionType>;
	done?: () => void;
}

const SeriesForm = (props?: ISeriesFormProps) => {
	const { tableRef, done } = props;
	return (
		<ModalForm<ISeriesAddProps>
			title={t("新增系列")}
			trigger={<Button type="primary">新增系列</Button>}
			grid={true}
			width="30%"
			key="modalForm"
			modalProps={{
				destroyOnClose: true,
				onCancel: () => console.log("run"),
			}}
			submitTimeout={2000}
			onFinish={async (value: ISeriesAddProps) => {
				await seriesAdd(value);
				tableRef?.current.reload();
				message.success(t("提交成功"));

				Modal.info({
					title: t("系列新增提示"),
					content: t("系列新增之后可能会有几分钟的延迟,请在系列管理中查看系列状态"),
					onOk: () => {
						done && done();
					},
				});
				return true;
			}}
		>
			<Select
				name="chainID"
				label="选择链"
				placeholder="请选择链"
				// valueEnum={ChainNameEnum}
				request={async () => {
					const {
						data: { list },
					} = await getChainList();
					return list;
				}}
				fieldProps={{ fieldNames: { label: "name", value: "chainID" } }}
				required
			/>

			<ProFormInput required name="seriesName" label="系列名称" maxLength={20} />
			<ProFormInputNumber isInt required name="count" label="数   量" min={1} max={999999999} />
			<TextAreaInput required name="desc" label="描   述" maxLength={250} />
		</ModalForm>
	);
};

export default SeriesForm;
