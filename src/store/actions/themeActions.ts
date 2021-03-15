import themes from '../theme/themes';

export const changeTheme = (name: string) => {
    return {
        type: "CHANGE_THEME",
        theme: {
            name: name,
            ...themes[name],
        }
    };
};