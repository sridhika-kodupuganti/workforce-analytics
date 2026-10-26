import { useContext } from 'react';
import { WorkforceContext, type WorkforceContextType } from './WorkforceContextDef.ts';

export const useWorkforce = (): WorkforceContextType => {
  const context = useContext(WorkforceContext);
  if (!context) {
    throw new Error('useWorkforce must be used within a WorkforceProvider');
  }
  return context;
};
