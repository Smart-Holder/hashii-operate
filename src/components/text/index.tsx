import React, { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
interface IProps {
	text?: string;
}
/* eslint-disable */

type ITextProps = PropsWithChildren<IProps>;

const Text: FC<ITextProps> = (props) => {
	const { children, text } = props;
	const { t } = useTranslation();
	if (typeof children !== "string") return <div>{children}</div>;
	return <div>{t(text || children)}</div>;
};

export default Text;
