import React, {FC, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {getDashboard} from "../api/dashboard";
import MenuIcon from '@mui/icons-material/Menu';
import {DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender} from "@mui/x-data-grid";
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem, ListItemButton, ListItemText,
    Toolbar,
    Typography
} from "@mui/material";

const optimizeButton = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => {
                    alert(`You have clicked this resource ${params.row.resource}`)
                }}>
                Optimise
            </Button>
        </strong>
    )
}
const columns: GridColDef[] = [
    {field: 'name', headerName: 'Resource', width: 150},
    {field: 'vm_size', headerName: 'VM Size', width: 150},
    {field: 'cpu_usage', headerName: 'Average CPU %', width: 150},
    {field: 'memory_usage', headerName: 'Average memory %', width: 150},
    {field: 'current_cost_per_week', headerName: 'Cost Per Week', width: 150},
    {field: 'suggested_size', headerName: 'Suggestion', width: 150},
    {
        field: 'optimize',
        headerName: 'Optimize',
        width: 150,
        renderCell: (params) => optimizeButton(params),
        sortable: false
    },
];

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

export const Dashboard: FC = (props: Props) => {
    const {data} = useQuery({queryKey: ['dashboard'], queryFn: getDashboard})
    const rows = useMemo(() => data?.data || [], [data])
    const drawerWidth = 240;
    const navItems = ['Dashboard', 'About'];
    const appName = "Automatic Cloud Resizing Tool"

    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                {appName}
            </Typography>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{textAlign: 'center'}}>
                            <ListItemText primary={item}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                    >
                        {appName}
                    </Typography>
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        {navItems.map((item) => (
                            <Button key={item} sx={{color: '#fff'}}>
                                {item}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{p: 3, width: '100%', marginTop: '74px'}}>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Box><Typography>Resources</Typography></Box>
                        <DataGrid rows={rows} columns={columns} autoHeight sx={{width: '1100px', flexGrow: 0}}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}