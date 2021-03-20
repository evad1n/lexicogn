import store from '_store/store';
import { getData } from './storage';
import { changeTheme } from './store/actions/themeActions';

// Load local storage theme
async function initialize() {
    await loadTheme();
}

async function loadTheme() {
    try {
        const theme = await getData("@theme");
        // If there is a saved theme
        if (theme) {
            store.dispatch(changeTheme(theme));
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default initialize;