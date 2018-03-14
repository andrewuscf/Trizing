import t from 'tcomb-form-native';
import _ from 'lodash';

import {getFontSize} from "../actions/utils";
import {Platform} from "react-native";

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        borderColor: '#cccccc',
        borderWidth: 1,
        padding: 5,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0,
        borderRadius: 5,
    },
    error: {
        ...stylesheet.formGroup.error,
        borderColor: 'red',
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 5,
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    }
};
stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        borderWidth: 0,
        marginBottom: 0,
    },
    error: {
        ...stylesheet.textbox.error,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        borderWidth: 0,
        marginBottom: 0,
    }
};

stylesheet.pickerValue = {
    ...stylesheet.pickerValue,
    normal: {
        ...stylesheet.pickerValue.normal,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        color: '#000000'
    },
    error: {
        ...stylesheet.pickerValue.error,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        color: 'red'
    }
};

stylesheet.pickerTouchable = {
    normal: {
        ...stylesheet.pickerTouchable.normal,
        ...Platform.select({
            android: {
                backgroundColor: 'white',
                height: 40,
                borderWidth: 0,
                borderRadius: 4,
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 10,
                paddingHorizontal: 5,
            },
            ios: {
                borderWidth: 0,
            }
        }),
        error: {
            ...stylesheet.pickerTouchable.error,
            ...Platform.select({
                android: {
                    backgroundColor: 'white',
                    height: 40,
                    borderRadius: 4,
                    borderWidth: .5,
                    borderColor: 'red',
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 10,
                    paddingHorizontal: 5,
                },
                ios: {
                    borderWidth: .5,
                    borderColor: 'red',
                }
            })
        },
    }
};

// stylesheet.pickerContainer = {
//     ...stylesheet.pickerContainer,
//     normal: {
//         ...stylesheet.pickerContainer.normal,
//         height: 40,
//         paddingHorizontal: 15,
//         marginBottom: 0,
//         borderWidth: 0,
//         borderRadius: 4,
//     },
//     error: {
//         ...stylesheet.pickerContainer.error,
//         height: 40,
//         paddingHorizontal: 15,
//         borderRadius: 4,
//         marginBottom: 0,
//         borderWidth: .5,
//         borderColor: 'red',
//     }
// };

stylesheet.dateValue = {
    ...stylesheet.dateValue,
    normal: {
        ...stylesheet.dateValue.normal,
        fontSize: getFontSize(14),
        // fontFamily: 'Heebo-Regular',
        color: '#000000',
        marginBottom: 0,
    },
    error: {
        ...stylesheet.dateValue.error,
        fontSize: getFontSize(14),
        // fontFamily: 'Heebo-Regular',
        color: 'red',
        marginBottom: 0,
    }
};

stylesheet.dateTouchable = {
    normal: Platform.select({
        android: {
            backgroundColor: 'white',
            height: 40,
            borderColor: "#cccccc",
            borderWidth: 1,
            borderRadius: 4,
            margin: 10,
            marginBottom: 0,
            paddingHorizontal: 5,
        },
        ios: {
            borderWidth: 0,
        }
    }),
    error: Platform.select({
        android: {
            backgroundColor: 'white',
            height: 40,
            borderRadius: 4,
            borderWidth: .5,
            borderColor: 'red',
            margin: 10,
            marginBottom: 0,
            paddingHorizontal: 5,
        },
        ios: {
            borderWidth: .5,
            borderColor: 'red',
        }
    }),
};

export default stylesheet;
