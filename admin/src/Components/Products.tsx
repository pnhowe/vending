import React from 'react';
import Box from '@mui/material/Box';
import { useQuery } from 'react-query';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { Products_Product } from './API/Vending';
import { API, useAPI } from './API';
import { parseMutationArgs } from 'react-query/types/core/utils';

type GridRowsModel =
{
  id: number;
  item: Products_Product,
  _isNew: boolean,
};

interface EditToolbarProps
{
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export default function Products()
{
  const api = useAPI();

  const [ rowModesModel, setRowModesModel ] = React.useState<GridRowModesModel>({});

  const { isLoading, isError, data } = useQuery<Record<string,Products_Product>, Error>( 'Products_Product', async () => { return await api.getProducts() } );

  if( isLoading || data === undefined )
    return (
      <Box>Loading....</Box>
    );

  if( isError )
    return (
      <Box>Error....</Box>
    );

  let rows = Object.values( data ).map( ( item: Products_Product ) => { return { id: item.id, item: item, _isNew: false }; } ) ;

  function EditToolbar( props: EditToolbarProps )
  {
    const { setRowModesModel } = props;

    const handleClick = () => {
      const id = 0;
      const newRow : GridRowsModel = { id: id, item: new Products_Product( api.vending, id ), _isNew: true };
      rows.push( newRow );
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    rows = rows.filter((row) => row.item.id !== id);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.item.id === id);
    if (editedRow!._isNew) {
      rows = rows.filter( ( row ) => row.item.id !== id );
    }
  };

  const processRowUpdate = (newRow: GridRowsModel) => {
    const updatedRow = { ...newRow, _isNew: false };
    rows = rows.map((row) => (row.item.id === newRow.item.id ? updatedRow : row));
    return updatedRow;
  };

  const handleRowModesModelChange = ( newRowModesModel: GridRowModesModel ) => {
    setRowModesModel( newRowModesModel );
  };

  const handleValueGet = ( params: GridValueGetterParams ) => {
    const { row, field } = params;
    return row.item[ field ];
  }

  const productColumns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 20, valueGetter: handleValueGet },
    { field: 'group', headerName: 'Group', width: 70, valueGetter: handleValueGet },
    { field: 'name', headerName: 'Name', width: 200, valueGetter: handleValueGet },
    { field: 'cost', headerName: 'Cost', width: 20, type: 'number', valueGetter: handleValueGet },
    { field: 'location', headerName: 'Location', width: 70, valueGetter: handleValueGet },
    { field: 'available', headerName: 'Available', width: 70, valueGetter: handleValueGet },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box>
      <DataGrid
        rows={ rows }
        columns={ productColumns }
        editMode="row"
        rowModesModel={ rowModesModel }
        onRowModesModelChange={ handleRowModesModelChange }
        onRowEditStop={ handleRowEditStop }
        processRowUpdate={ processRowUpdate }
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
      />
    </Box>
  );
}