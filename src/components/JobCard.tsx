import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { Job } from '../types/types';

interface JobCardProps {
  job: Job;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
  isSaved: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSave, onApply, isSaved }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{job.title}</Title>
        <Paragraph style={styles.company}>{job.company}</Paragraph>
        <Paragraph style={styles.salary}>{job.salary}</Paragraph>
        <Paragraph style={styles.location}>{job.location}</Paragraph>
        <Paragraph style={styles.description} numberOfLines={3}>
          {job.description}
        </Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode={isSaved ? 'contained' : 'outlined'}
          onPress={() => onSave(job)}
          style={styles.button}
        >
          {isSaved ? 'Saved' : 'Save Job'}
        </Button>
        <Button
          mode="contained"
          onPress={() => onApply(job)}
          style={styles.button}
        >
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  salary: {
    fontSize: 14,
    color: '#2ecc71',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    padding: 8,
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 8,
  },
}); 