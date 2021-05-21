/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      //  navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });

    messaging().registerDeviceForRemoteMessages();

    messaging().onTokenRefresh(fcmToken => {
      // Process your token as required
      console.log('Updated Token=' + fcmToken);
    });

    console.log('HHHHH');
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage));
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    console.log('HHHHH');
    messaging()
      .subscribeToTopic('weather')
      .then(() => console.log('Subscribed to topic!'));

    getFcmToken();
    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getFcmToken = async () => {
    if (Platform.OS === 'ios') {
      messaging()
        .getAPNSToken()
        .then(async fcmToken => {
          if (fcmToken) {
            console.debug('APN token ==', fcmToken);
          } else {
            // user doesn't have a device token yet
            console.debug(
              "User doesn't have a device token yet, token = ",
              fcmToken,
            );
            messaging().requestPermission();
            setTimeout(() => {
              getFcmToken();
            }, 3000);
          }
        });
    }

    messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken) {
          console.debug('fcm token ==', fcmToken);
          //let token = await AsyncStorage.setItem(KEY_PUSH_TOKEN, fcmToken);
        } else {
          // user doesn't have a device token yet
          console.debug(
            "User doesn't have a device token yet, token = ",
            fcmToken,
          );
          messaging().requestPermission();
          setTimeout(() => {
            getFcmToken();
          }, 3000);
        }
      });
  };
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
