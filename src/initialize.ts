import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllWords, initDB } from '_db/db';
import store from '_store/store';
import { getData } from './storage';
import { changeCustomTheme, changeTheme } from './store/actions/themeActions';

// Load local storage theme
async function initialize() {
    await loadTheme();
    await loadDB();
};

async function loadTheme() {
    try {
        const theme = await getData("@theme");
        const customTheme = await getData("@customTheme");
        if (customTheme) {
            store.dispatch(changeCustomTheme(customTheme));
        }
        // If there is a saved theme
        if (theme) {
            store.dispatch(changeTheme(theme));
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function loadDB() {
    try {
        await initDB();
    } catch (error) {
        throw new Error(error);
    }
}


export default initialize;