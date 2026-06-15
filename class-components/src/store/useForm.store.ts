import { create } from 'zustand';

export interface FormDataRecord {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  acceptedTerms: boolean;
  imageString: string;
  country: string;
  submittedAt: number;
}

interface FormState {
  submissions: FormDataRecord[];
  countries: string[];
  addSubmission: (
    submission: Omit<FormDataRecord, 'id' | 'submittedAt'>
  ) => void;
}

export const useFormStore = create<FormState>((set) => ({
  submissions: [],
  countries: [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'Georgia',
    'France',
    'Ukraine',
    'Poland',
    'Spain',
    'Japan',
    'Australia',
  ],
  addSubmission: (submission) =>
    set((state) => ({
      submissions: [
        ...state.submissions,
        {
          ...submission,
          id: crypto.randomUUID(),
          submittedAt: Date.now(),
        },
      ],
    })),
}));
