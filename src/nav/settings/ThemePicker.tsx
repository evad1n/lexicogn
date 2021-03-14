import { changeTheme } from '@/src/store/actions/theme';
import Themes from '@/src/store/theme/themes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';



export default function ThemePicker() {
    const dispatch = useDispatch();

    const renderPalette = (name: string, color: string) => (
        <TouchableOpacity key={color} onPress={() => dispatch(changeTheme(color))}>
            <View style={[styles.color, { backgroundColor: color }]}>
            </View>
            <Text style={{ textTransform: 'capitalize' }}>{name}</Text>
        </TouchableOpacity>
    );

    const colorOptions = Object.keys(Themes);

    return (
        <View>
            {Object.keys(Themes).map((name) => {
                { renderPalette(name, Themes[name].primary.default); }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    color: {
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 5
    }
});
