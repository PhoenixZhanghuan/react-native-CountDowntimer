import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

const styles = StyleSheet.create({
  cardItemTimeRemainTxt: {
    fontSize: 20,
    color: '#ee394b'
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  },
  container: {
    flexDirection: 'row',
  },
  //时间文字
  defaultTime: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  // 时间文字背景
  defaultTimeBackground: {
    borderRadius: 4,
    width: 18,
    height: 18,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7800'
  },
  //冒号
  defaultColon: {
    color: '#FF7800', fontSize: 10, marginLeft: 5
  }
});

class CountDown extends Component {
  static displayName = 'Simple countDown';
  static propTypes = {
    date: PropTypes.string,
    nowTime: PropTypes.string,
    days: PropTypes.objectOf(PropTypes.string),
    hours: PropTypes.string,
    mins: PropTypes.string,
    segs: PropTypes.string,
    onEnd: PropTypes.func,

    containerStyle: View.propTypes.style,
    daysStyle: Text.propTypes.style,
    hoursStyle: Text.propTypes.style,
    minsStyle: Text.propTypes.style,
    secsStyle: Text.propTypes.style,
    firstColonStyle: Text.propTypes.style,
    secondColonStyle: Text.propTypes.style,
    timeBackgroundStyle: View.propTypes.style
  };
  static defaultProps = {
    date: new Date(),
    days: {
      plural: '天',
      singular: '天',
    },
    hours: ':',
    mins: ':',
    segs: ':',
    onEnd: () => {},

    containerStyle: styles.container,//container 的style
    daysStyle: styles.defaultTime,//天数 字体的style
    hoursStyle: styles.defaultTime,//小时 字体的style
    minsStyle: styles.defaultTime,//分钟 字体的style
    secsStyle: styles.defaultTime,//秒数 字体的style
    firstColonStyle: styles.defaultColon,//从左向右 第一个冒号 字体的style
    secondColonStyle: styles.defaultColon,//从左向右 第2个冒号 字体的style

    timeBackgroundStyle: styles.defaultTimeBackground

  };
  state = {
    days: 0,
    hours: "--",
    min: "--",
    sec: "--",
  };

  componentWillMount(){
    if(this.props.startTime) {
      this.stop();
      let diff = this.compareTime(this.props.date, this.props.startTime);
      this.interval = setInterval(()=> {
        let date = this.getDateData(diff);
        if (date) {
          this.setState(date);
        } else {
          this.stop();
          this.props.onEnd();
          return;
        }
        diff--;
      }, 1000);
    }
  }

  componentWillReceiveProps(nextProps) {

    if(this.props !== nextProps && nextProps.startTime) {
        this.stop();
        let diff = this.compareTime(nextProps.date, nextProps.startTime);
        this.interval = setInterval(()=> {
          let date = this.getDateData(diff);
          if (date) {
            this.setState(date);
          } else {
            this.stop();
            this.props.onEnd();
            return;
          }
          diff--;
        }, 1000);
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  compareTime(endTime, startTime) {
    let leftHour;
    let leftMinute;
    let leftSecond;
    if(endTime.split(" ")[0] ===  startTime.split(" ")[0]) {
      leftHour = (endTime.split(" ")[1].split(":")[0] - startTime.split(" ")[1].split(":")[0]) * 3600;
      leftMinute= (endTime.split(" ")[1].split(":")[1] - startTime.split(" ")[1].split(":")[1]) * 60;
      leftSecond = (endTime.split(" ")[1].split(":")[2] - startTime.split(" ")[1].split(":")[2]) ;

      return leftHour + leftMinute + leftSecond;
    }else {
      return (24 - startTime.split(" ")[1].split(":")[0]) * 3600 - startTime.split(" ")[1].split(":")[1] * 60 - startTime.split(" ")[1].split(":")[2] ;
    }

  }

  getDateData(diff) {

    // let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date)) / 1000;
    if (diff <= 0) {
      return false;
    }

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    if (diff >= (365.25 * 86400)) {
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;
    return timeLeft;
  }

  render() {
    const countDown = this.state;
    let days;
    if (countDown.days === 1) {
      days = this.props.days.singular;
    } else {
      days = this.props.days.plural;
    }
    return (
    //    <View style={styles.container}>
    //      <Text style={styles.text}>{
    //        ((countDown.days > 0) ? this.leadingZeros(countDown.days)+days:'')
    //        +this.leadingZeros(countDown.hours)
    //        +':'+this.leadingZeros(countDown.min)
    //        +':'+this.leadingZeros(countDown.sec)}</Text>
    //    </View>
    //
        <View style={this.props.containerStyle}>
          { (countDown.days>0) ? <Text style={this.props.daysStyle}>{ this.leadingZeros(countDown.days)+days}</Text> : null}

          <View style={this.props.timeBackgroundStyle}>
            <Text style={this.props.hoursStyle}>{ this.leadingZeros(countDown.hours)}</Text>
          </View>

          <Text style={this.props.firstColonStyle}>:</Text>

          <View style={this.props.timeBackgroundStyle}>
            <Text style={this.props.minsStyle}>{this.leadingZeros(countDown.min)}</Text>
          </View>

          <Text style={this.props.secondColonStyle}>:</Text>

          <View style={this.props.timeBackgroundStyle}>
            <Text style={this.props.secsStyle}>{this.leadingZeros(countDown.sec)}</Text>
          </View>
        </View>


    );
  }
  stop() {
    this.interval && clearInterval(this.interval);
  }
  leadingZeros(num, length = null) {

    let length_ = length;
    let num_ = num;
    if (length_ === null) {
      length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
      num_ = '0' + num_;
    }
    return num_;
  }
};

export default CountDown;
