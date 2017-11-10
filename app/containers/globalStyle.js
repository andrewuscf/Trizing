import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';

const GlobalStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    noHeaderContainer: {
        flex: 1,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    simpleBottomBorder: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1
    },
    topBottomBorder: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    simpleTopBorder: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: 1
    },
    simpleTopBorderMedium: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        marginRight: 20,
        marginLeft: 20,
    },
    lightBlueText: {
        color: '#00AFA3'
    },
    redText: {
        color: '#ff473d'
    },
    redBackground: {
        backgroundColor: '#ff473d'
    }
});

export default GlobalStyle;