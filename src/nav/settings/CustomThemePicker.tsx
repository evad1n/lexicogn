import Divider from '@/src/components/layout/Divider';
import { useTheme } from '@/src/hooks/theme_provider';
import buttonStyles from '@/src/styles/button';
import Slider from '@brlja/react-native-slider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from 'react-native-bouncy-checkbox';

// Component props

interface ColorSliderProps {
    onChange: (color: string, value: number) => void;
    color: string;
    initialValue: number;
}

interface ColorDisplayProps {
    label: Selected;
    bgColor: string;
    textColor?: string;
    onSelect: (label: Selected) => void;
    selected: Selected;
}

// State

type ColorState = {
    red: number;
    green: number;
    blue: number;
};

type Selected =
    | "dark"
    | "dark text"
    | "light"
    | "light text";

// Constants

const sliderRadius = 30;

// Helper functions

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

export default function CustomThemePicker() {
    const { current: currentTheme, custom: customTheme, changeTheme, changeCustomTheme } = useTheme();

    // Have to split these up for performance reasons
    const [selected, setSelected] = useState<Selected>("dark");
    const [startColor, setStartColor] = useState<ColorState>(parseColorString(customTheme.primary.dark));

    // Theme color states
    const [darkColor, setDarkColor] = useState(customTheme.primary.dark);
    const [darkText, setDarkText] = useState(customTheme.primary.darkText);
    const [lightColor, setLightColor] = useState(customTheme.primary.light);
    const [lightText, setLightText] = useState(customTheme.primary.lightText);
    const [isDarkTheme, setIsDarkTheme] = useState(customTheme.dark);

    // Color state
    const [red, setRed] = useState(startColor.red);
    const [green, setGreen] = useState(startColor.green);
    const [blue, setBlue] = useState(startColor.blue);

    useEffect(() => {
        const currColor = `rgb(${red}, ${green}, ${blue})`;
        switch (selected) {
            case "dark":
                setDarkColor(currColor);
                break;
            case "dark text":
                setDarkText(currColor);
                break;
            case "light":
                setLightColor(currColor);
                break;
            case "light text":
                setLightText(currColor);
                break;
            default:
                break;
        }
    }, [red, green, blue]);

    async function saveCustomTheme() {
        try {
            const savedTheme = {
                dark: isDarkTheme,
                primary: {
                    dark: darkColor,
                    darkText: darkText,
                    light: lightColor,
                    lightText: lightText,
                }
            };
            await changeCustomTheme(savedTheme);
            changeTheme("custom");
        } catch (error) {
            throw Error(error);
        }
    }

    const getThemeColor = useCallback(
        (label: Selected) => {
            switch (label) {
                case "dark":
                    return darkColor;
                case "dark text":
                    return darkText;
                case "light":
                    return lightColor;
                case "light text":
                    return lightText;
            }
        },
        [darkColor, darkText, lightColor, lightText],
    );

    const changeSelection = useCallback(
        (label: Selected) => {
            const newColor = parseColorString(getThemeColor(label));
            setSelected(label);

            // Reset sliders
            setStartColor(parseColorString(getThemeColor(label)));
            setRed(newColor.red);
            setGreen(newColor.green);
            setBlue(newColor.blue);
        },
        [getThemeColor],
    );

    // Memoized sliderChange
    const sliderChange = useCallback(
        (color, val) => {
            switch (color) {
                case "red":
                    setRed(val);
                    return;
                case "green":
                    setGreen(val);
                    return;
                case "blue":
                    setBlue(val);
                    return;
            }
        },
        [],
    );

    function renderDisplayColors() {
        return (
            <View style={styles.displayContainer}>
                <ColorDisplay
                    onSelect={changeSelection}
                    selected={selected}
                    label={"dark"}
                    bgColor={darkColor}
                    textColor={darkText}
                />
                <ColorDisplay
                    onSelect={changeSelection}
                    selected={selected}
                    label={"dark text"}
                    bgColor={darkColor}
                    textColor={darkText}
                />
                <ColorDisplay
                    onSelect={changeSelection}
                    selected={selected}
                    label={"light"}
                    bgColor={lightColor}
                    textColor={lightText}
                />
                <ColorDisplay
                    onSelect={changeSelection}
                    selected={selected}
                    label={"light text"}
                    bgColor={lightColor}
                    textColor={lightText}
                />
            </View>
        );
    }

    function renderSliders() {
        return (
            <View style={styles.sliderContainer}>
                <ColorSlider
                    onChange={sliderChange}
                    color="red"
                    initialValue={startColor.red}
                />
                <ColorSlider
                    onChange={sliderChange}
                    color="green"
                    initialValue={startColor.green}
                />
                <ColorSlider
                    onChange={sliderChange}
                    color="blue"
                    initialValue={startColor.blue}
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {renderDisplayColors()}
                <Divider style={{ marginVertical: 20 }} color={currentTheme.primary.lightText} />
                {renderSliders()}
                <Divider style={{ marginBottom: 20 }} color={currentTheme.primary.lightText} />
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        size={30}
                        iconStyle={{ borderColor: currentTheme.primary.lightText, borderWidth: 2 }}
                        fillColor={currentTheme.primary.dark}
                        isChecked={isDarkTheme}
                        onPress={(val: boolean = false) => setIsDarkTheme(val)}
                    />
                    <Text style={[styles.checkboxText, { color: currentTheme.primary.lightText }]}>Dark Theme</Text>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={saveCustomTheme}
                        style={[buttonStyles.container, { backgroundColor: currentTheme.primary.dark }]}
                    >
                        <Text style={[buttonStyles.text, {
                            color:
                                currentTheme.primary.darkText
                        }]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const ColorDisplay = React.memo(({ label, bgColor, textColor, onSelect, selected }: ColorDisplayProps) => {
    return (
        <TouchableOpacity
            onPress={() => onSelect(label)}
            style={[styles.colorDisplay, { backgroundColor: bgColor }, selected === label ? styles.selected : null]}
        >
            <Text style={[styles.colorDisplayText, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );
});


const ColorSlider = React.memo(({ onChange, color, initialValue }: ColorSliderProps) => {

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
            onValueChange={val => onChange(color, val)}
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
});

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
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
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    checkbox: {
    },
    checkboxText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    button: {
        paddingHorizontal: 20,
        marginVertical: 10,
        width: "100%"
    }
});
