import React from "react";
import { ProFormRadio, ProFormRadioGroupProps } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { isString } from "util";
import { RuleObject } from "antd/es/form";

interface IRadioProps extends ProFormRadioGroupProps {
	rules?: RuleObject[];
}

const Radio: React.FC<IRadioProps> = (props) => {
	// eslint-disable-next-line
	const { t }: { t: TFunction } = useTranslation();
	const { label, rules = [] } = props;

	return (
		<ProFormRadio.Group
			{...props}
			rules={[
				{
					required: props.required,
					message: Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder,
				},
				...rules,
			].map((item) => ({ ...item, message: isString(item.message) ? t(item.message) : item.message }))}
			placeholder={t(props.placeholder)}
			label={isString(label) ? t(label).trim() : label}
		/>
	);
};

export default Radio;
