// TODO: fix theme colors
const Themes: ThemeMap = {
    "light": {
        dark: false,
        primary: {
            default: "#fff",
            light: "#f0f0f0",
            dark: "#c7c7c7",
            text: "#000"
        },
    },
    "dark": {
        dark: true,
        primary: {
            default: "#000",
            light: "#222",
            dark: "#000",
            text: "#fff"
        },
    },
    "dimmed": {
        dark: true,
        primary: {
            default: "#333",
            light: "#555",
            dark: "#333",
            text: "#fff"
        },
    },
    "rust": {
        dark: false,
        primary: {
            default: "#3b2e2a",
            light: "#e1e1db",
            dark: "#333",
            text: "#000"
        },
    },
    "ocean": {
        dark: true,
        primary: {
            default: "#001869",
            light: "#2a45a1",
            dark: "#1f44c2",
            text: "#fff"
        },
    },
    "green": {
        dark: false,
        primary: {
            default: "#95c96d",
            light: "#cff0b6",
            dark: "#82b85a",
            text: "#000"
        },
    },
};

export default Themes;