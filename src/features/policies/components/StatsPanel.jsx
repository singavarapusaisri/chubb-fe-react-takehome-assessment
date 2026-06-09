import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Skeleton as MuiSkeleton,
  useTheme,
} from '@mui/material';
import {
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Archive as ArchiveIcon,
  // Warning as WarningIcon, // Not used directly in StatCard anymore
} from '@mui/icons-material';
import { usePolicySummary } from '../hooks/usePolicies';

/**
 * StatsPanel Component - Material-UI Version
 * Displays key summary statistics about the policy portfolio.
 */
export function StatsPanel() {
  const { data: summary, isLoading } = usePolicySummary();
  const theme = useTheme();

  const StatCard = ({ label, value, icon: Icon, subtext, color }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
          borderColor: `${color}60`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', mb: 1.5 }}
            >
              {label}
            </Typography>

            {isLoading ? (
              <MuiSkeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography
                sx={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {typeof value === 'number'
                  ? value.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  : value}
              </Typography>
            )}

            {subtext && (
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  mt: 0.5,
                }}
              >
                {subtext}
              </Typography>
            )}
          </Box>

          {Icon && (
            <Box
              sx={{
                ml: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                opacity: 0.3,
              }}
            >
              <Icon sx={{ fontSize: '3rem' }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (!summary && isLoading) {
    return (
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Card>
              <CardContent>
                <MuiSkeleton variant="text" height={20} sx={{ mb: 1 }} />
                <MuiSkeleton variant="text" height={40} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!summary) {
    return null;
  }

  const statusCounts = summary.statusCounts || {};
  const lobTotals = summary.lobTotals || {};
  const expiringIn30Days = summary.expiringIn30Days || 0;
  const totalPolicies = summary.totalPolicies || 0;

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          label="Active Policies"
          value={statusCounts.Active || 0}
          subtext={`${((statusCounts.Active / totalPolicies) * 100).toFixed(1)}% of total`}
          icon={TrendingUpIcon}
          color="#10B981"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          label="Expiring in 30 Days"
          value={expiringIn30Days}
          icon={ScheduleIcon}
          color="#F59E0B"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          label="Expired Policies"
          value={statusCounts.Expired || 0}
          subtext={`${((statusCounts.Expired / totalPolicies) * 100).toFixed(1)}% of total`}
          icon={ArchiveIcon}
          color="#EF4444"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          label="Pending Policies"
          value={statusCounts.Pending || 0}
          subtext={`${((statusCounts.Pending / totalPolicies) * 100).toFixed(1)}% of total`}
          icon={HourglassEmptyIcon}
          color="#F59E0B"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        {/* Combined Premium Tile */}
        <StatCard
          label="Total Premium (P&C)"
          value={
            lobTotals.Property || lobTotals.Casualty
              ? `$${((lobTotals.Property || 0) + (lobTotals.Casualty || 0) / 1000000).toFixed(1)}M`
              : '$0'
          }
          subtext={
            `Property: $${((lobTotals.Property || 0) / 1000000).toFixed(1)}M, ` +
            `Casualty: $${((lobTotals.Casualty || 0) / 1000000).toFixed(1)}M`
          }
          icon={AttachMoneyIcon}
          color="#A855F7"
        />
      </Grid>
    </Grid>
  );
}
