import { FC, useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardApi, postResizeApi } from "../api/dashboard";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

export type OptimizeButtonProps = {
  onClick: VoidFunction;
  loading: boolean;
  disabled: boolean;
  updated?: "triggered" | "error";
};
const OptimizeButton: FC<OptimizeButtonProps> = ({
  onClick,
  loading,
  disabled,
  updated,
}) => {
  const buttonText = useMemo(() => {
    if (loading) return "In progress...";
    return "Optimize";
  }, [loading, disabled, updated]);

  if (updated) {
    return (
      <Box maxWidth="150px">
        <Typography
          fontSize="small"
          color="green"
          textTransform="uppercase"
          fontWeight="bold"
        >
          {updated}
        </Typography>
      </Box>
    );
  }

  return (
    <strong>
      <Button
        disabled={loading || disabled || updated}
        variant="contained"
        color="primary"
        size="small"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </strong>
  );
};

export type AggregateCostItemProps = {
  title: string;
  value: string;
  optimized?: boolean;
};

export const AggregateCostItem: FC<AggregateCostItemProps> = ({
  title,
  value,
  optimized,
}) => {
  return (
    <Grid
      item
      container
      flexDirection="column"
      sx={{
        background: optimized ? "#4caf50" : "#f3e5f5",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px",
        textAlign: "right",
        color: optimized ? "white" : "black",
      }}
      gap="10px"
      alignItems="flex-end"
      flexBasis="15%"
      justifyContent="space-between"
    >
      <Grid item>
        <Typography fontWeight="bold">{title}</Typography>
      </Grid>
      <Grid item>
        <Typography fontSize="20px">{value}</Typography>
      </Grid>
    </Grid>
  );
};

export type AggregateCostsProps = {
  costs: Array<{
    title: string;
    value: string;
    optimized?: boolean;
  }>;
};

export const AggregateCosts: FC<AggregateCostsProps> = ({ costs }) => {
  return (
    <Grid
      container
      justifyContent="flex-start"
      sx={{ marginBottom: "50px" }}
      flexDirection="row"
    >
      {costs.map((cost) => (
        <AggregateCostItem
          key={cost.title}
          title={cost.title}
          value={cost.value}
          optimized={cost.optimized}
        />
      ))}
    </Grid>
  );
};

export const Dashboard: FC = () => {
  const queryClient = useQueryClient();
  const [resizeLoadingState, setResizeLoadingState] = useState<
    Record<string, boolean>
  >({});
  const [resizeUpdatedState, setResizeUpdatedState] = useState<
    Record<string, "triggered" | "error">
  >({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
  });

  const costs = useMemo(() => {
    if (!data) {
      return [];
    }
    return [
      {
        title: "Monthly cost",
        value: `₹ ${Math.round(data?.monthly_cost)}`,
      },
      {
        title: "Monthly cost after optimization",
        value: `₹ ${Math.round(data?.monthly_cost_after_optimisation)}`,
        optimized: true,
      },
      {
        title: "Yearly cost",
        value: `₹ ${Math.round(data?.yearly_cost)}`,
      },
      {
        title: "Yearly cost after optimization",
        value: `₹ ${Math.round(data?.yearly_cost_after_optimisation)}`,
        optimized: true,
      },
      {
        title: "Possible monthly saving",
        value: `₹ ${Math.round(data?.monthly_saving)}`,
        optimized: true,
      },
      {
        title: "Possible yearly saving",
        value: `₹ ${Math.round(data?.yearly_saving)}`,
        optimized: true,
      },
      {
        title: "Possible Savings %",
        value: `${Math.round(data?.saving_percent * 100)} %`,
        optimized: true,
      },
    ];
  }, [data]);

  const { mutate: resizeResource } = useMutation({
    mutationFn: async (resource: string) => {
      setResizeLoadingState((prevState) => ({
        ...prevState,
        [resource]: true,
      }));
      return postResizeApi(resource);
    },
    onSettled: (_, __, resource) => {
      setResizeLoadingState((prevState) => ({
        ...prevState,
        [resource]: false,
      }));
    },

    onSuccess: (_, resource) => {
      setResizeUpdatedState((prevState) => ({
        ...prevState,
        [resource]: "triggered",
      }));
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (_, resource) => {
      setResizeUpdatedState((prevState) => ({
        ...prevState,
        [resource]: "error",
      }));
    },
  });

  const onOptimizeButtonClick = useCallback(
    (resource: string) => {
      resizeResource(resource);
    },
    [resizeResource]
  );

  const refresh = useCallback(() => {
    setResizeUpdatedState({});
    refetch();
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Resource", width: 150 },
      { field: "vm_size", headerName: "VM Size", width: 150 },
      {
        field: "cpu_usage",
        headerName: "CPU usage",
        width: 150,
        valueFormatter: ({value}) => {
          return parseFloat(value).toFixed(8)
        },
      },
      { field: "memory_usage", headerName: "Memory usage", width: 150 },
      {
        field: "current_cost_per_week",
        headerName: "Cost Per Week",
        width: 150,
      },
      {
        field: "savings_cost_per_week",
        headerName: "Optimized Cost",
        width: 150,
      },
      { field: "suggested_size", headerName: "Suggestion", width: 150 },
      {
        field: "optimize",
        headerName: "Optimize",
        width: 150,
        renderCell: ({ row: { name, vm_size, suggested_size } }) => (
          <OptimizeButton
            onClick={() => onOptimizeButtonClick(name)}
            loading={resizeLoadingState[name]}
            disabled={vm_size === suggested_size}
            updated={resizeUpdatedState[name]}
          />
        ),
        sortable: false,
      },
    ],
    [onOptimizeButtonClick, resizeLoadingState, resizeUpdatedState]
  );

  if (isLoading) {
    return (
      <Box
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
          width: "100%",
          marginTop: "74px",
        }}
      >
        <CircularProgress size="200px" />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: 3, width: "100%", marginTop: "74px" }}>
      <Grid container justifyContent="center">
        <Grid item container flexDirection="column" maxWidth="1300px">
          <AggregateCosts costs={costs} />
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            paddingX="10px"
            color="white"
            sx={{ backgroundColor: "#42a5f5" }}
          >
            <Typography>Resources</Typography>
            <IconButton onClick={refresh} aria-label="refresh">
              <Refresh sx={{ fill: "white" }} />
            </IconButton>
          </Grid>
          <DataGrid rows={data.suggestions} columns={columns} autoHeight />
        </Grid>
      </Grid>
    </Box>
  );
};
