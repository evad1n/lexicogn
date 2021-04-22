import { storeData } from '@/src/storage';
import buttonStyles from '@/src/styles/button';
import Slider from '@brlja/react-native-slider';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { changeCustomTheme } from '_store/actions/themeActions';
import { useCurrentTheme, useCustomTheme, useTypedDispatch } from '_store/hooks';

// Component props

interface ColorSliderProps {
    onChange: (value: number) => void;
    color: string;
    initialValue: number;
}

interface ColorDisplayProps {
    label: Selected;
    bgColor: string;
    textColor?: string;
}

// State

type ColorState = {
    red: number;
    green: number;
    blue: number;
};

const initialState: ColorState = {
    red: 100,
    green: 100,
    blue: 100,
};

type Selected =
    | "default"
    | "light"
    | "dark"
    | "text"
    | null;

// Constants

const sliderRadius = 30;

export default function CustomThemePicker() {
    const currentTheme = useCurrentTheme();
    const dispatch = useTypedDispatch();

    const [color, setColor] = useState<ColorState>(initialState);
    const [theme, setTheme] = useState<ColorPalette>(useCustomTheme().primary);
    const [selected, setSelected] = useState<Selected>(null);

    useEffect(() => {
        const currColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        switch (selected) {
            case "default":
                setTheme({ ...theme, default: currColor });
                break;
            case "light":
                setTheme({ ...theme, light: currColor });
                break;
            case "dark":
                setTheme({ ...theme, dark: currColor });
                break;
            case "text":
                setTheme({ ...theme, text: currColor });
                break;
            default:
                break;
        }
    }, [color]);

    function parseColorString(text: string): ColorState {
        const rgb = text.substring(4, text.length - 1)
            .replace(/ /g, '')
            .split(',')
            .map(valString => parseInt(valString));
        return {
            red: rgb[0],
            green: rgb[1],
            blue: rgb[2],
        };
    }

    async function saveCustomTheme() {
        try {
            await storeData("@customTheme", theme);
            dispatch(changeCustomTheme({
                dark: true,
                primary: theme
            }));
        } catch (error) {
            console.error(error);
        }
    }

    function changeSelection(label: Selected) {
        setColor(parseColorString(theme[label!]));
        setSelected(label);
    }

    function ColorDisplay({ label, bgColor, textColor }: ColorDisplayProps) {
        return (
            <TouchableOpacity
                onPress={() => changeSelection(label)}
                style={[styles.colorDisplay, { backgroundColor: bgColor }, selected === label ? styles.selected : null]}
            >
                <Text style={[styles.colorDisplayText, { color: textColor }]}>{label}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.displayContainer}>
                    <ColorDisplay
                        label={"default"}
                        bgColor={theme.default}
                    />
                    <ColorDisplay
                        label={"light"}
                        bgColor={theme.light}
                    />
                    <ColorDisplay
                        label={"dark"}
                        bgColor={theme.dark}
                    />
                    <ColorDisplay
                        label={"text"}
                        bgColor={theme.default}
                        textColor={theme.text}
                    />
                </View>
                <View style={styles.sliderContainer}>
                    <ColorSlider
                        onChange={(val) => setColor({ ...color, red: val })}
                        color="red"
                        initialValue={color.red}
                    />
                    <ColorSlider
                        onChange={(val) => setColor({ ...color, green: val })}
                        color="green"
                        initialValue={color.green}
                    />
                    <ColorSlider
                        onChange={(val) => setColor({ ...color, blue: val })}
                        color="blue"
                        initialValue={color.blue}
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={saveCustomTheme}
                        style={[buttonStyles.container, { backgroundColor: currentTheme.primary.default }]}
                    >
                        <Text style={[buttonStyles.text]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}


function ColorSlider({ onChange, color, initialValue }: ColorSliderProps) {
    const thumbColor = useMemo(() => {
        switch (color) {
            case "red":
                return "#f00";
            case "green":
                return "#0d0";
            case "blue":
                return "#00b";
            default:
                return "#fff";
        }
    }, [color]);

    return (
        <Slider
            onValueChange={onChange}
            value={initialValue}
            thumbTintColor={thumbColor}
            style={styles.slider}
            thumbTouchSize={{ width: sliderRadius + 5, height: sliderRadius + 5 }}
            thumbStyle={styles.thumbStyle}
            trackStyle={styles.trackStyle}
            minimumValue={0}
            maximumValue={255}
            step={1}
            minimumTrackTintColor={thumbColor}
            maximumTrackTintColor="#000000"
        />
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        flex: 1
    },
    displayContainer: {
        width: "100%",
    },
    colorDisplay: {
        padding: 10,
        marginVertical: 5,
        borderColor: "#000",
        elevation: 4,
    },
    selected: {
        elevation: 20,
        borderWidth: 3,
        borderColor: "#fff"
    },
    colorDisplayText: {
        textAlign: "center",
        fontWeight: "100",
        fontSize: 24,
        textTransform: "capitalize"
    },
    sliderContainer: {
        width: "100%",
        flexGrow: 1,
        marginVertical: 10
    },
    slider: {
        marginVertical: 15
    },
    trackStyle: {
        backgroundColor: "#222"
    },
    thumbStyle: {
        width: sliderRadius,
        height: sliderRadius,
        borderRadius: 50,
        borderColor: "#222",
        borderWidth: 2,
    },
    button: {
        paddingHorizontal: 20,
        marginVertical: 10,
        width: "100%"
    }
});
