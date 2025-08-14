import Session from '@/models/Session';
import SessionService from '@/services/SessionService';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

const useSession = (
  sessionId: string,
): { session: Session | null; isLoading: boolean } => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const db = useSQLiteContext();

  useEffect(() => {
    const findSessionById = async () => {
      const sessionService = new SessionService(drizzle(db));
      try {
        const foundSession = await sessionService.getSessionById(sessionId);
        setSession(foundSession!);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    findSessionById();
  }, []);

  return { session, isLoading };
};

export default useSession;
