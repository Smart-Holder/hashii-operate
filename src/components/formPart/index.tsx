import React, { FC, PropsWithChildren } from "react";
import { Row, RowProps } from "antd";
import "./index.scss";
import { t } from "../../utils/tools";
// import FCC from 'types.ts';
type IFormPartProps = {
	title?: string;
};
const FormPart: FC<PropsWithChildren<IFormPartProps & RowProps>> = (props) => {
	const { title, children, ...rest } = props;
	return (
		<Row className="form_part" {...rest}>
			<div className="part_title">{t(title)}</div>
			{children}
		</Row>
	);
};

export default FormPart;
