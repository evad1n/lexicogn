import store from '_store/store';
import { getData, storeData } from './storage';
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
        store.dispatch(setWords(words));
        // Get home word here
        if (words.length > 0) {
            const homeWord = words[Math.floor(Math.random() * words.length)];
            await storeData("@homeWord", homeWord);
        }
    } catch (error) {
        throw new Error(error);
    }
}


export default initialize;