import { db } from './firebase';
import {
    doc, getDoc, setDoc, updateDoc, increment,
    collection, query, orderBy, limit, getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { UserProfile } from '../types';

const USERS_COL = 'users';

/**
 * Upsert user profile on every login.
 * Creates the document if it doesn't exist, otherwise updates displayName/photoURL/lastSeen.
 */
export const upsertUserProfile = async (user: { uid: string; displayName: string | null; photoURL: string | null }): Promise<void> => {
    try {
        const ref = doc(db, USERS_COL, user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            await updateDoc(ref, {
                displayName: user.displayName || 'Anonymous',
                photoURL: user.photoURL || '',
                lastSeen: serverTimestamp(),
            });
        } else {
            await setDoc(ref, {
                displayName: user.displayName || 'Anonymous',
                photoURL: user.photoURL || '',
                bestScore: 0,
                gamesPlayed: 0,
                lastSeen: serverTimestamp(),
            });
        }
    } catch (e) {
        console.error('upsertUserProfile error:', e);
    }
};

/**
 * Fetch user profile with localStorage fallback for offline/error.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const ref = doc(db, USERS_COL, uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Cache in localStorage
            localStorage.setItem(`camblaster_profile_${uid}`, JSON.stringify(data));
            return data;
        }
        return null;
    } catch (e) {
        console.error('getUserProfile error (falling back to localStorage):', e);
        const cached = localStorage.getItem(`camblaster_profile_${uid}`);
        return cached ? JSON.parse(cached) : null;
    }
};

/**
 * Update best score — only writes if newScore > existing.
 */
export const updateBestScore = async (uid: string, newScore: number): Promise<void> => {
    try {
        const ref = doc(db, USERS_COL, uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const current = snap.data()?.bestScore ?? 0;
            if (newScore > current) {
                await updateDoc(ref, { bestScore: newScore });
                // Update localStorage cache too
                const cached = localStorage.getItem(`camblaster_profile_${uid}`);
                if (cached) {
                    const profile = JSON.parse(cached);
                    profile.bestScore = newScore;
                    localStorage.setItem(`camblaster_profile_${uid}`, JSON.stringify(profile));
                }
            }
        }
    } catch (e) {
        console.error('updateBestScore error:', e);
        // At minimum persist locally
        localStorage.setItem('camblaster_best_score', newScore.toString());
    }
};

/**
 * Atomically increment games played counter.
 */
export const incrementGamesPlayed = async (uid: string): Promise<void> => {
    try {
        const ref = doc(db, USERS_COL, uid);
        await updateDoc(ref, { gamesPlayed: increment(1) });
    } catch (e) {
        console.error('incrementGamesPlayed error:', e);
    }
};

/**
 * Leaderboard — top 10 users by bestScore.
 */
export const getLeaderboard = async (limitCount = 10): Promise<UserProfile[]> => {
    try {
        const q = query(
            collection(db, USERS_COL),
            orderBy('bestScore', 'desc'),
            limit(limitCount)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
    } catch (e) {
        console.error('getLeaderboard error:', e);
        return [];
    }
};
