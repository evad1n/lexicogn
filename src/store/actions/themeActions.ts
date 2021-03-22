import { storeData } from '@/src/storage';
import themes from '../theme/themes';

export const changeTheme = (name: string): ThemeAction => {
    // Persist theme
    storeData('@theme', name);

    return {
        type: 'CHANGE_THEME',
        theme: {
            name: name,
            ...themes[name],
        }
    };
};