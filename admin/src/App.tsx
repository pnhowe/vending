import React from 'react';
import '@fontsource/roboto/400.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Root from './Root';
import { useQuery } from 'react-query';
import { API, useAPI } from './Components/API';
import { Products_ProductGroup, Customers_CustomerGroup } from './Components/API/Vending';
import CustomerGroups from './Components/CustomerGroups';
import Customers from './Components/Customers';
import ProductGroups from './Components/ProductGroups';
import Products from './Components/Products';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`app-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {

  };
}

function AppTabs() {
  const api = useAPI();

  const [ value, setValue ] = React.useState(0);
  const [ customerGroups, setCustomerGroups ] = React.useState<Record<number,Customers_CustomerGroup>>( {} );
  const [ productGroups, setProductGroups ] = React.useState<Record<number,Products_ProductGroup>>( {} );

  const { isSuccess: isSuccess_cg, data: data_cg } = useQuery<Record<string,Customers_CustomerGroup>, Error>( 'App_Customers_CustomerGroups', async () => { return await api.getCustomerGroups() } );

  React.useEffect( () => {
    let groups: Record<number,Customers_CustomerGroup> = {};
    if( !isSuccess_cg )
    {
      return;
    }

    for( let k in data_cg )
    {
      const item = data_cg[k];
      groups[item.id] = item;
      setCustomerGroups( groups );
    }
  }, [ isSuccess_cg ] );

  const { isSuccess: isSuccess_pg, data: data_pg } = useQuery<Record<string,Products_ProductGroup>, Error>( 'App_Products_ProductGroups', async () => { return await api.getProductGroups() } );

  React.useEffect( () => {
    let groups: Record<number,Products_ProductGroup> = {};
    if( !isSuccess_pg )
    {
      return;
    }

    for( let k in data_pg )
    {
      const item = data_pg[k];
      groups[item.id] = item;
      setProductGroups( groups );
    }
  }, [ isSuccess_pg ] );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Home" id="app-tab-0" />
          <Tab label="Product Groups" id="app-tab-1" />
          <Tab label="Products" id="app-tab-2" />
          <Tab label="Customer Groups" id="app-tab-3" />
          <Tab label="Customers" id="app-tab-4" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Root/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProductGroups/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Products groups={ productGroups }/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CustomerGroups/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Customers groups={ customerGroups }/>
      </TabPanel>
    </Box>
  );
}

function App() {
  return (
    <AppTabs/>
  );
}

export default App;
