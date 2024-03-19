import React from 'react';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from 'react-query';
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
  GridValueSetterParams,
} from '@mui/x-data-grid';
import { Customers_Customer } from './API/Vending';
import { useAPI } from './API';


type GridRowsModel =
{
  id: GridRowId;
  item: Customers_Customer,
  isNew: boolean,
};

interface EditToolbarProps
{
  handleAddClick: () => void,
}

function EditToolbar( props: EditToolbarProps )
{
  const { handleAddClick } = props;

  const handleClick = () => {
    handleAddClick();
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={ handleClick }>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function Customers()
{
  const api = useAPI();
  const queryClient = useQueryClient();

  const [ rows, setRows ] = React.useState<GridRowsModel[]>( [] );
  const [ rowModes, setRowModes ] = React.useState<GridRowModesModel>( {} );

  const { isLoading, isError, isSuccess, data } = useQuery<Record<string,Customers_Customer>, Error>( 'Customers_Customer', async () => { return await api.getCustomers() } );

  React.useEffect( () => {
    let rows: GridRowsModel[] = [];
    const rowModes: GridRowModesModel = {};
    if( !isSuccess )
    {
      return;
    }

    for( let k in data )
    {
      const item = data[k];
      rows = [ ...rows, { id: item.id, item: item, isNew: false } ];
      rowModes[ data[k].id ] = { mode: GridRowModes.View };
    }

    setRows( rows );
    setRowModes( rowModes );
  }, [ isSuccess, data ] );

  const processRowUpdate = React.useCallback(
    async( newRow: GridRowsModel ) => {
      const updatedRow = { ...newRow, isNew: false };
      var rc;

      if( newRow.isNew )
        rc = newRow.item._create();
      else
        rc = newRow.item._save();

      try
      {
        await rc;
        queryClient.invalidateQueries( 'Customers_Customer' );
      }
      catch( msg )
      {
        alert( `Error saving: ${JSON.stringify(msg)}` );
        throw msg;
      }
      return updatedRow;
    }, [],
  );

  if( isLoading || data === undefined )
    return (
      <Box>Loading....</Box>
    );

  if( isError )
    return (
      <Box>Error....</Box>
    );

  const handleRowEditStop: GridEventListener<'rowEditStop'> = ( params, event ) => {
    if ( params.reason === GridRowEditStopReasons.rowFocusOut )
    {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = ( id: GridRowId ) => () => {
    setRowModes( { ...rowModes, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' } } );
  };

  const handleSaveClick = ( id: GridRowId ) => () => {
    setRowModes( { ...rowModes, [id]: { mode: GridRowModes.View } } );
  };

  const handleDeleteClick = ( id: GridRowId ) => () => {
    const row = rows.filter( ( row ) => row.item.id === id )[0];
    row.item._delete();
    queryClient.invalidateQueries( 'Customers_Customer' );
  };

  const handleCancelClick = ( id: GridRowId ) => () => {
    setRowModes( { ...rowModes, [id]: { mode: GridRowModes.View, ignoreModifications: true } } );

    const editedRow = rows.find( ( row ) => row.item.id === id );
    if ( editedRow!.isNew )
    {
      setRows( rows.filter( ( row ) => row.item.id !== id ) );
    }
  };

  const handleAddClick = () => {
    const id = 0;
    setRows( [ ...rows, { id: id, item: new Customers_Customer( api.vending, id ), isNew: true } ] );
    setRowModes( { ...rowModes, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' } } );
  };

  const handleRowModesModelChange = ( rowModes: GridRowModesModel ) => {
    setRowModes( rowModes );
  };

  const handleValueGet = ( params: GridValueGetterParams ) => {
    const { row, field } = params;
    return row.item[ field ];
  };

  const handleValueSet = ( params: GridValueSetterParams, field: string ) => {
    const { row, value } = params;
    row.item[ field ] = value;
    return row;
  };

  const customerColumns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 20 },
    { field: 'name', headerName: 'Name', width: 200, editable: true, valueGetter: handleValueGet, valueSetter: (parms) => handleValueSet( parms, 'name' ) },
    { field: 'ballance', headerName: 'Ballance', width: 100, type: 'number', editable: false },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
         const isInEditMode = rowModes[id]?.mode === GridRowModes.Edit;
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
    <div>
      <DataGrid
        rows={ rows }
        columns={ customerColumns }
        editMode="row"
        rowModesModel={ rowModes }
        onRowModesModelChange={ handleRowModesModelChange }
        onRowEditStop={ handleRowEditStop }
        processRowUpdate={ processRowUpdate }
        rowSelection={ false }
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { handleAddClick },
        }}
      />
    </div>
  );
}