
import { Container, Title, Button, Group, Paper } from '@mantine/core';
import { IconFileText, IconUpload } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import FileUpload from '@/components/FileUpload';
import ClaimsTable from '@/components/ClaimsTable';

const Index = observer(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <Paper shadow="sm" className="bg-white/80 backdrop-blur-sm border-b">
        <Container size="xl" py="md">
          <Group justify="space-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <IconFileText size="1.5rem" className="text-white" />
              </div>
              <div>
                <Title order={2} className="text-gray-800 font-bold">
                  MRF Claims Navigator
                </Title>
                <p className="text-sm text-gray-600">Healthcare Transparency Compliance Tool</p>
              </div>
            </div>
            <Group>
              <Button
                component={Link}
                to="/public-mrf"
                variant="outline"
                leftSection={<IconFileText size="1rem" />}
              >
                View Public MRF Files
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container size="xl" py="xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <Title order={1} className="text-4xl font-bold text-gray-800 mb-4">
              Generate Machine-Readable Files
            </Title>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload claims data and generate compliant MRF files for Transparency in Coverage (TiC) regulations. 
              Streamline your healthcare data processing with our automated validation and approval workflow.
            </p>
          </div>

          {/* File Upload Section */}
          <FileUpload />

          {/* Claims Table Section */}
          <ClaimsTable />

          {/* Footer */}
          <Paper p="md" className="bg-white/60 backdrop-blur-sm text-center">
            <p className="text-sm text-gray-600">
              © 2024 MRF Claims Navigator. Built for healthcare transparency compliance.
            </p>
          </Paper>
        </div>
      </Container>
    </div>
  );
});

export default Index;
