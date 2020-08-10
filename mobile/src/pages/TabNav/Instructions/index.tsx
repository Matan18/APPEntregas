import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabNavContext } from '../../../context/TabNav';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from './styles';

const Instructions: React.FC = () => {
  const { legs, copyrights } = useContext(TabNavContext);
  return (
    <ScrollView style={styles.container}>
      {legs[0] ? (
        <>
          {legs.map((item, index) => (
            <View key={`${item.end_address}, ${item.start_address}`}>
              {index === 0 && (
                <View style={styles.point}>
                  <Image source={require('../../../mapIcons/Vector.png')} />
                  <View style={styles.textBox}>
                    <Text style={{ ...styles.pointText, ...styles.text }}>
                      {item.start_address}
                    </Text>
                  </View>
                </View>
              )}
              <View>
                <Text
                  style={styles.text}
                >{`${item.distance.text}. Cerca de ${item.duration.text}`}</Text>
                {item.steps.map(step => (
                  <View
                    key={`${step.html_instructions}, ${step.polyline}`}
                    style={[styles.line, styles.withBorder]}
                  >
                    <Text style={styles.text}>
                      {step.html_instructions.replace(
                        /<b>|<\/b>|<div>|<\/div>|<div style="font-size:0.9em">/g,
                        ' ',
                      )}
                    </Text>
                  </View>
                ))}
                <View style={styles.point}>
                  <Image source={require('../../../mapIcons/Vector.png')} />
                  <View style={styles.textBox}>
                    <Text style={{ ...styles.pointText, ...styles.text }}>
                      {item.end_address}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <Text style={{ ...styles.text, ...styles.copyrights }}>
            {copyrights}
          </Text>
        </>
      ) : (
        <View />
      )}
    </ScrollView>
  );
};

export default Instructions;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  point: {
    height: 50,
    margin: 5,
    flexDirection: 'row',
    backgroundColor: '#ebebeb',
    borderWidth: 0.2,
    borderColor: '#000000',
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
  },
  pointText: {
    width: 295,
  },
  line: {
    left: 5,
    width: 340,
    margin: 5,
  },
  withBorder: {
    borderTopWidth: 0.7,
  },
  copyrights: {
    marginBottom: 7,
  },
  textBox: {
    padding: 5,
    margin: 1,
  },
});
