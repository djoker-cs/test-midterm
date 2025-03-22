import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobFinderScreen } from '../screens/JobFinderScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { ApplicationForm } from '../components/ApplicationForm';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="JobFinder"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="JobFinder"
          component={JobFinderScreen}
          options={{ title: 'Job Finder' }}
        />
        <Stack.Screen
          name="SavedJobs"
          component={SavedJobsScreen}
          options={{ title: 'Saved Jobs' }}
        />
        <Stack.Screen
          name="ApplicationForm"
          component={ApplicationForm}
          options={{ title: 'Apply for Job' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 