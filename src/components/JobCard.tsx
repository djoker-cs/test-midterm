import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Job } from '../types';
import { useTheme } from '../context/ThemeContext';

interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
  onRemove?: (jobId: string) => void;
  onApply: (job: Job) => void;
  showRemoveButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onRemove,
  onApply,
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
        <Paragraph style={{ color: isDarkMode ? '#e0e0e0' : '#333333' }}>
          {job.company}
        </Paragraph>
        <Paragraph style={{ color: isDarkMode ? '#e0e0e0' : '#333333' }}>
          Salary: {job.salary}
        </Paragraph>
        <Paragraph style={{ color: isDarkMode ? '#e0e0e0' : '#333333' }}>
          Location: {job.location}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        {onSave && !job.isSaved && (
          <Button onPress={() => onSave(job)}>Save</Button>
        )}
        {job.isSaved && <Button disabled>Saved</Button>}
        {showRemoveButton && onRemove && (
          <Button onPress={() => onRemove(job.id)}>Remove</Button>
        )}
        <Button mode="contained" onPress={() => onApply(job)}>
          Apply
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
}); 