import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Job } from '../types/types';

interface JobCardProps {
  job: Job;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
  isSaved: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onApply,
  isSaved
}) => {
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
          mode={isSaved ? "contained" : "outlined"}
          onPress={() => onSave(job)}
        >
          {isSaved ? "Saved" : "Save Job"}
        </Button>
        <Button
          mode="contained"
          onPress={() => onApply(job)}
          style={styles.applyButton}
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
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
    marginVertical: 4,
  },
  salary: {
    color: '#2ecc71',
    marginVertical: 2,
  },
  location: {
    color: '#666',
    marginVertical: 2,
  },
  description: {
    marginTop: 8,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  applyButton: {
    marginLeft: 8,
  },
}); 