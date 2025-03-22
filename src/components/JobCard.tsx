import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Button, Text, useTheme } from 'react-native-paper';
import { Job } from '../types/types';

interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
  onApply: (job: Job) => void;
  onRemove?: (id: string) => void;
  showRemoveButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onApply,
  onRemove,
  showRemoveButton
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{job.title}</Text>
        <Text variant="bodyLarge">{job.company}</Text>
        <Text variant="bodyMedium">{job.location}</Text>
        <Text variant="bodyMedium">{job.salary}</Text>
        <Text variant="bodySmall">{job.description}</Text>
      </Card.Content>
      <Card.Actions>
        {onSave && (
          <Button 
            mode="contained" 
            onPress={() => onSave(job)}
            disabled={job.isSaved}
          >
            {job.isSaved ? 'Saved' : 'Save Job'}
          </Button>
        )}
        <Button mode="contained" onPress={() => onApply(job)}>
          Apply
        </Button>
        {showRemoveButton && onRemove && (
          <Button 
            mode="contained"
            onPress={() => onRemove(job.id)}
            style={styles.removeButton}
          >
            Remove
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  removeButton: {
    backgroundColor: '#ff4444',
  }
}); 