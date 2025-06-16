
import { useEffect } from 'react';
import { Container, Title, Paper, Group, Badge, Button, Text, Card, Grid } from '@mantine/core';
import { IconDownload, IconCalendar, IconFileText, IconArrowLeft, IconBuilding } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { mrfStore } from '@/stores/MRFStore';
import { fetchMRFFiles } from '@/services/apiService';

const PublicMRF = observer(() => {
  useEffect(() => {
    const loadMRFFiles = async () => {
      mrfStore.setIsLoadingFiles(true);
      try {
        const files = await fetchMRFFiles();
        mrfStore.setMRFFiles(files);
      } catch (error) {
        console.error('Error loading MRF files:', error);
      } finally {
        mrfStore.setIsLoadingFiles(false);
      }
    };

    loadMRFFiles();
  }, []);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                  Public MRF Files
                </Title>
                <p className="text-sm text-gray-600">Machine-Readable Files for Healthcare Transparency</p>
              </div>
            </div>
            <Button
              component={Link}
              to="/"
              variant="outline"
              leftSection={<IconArrowLeft size="1rem" />}
            >
              Back to Upload
            </Button>
          </Group>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container size="xl" py="xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <Title order={1} className="text-4xl font-bold text-gray-800 mb-4">
              Healthcare Price Transparency Files
            </Title>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access machine-readable files containing healthcare pricing information as required by 
              the Transparency in Coverage regulations. All files are updated monthly and contain 
              negotiated rates and allowed amounts.
            </p>
          </div>

          {/* Statistics */}
          <Paper withBorder p="xl" className="bg-white/60 backdrop-blur-sm">
            <Group justify="center" gap="xl">
              <div className="text-center">
                <Text size="2xl" className="font-bold text-blue-600">
                  {mrfStore.mrfFiles.length}
                </Text>
                <Text size="sm" c="dimmed">Available Files</Text>
              </div>
              <div className="text-center">
                <Text size="2xl" className="font-bold text-green-600">
                  {mrfStore.mrfFiles.reduce((sum, file) => sum + file.recordCount, 0).toLocaleString()}
                </Text>
                <Text size="sm" c="dimmed">Total Records</Text>
              </div>
              <div className="text-center">
                <Text size="2xl" className="font-bold text-purple-600">
                  {formatFileSize(mrfStore.mrfFiles.reduce((sum, file) => sum + file.size, 0))}
                </Text>
                <Text size="sm" c="dimmed">Total Size</Text>
              </div>
            </Group>
          </Paper>

          {/* MRF Files Grid */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Title order={2} className="text-2xl font-bold text-gray-800">
                Available MRF Files
              </Title>
              <Badge size="lg" variant="light" color="blue">
                Last Updated: {formatDate(new Date().toISOString())}
              </Badge>
            </div>

            {mrfStore.isLoadingFiles ? (
              <Paper withBorder p="xl" className="text-center">
                <div className="flex justify-center items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <Text>Loading MRF files...</Text>
                </div>
              </Paper>
            ) : mrfStore.mrfFiles.length === 0 ? (
              <Paper withBorder p="xl" className="text-center">
                <IconFileText size="3rem" className="mx-auto text-gray-400 mb-4" />
                <Title order={3} className="text-gray-600 mb-2">No MRF Files Available</Title>
                <Text c="dimmed">MRF files will appear here once generated.</Text>
              </Paper>
            ) : (
              <Grid>
                {mrfStore.mrfFiles.map((file) => (
                  <Grid.Col key={file.id} span={{ base: 12, md: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
                      <div className="space-y-4">
                        <Group justify="space-between">
                          <div className="flex items-center gap-2">
                            <IconBuilding size="1rem" className="text-blue-600" />
                            <Text size="sm" className="font-semibold text-blue-600">
                              {file.customer}
                            </Text>
                          </div>
                          <Badge variant="light" color="green">
                            Active
                          </Badge>
                        </Group>

                        <div>
                          <Text className="font-semibold text-gray-800 mb-2">
                            {file.filename}
                          </Text>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <IconCalendar size="0.9rem" />
                              <span>Created: {formatDate(file.createdAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{file.recordCount.toLocaleString()} records</span>
                              <span>{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          fullWidth
                          variant="light"
                          leftSection={<IconDownload size="1rem" />}
                          onClick={() => {
                            // Simulate download
                            const link = document.createElement('a');
                            link.href = `/api/download/${file.id}`;
                            link.download = file.filename;
                            link.click();
                          }}
                        >
                          Download File
                        </Button>
                      </div>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </div>

          {/* Footer */}
          <Paper p="md" className="bg-white/60 backdrop-blur-sm text-center">
            <p className="text-sm text-gray-600">
              These files are provided in accordance with the Transparency in Coverage Final Rule. 
              Files are updated monthly and contain the most recent pricing information available.
            </p>
          </Paper>
        </div>
      </Container>
    </div>
  );
});

export default PublicMRF;
