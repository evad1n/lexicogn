import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        elevation: 5,
        borderRadius: 3
    },
    text: {
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 0.5
    }
});

export default buttonStyles;