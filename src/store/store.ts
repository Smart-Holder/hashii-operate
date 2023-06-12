import { createStore, Reducer } from "redux";
import reducer from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
	key: "root",
	storage,
	stateReconciler: autoMergeLevel2, // 查看 'Merge Process' 部分的具体情况
	blacklist: ["modalConfig"],
};

const myPersistReducer = persistReducer(persistConfig, reducer as Reducer);

const store = createStore(myPersistReducer);

export const persistor = persistStore(store);

export default store;
