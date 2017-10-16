import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet} from 'react-native';
import {StockLine} from 'react-native-pathjs-charts';
import moment from 'moment';

const {width: deviceWidth} = Dimensions.get('window');

const WeightGraph = CreateClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        // tickValues: PropTypes.array.isRequired,
    },


    render() {
        console.log(this.props.data)
        const tickValues = []
        const test = this.props.data.map((log, index) => {
            tickValues.push({value: moment(log.created_at).format('ddd, MMM DD')});
            return {"x": index, "y": log.weight}
        });
        console.log([test])
        let data = [test];
        let options = {
            width: deviceWidth - 100,
            height: 100,
            color: '#2980B9',
            margin: {
                top: 10,
                left: 35,
                bottom: 30,
                right: 10
            },
            animate: {
                type: 'delayed',
                duration: 200
            },
            axisX: {
                // showAxis: true,
                // showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
                tickValues: tickValues,
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            axisY: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                orient: 'left',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#34495E'
                }
            }
        }

        return (
            <StockLine data={data} options={options} xKey='x' yKey='y'/>
        )
    }
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default WeightGraph;
