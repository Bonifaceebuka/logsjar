import { Queue } from 'bullmq';
import { getRedisWorkerClient } from '../configs/redis';

export const emailQueue = new Queue('emailQueue', {
  connection: getRedisWorkerClient()
});

export const addNewExamSessionQueue = new Queue('examQueue', {
  connection: getRedisWorkerClient()
});