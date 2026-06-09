import { useState } from 'react';
import {
  Card,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Grid,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  RestartAlt as ClearIcon,
} from '@mui/icons-material';
import { usePolicyFilters } from '../../../hooks/usePolicyFilters';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Expired', value: 'Expired' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const LOB_OPTIONS = [
  { label: 'Property', value: 'Property' },
  { label: 'Casualty', value: 'Casualty' },
  { label: 'A&H', value: 'A&H' },
  { label: 'Marine', value: 'Marine' },
];

const REGION_OPTIONS = [
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Hong Kong', value: 'Hong Kong' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Philippines', value: 'Philippines' },
];

/**
 * FilterBar Component - Material-UI Version
 * Provides filtering controls for the policy dashboard.
 */
export function FilterBar() {
  const {
    filters,
    updateSearch,
    updateStatus,
    updateLineOfBusiness,
    updateRegion,
    updateDateRange,
    clearFilters,
  } = usePolicyFilters();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const theme = useTheme();

  return (
    <Card sx={{ mb: 4, p: 3 }}>
      <Grid container spacing={3}>
        {/* Search Input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search Policies"
            placeholder="Search by policy number, holder name, or underwriter..."
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
            variant="outlined"
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                    🔍
                  </Box>
                ),
              },
            }}
          />
        </Grid>

        {/* Basic Filters */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Line of Business</InputLabel>
            <Select
              label="Line of Business"
              value={filters.lineOfBusiness}
              onChange={(e) => updateLineOfBusiness(e.target.value)}
            >
              <MenuItem value="">
                <em>All Lines</em>
              </MenuItem>
              {LOB_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              label="Region"
              value={filters.region}
              onChange={(e) => updateRegion(e.target.value)}
            >
              <MenuItem value="">
                <em>All Regions</em>
              </MenuItem>
              {REGION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Advanced Filters Toggle */}
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: 'primary.main',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </Button>
        </Grid>

        {/* Advanced Filters */}
        <Grid item xs={12}>
          <Collapse in={showAdvanced}>
            <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                📅 Effective Date Range
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    value={filters.effectiveDateFrom}
                    onChange={(e) =>
                      updateDateRange('effective', e.target.value, filters.effectiveDateTo)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="To"
                    InputLabelProps={{ shrink: true }}
                    value={filters.effectiveDateTo}
                    onChange={(e) =>
                      updateDateRange('effective', filters.effectiveDateFrom, e.target.value)
                    }
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                ⏰ Expiry Date Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    value={filters.expiryDateFrom}
                    onChange={(e) =>
                      updateDateRange('expiry', e.target.value, filters.expiryDateTo)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="To"
                    InputLabelProps={{ shrink: true }}
                    value={filters.expiryDateTo}
                    onChange={(e) =>
                      updateDateRange('expiry', filters.expiryDateFrom, e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Grid>

        {/* Clear Filters Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
