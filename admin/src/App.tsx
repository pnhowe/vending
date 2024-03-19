import React from 'react';
import '@fontsource/roboto/400.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Root from './Root';
import { useQuery } from 'react-query';
import { API, useAPI } from './Components/API';
import { Products_ProductGroup } from './Components/API/Vending';
import Products, { ProductProps } from './Components/Products';
import Customers from './Components/Customers';
import ProductGroups from './Components/ProductGroups';

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
  const [ productGroups, setProductGroups ] = React.useState<Record<number,Products_ProductGroup>>( {} );

  const { isSuccess, data } = useQuery<Record<string,Products_ProductGroup>, Error>( 'App_Products_ProductGroups', async () => { return await api.getProductGroups() } );

  React.useEffect( () => {
    let groups: Record<number,Products_ProductGroup> = {};
    if( !isSuccess )
    {
      return;
    }

    for( let k in data )
    {
      const item = data[k];
      groups[item.id] = item;
      setProductGroups( groups );
    }
  }, [ isSuccess ] );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Home" id="app-tab-0" />
          <Tab label="Products" id="app-tab-1" />
          <Tab label="Customers" id="app-tab-2" />
          <Tab label="Product Groups" id="app-tab-3" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Root/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Products groups={ productGroups }/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Customers/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ProductGroups/>
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
