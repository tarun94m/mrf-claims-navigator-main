
import { useState } from 'react';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { Group, Text, rem, Paper, Button, Alert } from '@mantine/core';
import { IconUpload, IconX, IconFile, IconAlertCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { mrfStore } from '@/stores/MRFStore';
import { parseCSVFile } from '@/services/csvService';
import { notifications } from '@mantine/notifications';

const FileUpload = observer(() => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileUpload = async (files: FileWithPath[]) => {
    const file = files[0];
    if (!file || !file.name.endsWith('.csv')) {
      notifications.show({
        title: 'Invalid File',
        message: 'Please upload a CSV file.',
        color: 'red',
      });
      return;
    }

    mrfStore.setUploadedFile(file);
    mrfStore.setIsParsing(true);

    try {
      const result = await parseCSVFile(file);
      mrfStore.setParsedData(result.data);
      mrfStore.setValidationErrors(result.errors);

      if (result.errors.length === 0) {
        notifications.show({
          title: 'File Uploaded Successfully',
          message: `Parsed ${result.data.length} claims successfully.`,
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'File Uploaded with Warnings',
          message: `Parsed ${result.data.length} valid claims. ${result.errors.length} rows had errors.`,
          color: 'orange',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Upload Failed',
        message: 'Failed to parse the CSV file. Please check the format.',
        color: 'red',
      });
      mrfStore.setValidationErrors(['Failed to parse CSV file']);
    } finally {
      mrfStore.setIsParsing(false);
    }
  };

  const handleRemoveFile = () => {
    mrfStore.setUploadedFile(null);
    mrfStore.reset();
  };

  return (
    <Paper withBorder p="xl" className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Claims Data</h2>
          <p className="text-gray-600">Upload your CSV file containing claims data for MRF generation</p>
        </div>

        {!mrfStore.uploadedFile ? (
          <Dropzone
            onDrop={handleFileUpload}
            onReject={() => {
              notifications.show({
                title: 'File Rejected',
                message: 'Please upload a valid CSV file.',
                color: 'red',
              });
            }}
            maxSize={10 * 1024 ** 2} // 10MB
            accept={['text/csv', '.csv']}
            loading={mrfStore.isParsing}
            className={`border-2 border-dashed transition-all duration-200 ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-25'
            }`}
            onDragEnter={() => setIsDragActive(true)}
            onDragLeave={() => setIsDragActive(false)}
          >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconUpload
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div className="text-center">
                <Text size="xl" inline className="font-semibold text-gray-700">
                  Drag CSV file here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  File should not exceed 10MB
                </Text>
              </div>
            </Group>
          </Dropzone>
        ) : (
          <Paper withBorder p="md" className="bg-white">
            <Group justify="space-between">
              <Group>
                <IconFile size={20} className="text-blue-600" />
                <div>
                  <Text size="sm" className="font-semibold">{mrfStore.uploadedFile.name}</Text>
                  <Text size="xs" c="dimmed">
                    {(mrfStore.uploadedFile.size / 1024).toFixed(1)} KB
                  </Text>
                </div>
              </Group>
              <Button variant="light" color="red" size="xs" onClick={handleRemoveFile}>
                Remove
              </Button>
            </Group>
          </Paper>
        )}

        {mrfStore.validationErrors.length > 0 && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Validation Errors" color="orange">
            <div className="space-y-1">
              {mrfStore.validationErrors.slice(0, 5).map((error, index) => (
                <Text key={index} size="sm">{error}</Text>
              ))}
              {mrfStore.validationErrors.length > 5 && (
                <Text size="sm" c="dimmed">
                  ... and {mrfStore.validationErrors.length - 5} more errors
                </Text>
              )}
            </div>
          </Alert>
        )}
      </div>
    </Paper>
  );
});

export default FileUpload;
