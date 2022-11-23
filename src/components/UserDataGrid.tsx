import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import debounce from "lodash/debounce";

import { Box, TextField, Link, Typography } from "@mui/material";
import { DataGrid, GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import StarIcon from "@mui/icons-material/Star";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import { USER_REPOSITORIES } from "../query/repository";
import { RepositoryData, Repository } from "../types/types";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Box data-testid="dataRow">{params.value}</Box>
    ),
  },
  {
    field: "url",
    headerName: "URL",
    width: 300,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Link href={params.value}>{params.value}</Link>
    ),
  },
  {
    field: "stargazerCount",
    headerName: "Stars",
    width: 80,
    renderCell: (params: GridRenderCellParams<string>) => (
      <>
        <StarIcon />
        <Typography sx={{ fontSize: "1.5rem" }} ml={1}>
          {params.value}
        </Typography>
      </>
    ),
  },
  {
    field: "forkCount",
    headerName: "Forks",
    width: 80,
    renderCell: (params: GridRenderCellParams<string>) => (
      <>
        <RestaurantIcon />
        <Typography sx={{ fontSize: "1.5rem" }} ml={1}>
          {params.value}
        </Typography>
      </>
    ),
  },
];

const UserDataGrid: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [rows, setRows] = useState<Repository[]>([]);
  const [username, setUsername] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [cursors, setCursors] = useState<string[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const { loading, error, data, fetchMore } = useQuery<RepositoryData>(
    USER_REPOSITORIES,
    {
      variables: { login: username, first: 5, after: endCursor },
    }
  );

  const onUsernameChange = React.useCallback((newValue: string) => {
    setPage(0);
    setTotalCount(0);
    setCursors([]);
    setRows([]);
    setEndCursor(null);
    setUsername(newValue);
  }, []);

  const debouncedChange = debounce(onUsernameChange, 500);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      debouncedChange(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (data) {
      setTotalCount(data.user.repositories.totalCount);
      if (
        cursors.length === page &&
        data.user.repositories.pageInfo.endCursor
      ) {
        setRows([...rows, ...data.user.repositories.nodes]);
        setCursors([...cursors, data.user.repositories.pageInfo.endCursor]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!cursors.length || !page) {
      setEndCursor(null);
    } else {
      setEndCursor(cursors[page - 1]);
    }
  }, [page]);

  return (
    <Box sx={{ margin: "auto", width: "50%", height: 400 }}>
      <TextField
        label="User Name"
        variant="outlined"
        value={value}
        onChange={handleChange}
        inputProps={{ "data-testid": "nameInput" }}
        sx={{ width: "100%", mb: 2 }}
      />
      <DataGrid
        page={page}
        onPageChange={(newPage: number) => !loading && setPage(newPage)}
        rowCount={totalCount}
        // loading={true}
        loading={loading && page >= cursors.length}
        pageSize={5}
        rowsPerPageOptions={[5]}
        pagination
        columns={columns}
        rows={rows}
      />
    </Box>
  );
};

export default UserDataGrid;
