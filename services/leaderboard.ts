import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, where } from 'firebase/firestore';
import { Difficulty } from '../types';

export interface LeaderboardEntry {
    id?: string;
    userId: string;
    userName: string;
    photoURL?: string;
    score: number;
    difficulty: Difficulty;
    createdAt: Timestamp;
}

const COLLECTION_NAME = 'camblaster_scores';

export const saveScore = async (entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...entry,
            createdAt: Timestamp.now()
        });
    } catch (e) {
        console.error("Error saving score: ", e);
    }
};

export const getLeaderboard = async (difficulty: Difficulty, limitCount = 10): Promise<LeaderboardEntry[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('difficulty', '==', difficulty),
            orderBy('score', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
    } catch (e) {
        console.error("Error fetching leaderboard: ", e);
        return [];
    }
};
