import React from "react";
import { ProFormText } from "@ant-design/pro-components";
import { ProFormFieldItemProps } from "@ant-design/pro-form/es/typing";
import { InputRef, InputProps } from "antd";
import { useTranslation } from "react-i18next";
import { RuleObject } from "antd/es/form";
import { TFunction } from "i18next";
import { isString } from "util";

interface IProFormFieldItemProps<T, V> extends ProFormFieldItemProps<T, V> {
	maxLength?: number;
	rules?: RuleObject[];
}

const ProFormInput: React.FC<IProFormFieldItemProps<InputProps, InputRef>> = (props) => {
	// eslint-disable-next-line
	const { t }: { t: TFunction } = useTranslation();
	const { label, maxLength, placeholder, rules = [] } = props;

	return (
		<ProFormText
			{...props}
			rules={[
				{
					required: props.required,
					message: Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder,
				},
				...rules,
			].map((item) => ({ ...item, message: isString(item.message) ? t(item.message) : item.message }))}
			fieldProps={{ maxLength: maxLength, showCount: Boolean(maxLength), ...props.fieldProps }}
			placeholder={t(placeholder)}
			label={isString(label) ? t(label).trim() : label}
		/>
	);
};

export default ProFormInput;
