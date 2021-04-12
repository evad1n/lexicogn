import store from '_store/store';
import { getData } from './storage';
import { changeTheme } from './store/actions/themeActions';
import { initDB, getAllWords } from '_db/db';
import { setWords } from './store/actions/wordsActions';

// Load local storage theme
async function initialize() {
    await loadTheme();
    await loadDB();
};

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

async function loadDB() {
    try {
        await initDB();
        const words = await getAllWords();
        console.log(words.map(word => word.word));
        store.dispatch(setWords(words));
    } catch (error) {
        throw new Error(error);
    }
}



export default initialize;