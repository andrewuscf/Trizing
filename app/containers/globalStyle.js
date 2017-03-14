import {StyleSheet} from 'react-native';

const GlobalStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    simpleBottomBorder: {
        borderColor: '#e1e3df',
        borderBottomWidth: 1
    },
    topBottomBorder: {
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    simpleTopBorder: {
        borderColor: '#e1e3df',
        borderTopWidth: 1
    },
    simpleTopBorderMedium: {
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        marginRight: 20,
        marginLeft: 20,
    },
});

export default GlobalStyle;