import { Box, Stack } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";

type Project = { id: number; name: string };
type Employee = { id: number; name: string };
type Activity = {
  project: Project;
  employee: Employee;
  date: string;
  hours: number;
};

type TimeSheetProps = { activities: Activity[] };

const TimeSheet = ({ activities }: TimeSheetProps) => {
  const totalHours = useMemo(
    () => activities.reduce((total, activity) => total + activity.hours, 0),
    [activities]
  );

  const parseDate = (dateString: string) => {
    const parts = dateString.split("T")[0].split("-");
    const parsedDate = new Date(
      Number(parts[0]),
      Number(+parts[1] - 1),
      Number(parts[2])
    );
    return parsedDate.toLocaleDateString();
  };

  const columns = useMemo<MRT_ColumnDef<Activity>[]>(
    () => [
      { header: "Project", accessorKey: "project.name", enableGrouping: true },
      {
        header: "Employee",
        accessorKey: "employee.name",
        enableGrouping: true,
      },
      {
        header: "Date",
        accessorKey: "date",
        enableGrouping: true,
        Cell: ({ cell }) => <>{parseDate(cell.getValue<string>())}</>,
      },
      {
        header: "Hours",
        accessorKey: "hours",
        enableGrouping: false,
        aggregationFn: "sum",
        AggregatedCell: ({ cell, table }) => (
          <>
            Hours per{" "}
            {table.getColumn(cell.row.groupingColumnId ?? "").columnDef.header}:{" "}
            <Box sx={{ color: "success.main", fontWeight: "bold" }}>
              {cell.getValue<number>()?.toString?.()}
            </Box>
          </>
        ),
        Footer: () => (
          <Stack>
            Total Hours:
            <Box color="warning.main">{totalHours?.toString?.()}</Box>
          </Stack>
        ),
      },
    ],
    [totalHours]
  );

  const table = useMaterialReactTable({
    columns,
    data: activities,
    displayColumnDefOptions: {
      "mrt-row-expand": {
        enableResizing: true,
      },
    },
    enableColumnResizing: true,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: {
      density: "compact",
      expanded: true, //expand all groups by default
      grouping: [], //an array of columns to group by by default (can be multiple)
      pagination: { pageIndex: 0, pageSize: 20 },
      // sorting: [], //sort by state by default
    },
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    muiToolbarAlertBannerChipProps: { color: "primary" },
    muiTableContainerProps: {
      sx: {
        maxHeight: 700,
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default TimeSheet;
