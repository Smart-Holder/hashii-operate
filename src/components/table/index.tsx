import React, { ReactElement } from "react";
import { ParamsType, ProTable, ProTableProps } from "@ant-design/pro-components";

const Table: (props: ProTableProps<Record<string, any>, ParamsType, String>) => ReactElement = (props) => {
	return <ProTable />;
};

export default Table;
