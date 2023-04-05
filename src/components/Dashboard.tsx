import { FC, useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDashboardApi, postResizeApi } from "../api/dashboard";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";

export type OptimizeButtonProps = {
  onClick: VoidFunction;
  loading: boolean;
  disabled: boolean;
  updated: boolean;
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
    <Typography color="green">Triggered</Typography>;
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

export const Dashboard: FC = () => {
  const [resizeLoadingState, setResizeLoadingState] = useState<
    Record<string, boolean>
  >({});
  const [resizeUpdatedState, setResizeUpdatedState] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
  });

  const { mutate: resizeResource } = useMutation({
    mutationFn: async (resource: string) => {
      setResizeLoadingState((prevState) => ({
        ...prevState,
        [resource]: true,
      }));
      return new Promise((resolve) => setTimeout(resolve, 5000));
      // return postResizeApi(resource);
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
        [resource]: true,
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
      { field: "cpu_usage", headerName: "Average CPU %", width: 150 },
      { field: "memory_usage", headerName: "Average memory %", width: 150 },
      {
        field: "current_cost_per_week",
        headerName: "Cost Per Week",
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
    [onOptimizeButtonClick, resizeLoadingState]
  );

  return (
    <Box component="main" sx={{ p: 3, width: "100%", marginTop: "74px" }}>
      <Grid container justifyContent="center">
        <Grid item container flexDirection="column" maxWidth="800px">
          <Grid item container justifyContent="space-between" alignItems="center">
            <Typography>Resources</Typography>
            <IconButton onClick={refresh} aria-label="refresh">
              <Refresh />
            </IconButton>
          </Grid>
        </Grid>
        {!isLoading && data && (
          <DataGrid
            rows={data}
            columns={columns}
            autoHeight
            sx={{ width: "1100px", flexGrow: 0 }}
          />
        )}
      </Grid>
    </Box>
  );
};
