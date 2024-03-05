import React from 'react';
import '@fontsource/roboto/400.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Root from './Root';
import Products from './Components/Products';
import Customers from './Components/Customers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Root" {...a11yProps(0)} />
          <Tab label="Products" {...a11yProps(1)} />
          <Tab label="Customers" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Root/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Products/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Customers/>
      </CustomTabPanel>
    </Box>
  );
}

function App() {
  return (
    <BasicTabs/>
  );
}

export default App;
