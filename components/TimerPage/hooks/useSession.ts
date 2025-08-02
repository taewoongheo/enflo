import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { useEffect, useState } from 'react';

const useSession = (
  sessionId: string,
): { session: Session | null; isLoading: boolean } => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const findSessionById = async () => {
      try {
        const foundSession = sessionMockData.find(
          (el) => el.sessionId === sessionId,
        );
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
