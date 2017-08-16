import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';


class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      stopTime: null,
      pausedTime: null,
      started: false,
      elapsed: null,
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.formatTimeMinutes = this.formatTimeMinutes.bind(this);
    this.formatTimeSeconds = this.formatTimeSeconds.bind(this);
    const width = props.msecs ? 220 : 150;
    this.defaultStyles = {
      container: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        width: width,
      },
      text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
      },
      minutes_text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
      },
      seconds_text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
      }
    };
  }

  componentDidMount() {
    if(this.props.start) {
      this.start();
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.start) {
      this.start();
    } else {
      this.stop();
    }
    if(newProps.reset) {
      this.reset();
    }
  }

  componentWillUnmount() {
     clearInterval(this.interval);
  }

  start() {
    if (this.props.laps && this.state.elapsed) {
      let lap = new Date() - this.state.stopTime;
      this.setState({
        stopTime: null,
        pausedTime: this.state.pausedTime + lap
      })
    }
    
    this.setState({startTime: this.state.elapsed ? new Date() - this.state.elapsed :
      new Date(), started: true});
      
    this.interval = this.interval ? this.interval : setInterval(() => {
        this.setState({elapsed: new Date() - this.state.startTime - this.state.pausedTime });
    }, 1);
  }

  stop() {
    if(this.interval) {
      if (this.props.laps) {
        this.setState({stopTime: new Date()})
      }

      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({started: false});
  }

  reset() {
    this.setState({elapsed: null, startTime: null, stopTime: null, pausedTime: null});
  }
  
  getSeparator() {
    if (this.props.separator) {
      return <Text style={styles.separator}>:</Text>;
    }
    return null;
  }

  formatTimeMinutes() {
    let now = this.state.elapsed;
    let minutes = Math.floor(now / 60000);
    let hours = Math.floor(now / 3600000);
    minutes = minutes - (hours * 60);
    let formatted = `${minutes < 10 ?
        0 : ""}${minutes}`;

    if (typeof this.props.getTime === "function")
      this.props.getTime(formatted);

    return formatted;
  }
  
  formatTimeSeconds() {
    let now = this.state.elapsed;
    let seconds = Math.floor(now / 1000);
    let minutes = Math.floor(now / 60000);
    seconds = seconds - (minutes * 60);
    let formatted = `${seconds < 10 ?
          0 : ""}${seconds}`;

    if (typeof this.props.getTime === "function")
      this.props.getTime(formatted);

    return formatted;
  }

  render() {

    const styles = this.props.options ? this.props.options : this.defaultStyles;

    return(
      <View ref="stopwatch" style={styles.container}>
        <Text style={styles.minutes_text}>{this.formatTimeMinutes()}</Text>
        {this.getSeparator()}
        <Text style={styles.seconds_text}>{this.formatTimeSeconds()}</Text>
      </View>
    );
  }
}

export default StopWatch;
