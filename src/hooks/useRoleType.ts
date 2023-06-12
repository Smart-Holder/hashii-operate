import { getUserInfo } from "../utils/tools";

const useRoleType = () => {
	const userInfo = getUserInfo();
	const isAdmin = userInfo?.roleType === 1;

	// const { locale } = useSelector<IInitStateProps, { locale: LanguageType }>((state) => ({
	// 	locale: state.locale,
	// }));
	return isAdmin;
};

export default useRoleType;
