import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  Chip,
  Box,
  Button,
  Alert,
  Skeleton as MuiSkeleton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { usePolicies, useFlagForReview } from '../hooks/usePolicies';
import { usePolicyFilters } from '../../../hooks/usePolicyFilters';

const statusColorMap = {
  Active: { color: 'success', icon: CheckCircleIcon },
  Expired: { color: 'error', icon: WarningIcon },
  Pending: { color: 'warning', icon: AccessTimeIcon },
  Cancelled: { color: 'default', icon: CancelIcon },
};

/**
 * PolicyTable Component - Material-UI Version
 * Displays paginated policy data with multi-select and bulk actions.
 */
export function PolicyTable() {
  const { filters, updatePage, updatePageSize } = usePolicyFilters();
  const { data, isLoading, isError, error } = usePolicies(filters);
  const flagMutation = useFlagForReview(filters);
  const theme = useTheme();
  
  const [selectedIds, setSelectedIds] = useState(new Set());

  const policies = data?.data || [];
  const totalCount = data?.total || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page || 1;

  const allSelected = useMemo(() => {
    if (policies.length === 0) return false;
    return policies.every((p) => selectedIds.has(p.id));
  }, [policies, selectedIds]);

  const toggleSelectAll = () => {
    if (allSelected) {
      const newSelected = new Set(selectedIds);
      policies.forEach((p) => newSelected.delete(p.id));
      setSelectedIds(newSelected);
    } else {
      const newSelected = new Set(selectedIds);
      policies.forEach((p) => newSelected.add(p.id));
      setSelectedIds(newSelected);
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleFlagForReview = async () => {
    if (selectedIds.size === 0) return;
    try {
      await flagMutation.mutateAsync(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Error flagging policies:', err);
    }
  };

  const handleChangePage = (event, newPage) => {
    updatePage(newPage + 1);
  };

  // Loading state
  if (isLoading && policies.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : theme.palette.grey[100] 
              }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <TableCell key={i}>
                    <MuiSkeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} aria-label="loading">
                  {Array.from({ length: 9 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <MuiSkeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert
        severity="error"
        icon={<WarningIcon />}
        sx={{
          mt: 2,
          '& .MuiAlert-action': {
            ml: 2,
          },
        }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        }
      >
        {error?.message || 'An unexpected error occurred while loading policies.'}
      </Alert>
    );
  }

  // Empty state
  if (policies.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <h3 style={{ marginTop: 0 }}>No Policies Found</h3>
        <p style={{ color: theme.palette.text.secondary }}>
          Try adjusting your filters or search criteria.
        </p>
      </Paper>
    );
  }

  // Table render
  return (
    <Box>
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'info.lighter',
            borderColor: 'info.light',
          }}
        >
          <Box>
            <strong>{selectedIds.size}</strong> {selectedIds.size === 1 ? 'policy' : 'policies'} selected
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={flagMutation.isPending ? <CircularProgress size={20} /> : <FlagIcon />}
            onClick={handleFlagForReview}
            disabled={flagMutation.isPending}
          >
            {flagMutation.isPending ? 'Flagging...' : 'Flag for Review'}
          </Button>
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : theme.palette.grey[100] 
            }}>
              <TableCell padding="checkbox" width="5%">
                <Checkbox
                  indeterminate={selectedIds.size > 0 && !allSelected}
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  inputProps={{ 'aria-label': 'select all policies' }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Policy #</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Policyholder</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Line of Business</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Region</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Premium
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Expiry Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Flag
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy, index) => {
              const statusConfig = statusColorMap[policy.status] || statusColorMap.Cancelled;
              const StatusIcon = statusConfig.icon;

              return (
                <TableRow
                  key={policy.id}
                  selected={selectedIds.has(policy.id)}
                  hover
                  sx={{
                    backgroundColor: selectedIds.has(policy.id)
                      ? theme.palette.action.selected
                      : index % 2 === 0
                      ? theme.palette.background.paper
                      : theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : theme.palette.grey[50],
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.has(policy.id)}
                      onChange={() => toggleSelect(policy.id)}
                      inputProps={{
                        'aria-label': `select policy ${policy.policyNumber}`,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {policy.policyNumber}
                  </TableCell>
                  <TableCell>{policy.policyholderName}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<StatusIcon />}
                      label={policy.status}
                      color={statusConfig.color}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{policy.lineOfBusiness}</TableCell>
                  <TableCell>{policy.region}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {policy.premiumAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    <span style={{ fontSize: '0.85em', marginLeft: '4px' }}>
                      {policy.currency}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(policy.expiryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {policy.flaggedForReview && (
                      <Chip
                        icon={<FlagIcon />}
                        label="Review"
                        color="error"
                        size="small"
                        variant="filled"
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalCount}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(event) => {
          const newSize = parseInt(event.target.value, 10);
          updatePageSize(newSize);
        }}
        rowsPerPageOptions={[10, 20, 25, 50]}
      />
    </Box>
  );
}
