import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import _ from 'lodash';

import {getFontSize} from '../../actions/utils';

import MacroBoxDay from '../../components/MacroBoxDay';


const MacroPlanDetail = CreateClass({
    propTypes: {
        macro_plan: PropTypes.object.isRequired,
    },

    renderHeader() {
        const plan = this.props.macro_plan;
        let created_at = moment.utc(plan.created_at).local();
        return (
            <View>
                <View style={styles.center}>
                    <View style={styles.details}>
                        <Text style={styles.mainText}>{plan.name}</Text>
                        <Text style={styles.date}>
                            <Icon name="clock-o" size={12} color='#4d4d4e'
                            /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                        </Text>
                    </View>
                </View>
            </View>
        )
    },


    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const plan = this.props.macro_plan;
        let dataSource = ds.cloneWithRows(plan.macro_plan_days);
        return (
            <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      renderHeader={this.renderHeader}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(day_plan, sectionID, rowID) =>
                          <MacroBoxDay day_plan={day_plan} selectedDays={day_plan.days}
                                       active={(plan.is_active && _.includes(day_plan.days, moment().isoWeekday()))}/>
                      }
            />
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        backgroundColor: 'white'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        padding: 10
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18
    },
    date: {
        fontSize: getFontSize(15),
        lineHeight: getFontSize(26),
    },
    mainText: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium'
    },
    smallText: {
        fontSize: getFontSize(12),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium'
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: 10
    },
    createButton: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        bottom: 0,
    },
});

export default MacroPlanDetail;
