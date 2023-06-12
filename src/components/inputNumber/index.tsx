import React from "react";
import { ProFormDigit, ProFormDigitProps } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { RuleObject } from "antd/es/form";
import { TFunction } from "i18next";
import { isString } from "util";

interface IProFormFieldItemProps extends ProFormDigitProps {
	maxLength?: number;
	rules?: RuleObject[];
	isInt?: boolean;
}

const ProFormInputNumber: React.FC<IProFormFieldItemProps> = (props) => {
	// eslint-disable-next-line
	const { t }: { t: TFunction } = useTranslation();
	const { label, maxLength, rules = [], isInt } = props;
	// isInt &&
	const parser = (text: string) => (isInt ? (/^\d+$/.test(String(text)) ? Number(text) : 0) : parseFloat(text));
	return (
		<ProFormDigit
			{...props}
			rules={[
				{
					required: props.required,
					message: Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder,
				},
				...rules,
			].map((item) => ({ ...item, message: isString(item.message) ? t(item.message) : item.message }))}
			fieldProps={{
				maxLength: maxLength,
				parser,
				...props.fieldProps,
			}}
			placeholder={t(props.placeholder)}
			label={isString(label) ? t(label).trim() : label}
		/>
	);
};

export default ProFormInputNumber;
