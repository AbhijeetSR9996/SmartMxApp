import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DotsLoading = () => {
  const [dotCountLoad, setDotCountLoad] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCountLoad(count => (count % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const renderDotsLoadLoad = () => {
    return <Text style={styles.dotsLoad}>{'\u2022'.repeat(dotCountLoad)}</Text>;
  };

  return <View style={styles.containerLoad}>{renderDotsLoadLoad()}</View>;
};

const styles = StyleSheet.create({
  containerLoad: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsLoad: {
    fontSize: 24,
    color: 'gray',
  },
});

export default DotsLoading;
