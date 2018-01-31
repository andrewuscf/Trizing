import React from 'react';
import {
    View,
    Text,
    Picker
} from 'react-native';

function select(locals) {

    if (locals.hidden) {
        return null;
    }

    let stylesheet = locals.stylesheet;
    let formGroupStyle = stylesheet.dateTouchable.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let selectStyle = Object.assign(
        {},
        stylesheet.select.normal,
        stylesheet.pickerContainer.normal
    );
    let helpBlockStyle = stylesheet.helpBlock.normal;
    let errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
        formGroupStyle = stylesheet.dateTouchable.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        selectStyle = stylesheet.select.error;
        helpBlockStyle = stylesheet.helpBlock.error;
    }

    let label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    let help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    let error =
        locals.hasError && locals.error ? (
            <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
                {locals.error}
            </Text>
        ) : null;

    let options = locals.options.map(({value, text}) => (
        <Picker.Item key={value} value={value} label={text}/>
    ));

    return (
        <View style={[formGroupStyle]}>
            <Picker
                accessibilityLabel={locals.label}
                ref="input"
                style={[selectStyle, {flex: 1}]}
                selectedValue={locals.value}
                onValueChange={locals.onChange}
                help={locals.help}
                enabled={locals.enabled}
                mode={locals.mode}
                prompt={locals.prompt}
                itemStyle={locals.itemStyle}
            >
                {options}
            </Picker>
            {help}
            {error}
        </View>
    );
}

module.exports = select;