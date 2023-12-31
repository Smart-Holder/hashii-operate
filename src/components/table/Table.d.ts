/// <reference types="react" />
import "antd/es/table/style";
import "antd/es/typography/style";
import type { ParamsType } from "@ant-design/pro-provider";
import type { ProTableProps } from "./typing";
/**
 * 🏆 Use Ant Design Table like a Pro! 更快 更好 更方便
 *
 * @param props
 */
declare const ProviderTableContainer: {
	<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType = "text">(
		props: ProTableProps<DataType, Params, ValueType>
	): JSX.Element;
	Summary: typeof import("rc-table/lib/Footer/Summary").default;
};
export default ProviderTableContainer;
