import { ProColumns } from "@ant-design/pro-components";
import useTranslation from "./useTranslation";
import { t } from "../utils/tools";

const useTranslateColumns = (columns: ProColumns[]) => {
	const { t } = useTranslation();

	return columns.map((item) => {
		item.title = t(item.title as string);
		return item;
	});
};

export const translateColumns = (columns: ProColumns[]) => {
	// const { t } = useTranslation();

	return columns.map((item) => {
		item.title = t(item.title as string);
		return item;
	});
};

export default useTranslateColumns;
