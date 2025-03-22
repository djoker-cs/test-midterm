import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { JobCard } from '../components/JobCard';
import { useJobs } from '../hooks/useJobs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedJobs'>;

export const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { savedJobs, loading, removeJob } = useJobs();

  const handleApply = (job: any) => {
    navigation.navigate('ApplicationForm', { job, fromSavedJobs: true });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No saved jobs yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedJobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <JobCard
          job={item}
          onSave={() => removeJob(item.id)}
          onApply={handleApply}
          isSaved={true}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 8,
  },
}); 