import React from "react";
import { ProFormSelect, ProFormSelectProps } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { isString } from "util";
import { t } from "../../utils/tools";
import { RuleObject } from "antd/es/form";

export const convertValueEnum = <T extends Record<number | string, number | string>>(
	dict: T,
	exclude: Array<string | number> = [],
	forceCoverNumber: boolean = true
): Map<keyof T, T[keyof T] | string | number> => {
	const enumMap = new Map<keyof T, T[keyof T] | number | string>();

	let key: keyof T;
	for (key in dict) {
		!exclude.includes(key) &&
			!isNaN(Number(key)) &&
			enumMap.set(forceCoverNumber ? Number(key) : key, t(dict[key]));
	}

	return enumMap;
};

interface ISelectProps extends ProFormSelectProps {
	rules?: RuleObject[];
}

const Select: React.FC<ISelectProps> = (props) => {
	// eslint-disable-next-line
	const { t }: { t: TFunction } = useTranslation();
	const { label, rules = [] } = props;
	const placeholder = t(Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder);
	return (
		<ProFormSelect
			{...props}
			placeholder={placeholder}
			rules={[
				{
					required: props.required,
					message: placeholder,
				},
				...rules,
			].map((item) => ({ ...item, message: isString(item.message) ? t(item.message) : item.message }))}
			label={isString(label) ? t(label).trim() : label}
		/>
	);
};

export default Select;
