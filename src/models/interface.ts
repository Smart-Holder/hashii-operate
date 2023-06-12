export interface IListPageProps {
	page: number | string;
	limit: number | string;
	// orderField?: string;
	// orderType?: "desc" | "aesc";
}

export interface IListResultProps<T> {
	list: T;
	List: T;
	count: number;
}
