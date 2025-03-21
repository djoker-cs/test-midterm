import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import { JobFinderScreen } from './src/screens/JobFinderScreen';
import { SavedJobsScreen } from './src/screens/SavedJobsScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#000000',
        headerRight: () => (
          <IconButton
            icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
            onPress={toggleTheme}
          />
        ),
      }}
    >
      <Stack.Screen
        name="JobFinder"
        component={JobFinderScreen}
        options={({ navigation }) => ({
          title: 'Job Finder',
          headerLeft: () => (
            <IconButton
              icon="bookmark-outline"
              onPress={() => navigation.navigate('SavedJobs')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{ title: 'Saved Jobs' }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
}
