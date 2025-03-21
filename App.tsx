import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import { ThemeProvider } from './src/context/ThemeContext';
import { JobFinderScreen } from './src/screens/JobFinderScreen';
import { SavedJobsScreen } from './src/screens/SavedJobsScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="JobFinder">
            <Stack.Screen
              name="JobFinder"
              component={JobFinderScreen}
              options={({ navigation }) => ({
                title: 'Job Finder',
                headerRight: () => (
                  <PaperProvider>
                    <IconButton
                      icon="bookmark"
                      onPress={() => navigation.navigate('SavedJobs')}
                    />
                  </PaperProvider>
                ),
              })}
            />
            <Stack.Screen
              name="SavedJobs"
              component={SavedJobsScreen}
              options={{ title: 'Saved Jobs' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
}
