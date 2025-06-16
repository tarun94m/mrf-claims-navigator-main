
import Papa from 'papaparse';
import { ClaimSchema, ClaimData } from '@/stores/MRFStore';

export interface ParseResult {
  data: ClaimData[];
  errors: string[];
}

export const parseCSVFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim().replace(/\s+/g, '_'),
      complete: (results) => {
        const validData: ClaimData[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          try {
            // Transform string numbers to actual numbers
            const transformedRow = {
              ...row,
              allowed_amount: parseFloat(row.allowed_amount || '0'),
              billed_amount: parseFloat(row.billed_amount || '0'),
            };

            const validatedData = ClaimSchema.parse(transformedRow);
            validData.push(validatedData);
          } catch (error: any) {
            errors.push(`Row ${index + 2}: ${error.errors?.map((e: any) => e.message).join(', ') || 'Invalid data'}`);
          }
        });

        resolve({ data: validData, errors });
      },
      error: (error) => {
        resolve({ data: [], errors: [`Parse error: ${error.message}`] });
      }
    });
  });
};
