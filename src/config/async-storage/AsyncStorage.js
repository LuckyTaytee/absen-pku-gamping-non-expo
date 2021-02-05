import AsyncStorage from '@react-native-community/async-storage';

class AppAsyncStorage {

    setAsync = async(key, value) => {
        await AsyncStorage.setItem(key, value);
    }

    getAsync = async(key) => {
        var value,collect;
        value = await AsyncStorage.getItem(key).then(
            (values) => {
                collect = values;
            });
        return collect;
    }
}

const AsyncStore = new AppAsyncStorage();
export default AsyncStore;