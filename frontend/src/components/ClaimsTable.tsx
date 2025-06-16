
import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Button, Group, Paper, Text, Badge, TextInput } from '@mantine/core';
import { IconCheck, IconX, IconSearch } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { mrfStore } from '@/stores/MRFStore';
import { submitClaimsForMRF } from '@/services/apiService';
import { notifications } from '@mantine/notifications';

const ClaimsTable = observer(() => {
  const [customerName, setCustomerName] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Select',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left'
    },
    {
      headerName: 'Provider Name',
      field: 'provider_name',
      sortable: true,
      filter: true,
      width: 200
    },
    {
      headerName: 'Provider TIN',
      field: 'provider_tin',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'Procedure Code',
      field: 'procedure_code',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      headerName: 'Procedure Description',
      field: 'procedure_description',
      sortable: true,
      filter: true,
      width: 250
    },
    {
      headerName: 'Place of Service',
      field: 'place_of_service',
      sortable: true,
      filter: true,
      width: 140
    },
    {
      headerName: 'Billing Class',
      field: 'billing_class',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'Allowed Amount',
      field: 'allowed_amount',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 140,
      valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`
    },
    {
      headerName: 'Billed Amount',
      field: 'billed_amount',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 140,
      valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`
    },
    {
      headerName: 'Service Date',
      field: 'service_date',
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 120
    }
  ], []);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    mrfStore.selectedClaims.clear();
    selectedRows.forEach((row) => {
      const index = mrfStore.parsedData.indexOf(row);
      if (index !== -1) {
        mrfStore.selectedClaims.add(index);
      }
    });
  };

  const handleSelectAll = () => {
    gridApi?.selectAll();
  };

  const handleDeselectAll = () => {
    gridApi?.deselectAll();
  };

  const handleSubmitClaims = async () => {
    if (mrfStore.selectedClaims.size === 0) {
      notifications.show({
        title: 'No Claims Selected',
        message: 'Please select at least one claim to submit.',
        color: 'orange',
      });
      return;
    }

    if (!customerName.trim()) {
      notifications.show({
        title: 'Customer Name Required',
        message: 'Please enter a customer name.',
        color: 'orange',
      });
      return;
    }

    mrfStore.setIsSubmitting(true);
    
    try {
      const selectedClaimsData = mrfStore.parsedData.filter((_, index) => 
        mrfStore.selectedClaims.has(index)
      );

      await submitClaimsForMRF(selectedClaimsData, customerName);
      
      notifications.show({
        title: 'MRF Generation Started',
        message: `Processing ${selectedClaimsData.length} claims for ${customerName}`,
        color: 'green',
      });

      // Reset form
      setCustomerName('');
      handleDeselectAll();
      
    } catch (error) {
      notifications.show({
        title: 'Submission Failed',
        message: 'Failed to submit claims for MRF generation.',
        color: 'red',
      });
    } finally {
      mrfStore.setIsSubmitting(false);
    }
  };

  if (mrfStore.parsedData.length === 0) {
    return null;
  }

  return (
    <Paper withBorder p="xl" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Claims Data Review</h3>
          <p className="text-gray-600">Review and approve claims for MRF generation</p>
        </div>
        <Badge size="lg" variant="light" color="blue">
          {mrfStore.parsedData.length} Claims Loaded
        </Badge>
      </div>

      <div className="space-y-4">
        <Group>
          <TextInput
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            leftSection={<IconSearch size="1rem" />}
            style={{ flex: 1 }}
            required
          />
        </Group>

        <Group>
          <Button variant="outline" onClick={handleSelectAll} size="sm">
            <IconCheck size="1rem" className="mr-1" />
            Select All
          </Button>
          <Button variant="outline" onClick={handleDeselectAll} size="sm">
            <IconX size="1rem" className="mr-1" />
            Deselect All
          </Button>
          <div className="flex-1" />
          <Text size="sm" c="dimmed">
            {mrfStore.selectedClaims.size} of {mrfStore.parsedData.length} claims selected
          </Text>
        </Group>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={mrfStore.parsedData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmitClaims}
          loading={mrfStore.isSubmitting}
          disabled={mrfStore.selectedClaims.size === 0 || !customerName.trim()}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Generate MRF Files ({mrfStore.selectedClaims.size} claims)
        </Button>
      </div>
    </Paper>
  );
});

export default ClaimsTable;
