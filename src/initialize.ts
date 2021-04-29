import { initDB } from '_db/db';
import { getData } from './storage';

// Load local storage theme
async function initialize() {
    await loadDB();
};

async function loadDB() {
    try {
        await initDB();
    } catch (error) {
        throw new Error(error);
    }
}


export default initialize;