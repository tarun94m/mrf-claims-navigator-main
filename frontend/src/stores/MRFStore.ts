
import { makeAutoObservable } from 'mobx';
import { z } from 'zod';

// Zod schema for claims data validation
export const ClaimSchema = z.object({
  provider_name: z.string().min(1, "Provider name is required"),
  provider_tin: z.string().optional(),
  procedure_code: z.string().min(1, "Procedure code is required"),
  procedure_description: z.string().min(1, "Procedure description is required"),
  place_of_service: z.string().min(1, "Place of service is required"),
  billing_class: z.string().min(1, "Billing class is required"),
  allowed_amount: z.number().positive("Allowed amount must be positive"),
  billed_amount: z.number().positive("Billed amount must be positive"),
  service_date: z.string().min(1, "Service date is required"),
});

export type ClaimData = z.infer<typeof ClaimSchema>;

export interface MRFFile {
  id: string;
  filename: string;
  customer: string;
  createdAt: string;
  size: number;
  recordCount: number;
}

class MRFStore {
  // File upload state
  uploadedFile: File | null = null;
  parsedData: ClaimData[] = [];
  validationErrors: string[] = [];
  isUploading = false;
  isParsing = false;

  // Claims approval state
  selectedClaims: Set<number> = new Set();
  approvedClaims: ClaimData[] = [];
  isSubmitting = false;

  // MRF files state
  mrfFiles: MRFFile[] = [];
  isLoadingFiles = false;

  constructor() {
    makeAutoObservable(this);
  }

  // File upload actions
  setUploadedFile(file: File | null) {
    this.uploadedFile = file;
    if (!file) {
      this.parsedData = [];
      this.validationErrors = [];
    }
  }

  setIsUploading(loading: boolean) {
    this.isUploading = loading;
  }

  setIsParsing(parsing: boolean) {
    this.isParsing = parsing;
  }

  setParsedData(data: ClaimData[]) {
    this.parsedData = data;
  }

  setValidationErrors(errors: string[]) {
    this.validationErrors = errors;
  }

  // Claims selection actions
  toggleClaimSelection(index: number) {
    if (this.selectedClaims.has(index)) {
      this.selectedClaims.delete(index);
    } else {
      this.selectedClaims.add(index);
    }
  }

  selectAllClaims() {
    this.selectedClaims.clear();
    this.parsedData.forEach((_, index) => {
      this.selectedClaims.add(index);
    });
  }

  deselectAllClaims() {
    this.selectedClaims.clear();
  }

  // Approval actions
  approveClaims() {
    this.approvedClaims = this.parsedData.filter((_, index) => 
      this.selectedClaims.has(index)
    );
  }

  setIsSubmitting(submitting: boolean) {
    this.isSubmitting = submitting;
  }

  // MRF files actions
  setMRFFiles(files: MRFFile[]) {
    this.mrfFiles = files;
  }

  setIsLoadingFiles(loading: boolean) {
    this.isLoadingFiles = loading;
  }

  // Reset store
  reset() {
    this.uploadedFile = null;
    this.parsedData = [];
    this.validationErrors = [];
    this.selectedClaims.clear();
    this.approvedClaims = [];
    this.isUploading = false;
    this.isParsing = false;
    this.isSubmitting = false;
  }
}

export const mrfStore = new MRFStore();
