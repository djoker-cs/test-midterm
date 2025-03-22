import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Job } from '../types/types';
import { useTheme } from '../context/ThemeContext';

interface JobCardProps {
  job: Job;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
  onRemove?: (jobId: string) => void;
  showRemoveButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onApply,
  onRemove,
  showRemoveButton = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }
      ]}
    >
      <Card.Content>
        <Title style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          {job.title}
        </Title>
        <Paragraph style={{ color: isDarkMode ? '#e0e0e0' : '#666666' }}>
          {job.company}
        </Paragraph>
        <Paragraph style={{ color: isDarkMode ? '#e0e0e0' : '#666666' }}>
          Salary: {job.salary}
        </Paragraph>
        <Paragraph style={{ color: isDarkMode ? '#e0e0e0' : '#666666' }}>
          Location: {job.location}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        {!showRemoveButton ? (
          <>
            <Button
              mode="contained"
              onPress={() => onSave(job)}
              disabled={job.isSaved}
            >
              {job.isSaved ? 'Saved' : 'Save Job'}
            </Button>
            <Button
              mode="outlined"
              onPress={() => onApply(job)}
              style={{ marginLeft: 8 }}
            >
              Apply
            </Button>
          </>
        ) : (
          <>
            <Button
              mode="contained"
              onPress={() => onApply(job)}
            >
              Apply
            </Button>
            <Button
              mode="outlined"
              onPress={() => onRemove?.(job.id)}
              style={{ marginLeft: 8 }}
            >
              Remove
            </Button>
          </>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
}); 