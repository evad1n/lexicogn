import AsyncStorage from "@react-native-async-storage/async-storage";

// Allows keys
type Key =
    | "@theme";

/**
 * Get data from async storage
 * @param key to retrieve the value of
 * @param json Whether to deserialize as JSON, defaults to true
 * @returns 
 */
export const getData = async (key: Key, json = true) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value == null)
            return null;
        return json ? JSON.parse(value) : value;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Store data in async storage
 * @param key key of value
 * @param value Value to store
 * @param json Whether to serialize as JSON, defaults to true
 */
export const storeData = async (key: Key, value: any, json = true) => {
    try {
        if (json)
            value = JSON.stringify(value);
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        throw new Error(error.message);
    }
};