import { createStore } from 'redux';
import { rootReducer } from './reducers/rootReducer';

const store = createStore(rootReducer);

export type RootDispatch = typeof store.dispatch;

export default store;