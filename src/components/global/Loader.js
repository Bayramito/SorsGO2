import LottieView from 'lottie-react-native';
import React from 'react';

import {Text, View, StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const Loader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/Animation - 1735229680742.json')}
        style={{
          width: 100,
          height: 100,
        }}
        autoPlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
