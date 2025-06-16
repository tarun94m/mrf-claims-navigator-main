
# MRF Claims Navigator - Application Design

## Overview

The MRF Claims Navigator is a comprehensive React application designed to facilitate the generation of Machine-Readable Files (MRFs) for healthcare transparency compliance. The application allows users to upload CSV claims data, validate and approve claims, and generate compliant JSON MRF files.

## Architecture

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── FileUpload.tsx   # CSV file upload with drag & drop
│   └── ClaimsTable.tsx  # AG Grid table for claims data
├── pages/               # Page-level components
│   ├── Index.tsx        # Main upload and processing page
│   ├── PublicMRF.tsx    # Public MRF files display
│   └── NotFound.tsx     # 404 error page
├── stores/              # MobX state management
│   └── MRFStore.ts      # Centralized application state
├── services/            # API and utility services
│   ├── csvService.ts    # CSV parsing with PapaParse
│   └── apiService.ts    # Backend API interactions
└── App.tsx              # Main application with routing
```

### Technology Stack

- **React 18** with TypeScript for type safety
- **Mantine UI** for consistent, accessible components
- **Tailwind CSS** for utility-first styling
- **MobX** for reactive state management
- **AG Grid** for advanced data table functionality
- **PapaParse** for robust CSV parsing
- **Zod** for runtime data validation
- **React Router** for client-side navigation

## State Management

### MobX Store Structure

The application uses a single MobX store (`MRFStore`) that manages:

```typescript
class MRFStore {
  // File upload state
  uploadedFile: File | null
  parsedData: ClaimData[]
  validationErrors: string[]
  isUploading: boolean
  isParsing: boolean

  // Claims approval state
  selectedClaims: Set<number>
  approvedClaims: ClaimData[]
  isSubmitting: boolean

  // MRF files state
  mrfFiles: MRFFile[]
  isLoadingFiles: boolean
}
```

### Data Validation

Claims data is validated using Zod schemas:

```typescript
const ClaimSchema = z.object({
  provider_name: z.string().min(1),
  provider_tin: z.string().optional(),
  procedure_code: z.string().min(1),
  procedure_description: z.string().min(1),
  place_of_service: z.string().min(1),
  billing_class: z.string().min(1),
  allowed_amount: z.number().positive(),
  billed_amount: z.number().positive(),
  service_date: z.string().min(1),
});
```

## Component Architecture

### FileUpload Component

- **Purpose**: Handle CSV file upload with drag & drop functionality
- **Features**:
  - Mantine Dropzone with file type validation
  - Real-time CSV parsing with PapaParse
  - Error handling and user feedback
  - Progress indicators during processing

### ClaimsTable Component

- **Purpose**: Display and manage claims data in a tabular format
- **Features**:
  - AG Grid with sorting, filtering, and selection
  - Batch operations (select all, deselect all)
  - Customer name input for MRF generation
  - Real-time selection counter

### Page Structure

#### Index Page
- Main application page with file upload and claims management
- Responsive layout with gradient backgrounds
- Integration of FileUpload and ClaimsTable components

#### PublicMRF Page
- Public-facing page displaying available MRF files
- Grid layout for file cards with download functionality
- Statistics dashboard showing file counts and sizes

## API Integration

### Backend Endpoints

```typescript
// Submit claims for MRF generation
POST /api/generate-mrf
{
  claims: ClaimData[],
  customer: string
}

// Fetch available MRF files
GET /api/mrf-files
Response: MRFFile[]

// Download MRF file
GET /api/download/:fileId
```

### Error Handling

- Network errors are caught and displayed as notifications
- Validation errors are shown inline with detailed messages
- Loading states provide user feedback during async operations

## Styling and Design

### Design System

- **Color Palette**: Professional healthcare blues and whites
- **Typography**: Inter font for readability
- **Spacing**: Consistent spacing using Tailwind utilities
- **Components**: Mantine components for accessibility and consistency

### Responsive Design

- Mobile-first approach with responsive breakpoints
- Grid layouts that adapt to screen sizes
- Touch-friendly interface elements

### Visual Hierarchy

- Clear information architecture with proper heading levels
- Visual cues for interactive elements
- Status indicators and progress feedback

## Data Flow

### Upload Process

1. User drags/selects CSV file
2. FileUpload component validates file type
3. PapaParse processes CSV data
4. Zod validates each row against schema
5. Valid data is stored in MobX store
6. Validation errors are displayed to user

### Approval Process

1. Claims data is displayed in AG Grid table
2. User selects claims for approval
3. Customer name is entered
4. Selected claims are submitted to backend API
5. MRF generation process begins
6. User receives confirmation notification

### File Management

1. Backend generates JSON MRF files
2. Files are stored on server filesystem
3. Public API endpoint lists available files
4. Users can download files directly

## Security Considerations

- File type validation prevents malicious uploads
- Input sanitization using Zod schemas
- CORS configuration for API endpoints
- Error messages don't expose sensitive information

## Performance Optimizations

- Lazy loading of AG Grid components
- Efficient CSV parsing with streaming
- MobX reactive updates minimize re-renders
- Optimized bundle size with tree shaking

## Future Enhancements

- Authentication system for secure access
- Real-time file processing status updates
- Advanced filtering and search capabilities
- Bulk file operations
- Export capabilities for processed data
- Audit logging for compliance tracking

## Deployment Architecture

- Frontend: Static React build served via CDN
- Backend: Node.js/Express API server
- File Storage: Local filesystem with backup strategy
- Monitoring: Error tracking and performance metrics

This architecture provides a scalable, maintainable foundation for healthcare data processing while ensuring compliance with transparency regulations.
