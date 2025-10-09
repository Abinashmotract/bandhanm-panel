import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Favorite as LikeIcon,
  Star as InterestIcon,
  Bookmark as ShortlistIcon
} from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

const MatchesConnections = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/admin/matches`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setMatches(response.data.data.matches);
        setStats(response.data.data.stats);
      }
    } catch (err) {
      setError('Failed to fetch matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (matchId, status) => {
    try {
      const authToken = Cookies.get("token");
      await axios.patch(`${API_BASE_URL}/admin/matches/${matchId}/status`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess('Match status updated successfully');
      fetchMatches();
    } catch (err) {
      setError('Failed to update match status');
      console.error('Error updating match:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'like': return <LikeIcon sx={{ color: '#e91e63' }} />;
      case 'interest': return <InterestIcon sx={{ color: '#ff9800' }} />;
      case 'shortlist': return <ShortlistIcon sx={{ color: '#4caf50' }} />;
      default: return <LikeIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'like': return 'error';
      case 'interest': return 'warning';
      case 'shortlist': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const filteredMatches = matches.filter(match => {
    if (tabValue === 0) return true; // All matches
    if (tabValue === 1) return match.type === 'like';
    if (tabValue === 2) return match.type === 'interest';
    if (tabValue === 3) return match.type === 'shortlist';
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2f444d', fontWeight: 'bold' }}>
          Matches & Connections
        </Typography>
        <Button
          variant="contained"
          onClick={fetchMatches}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #51365F 0%, #ad1457 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)',
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getTypeIcon(stat._id)}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
                      {stat.count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', textTransform: 'capitalize' }}>
                      {stat._id}s
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All Matches (${matches.length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Likes (${matches.filter(m => m.type === 'like').length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Interests (${matches.filter(m => m.type === 'interest').length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Shortlists (${matches.filter(m => m.type === 'shortlist').length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>From User</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>To User</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredMatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No matches found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMatches.map((match) => (
                  <TableRow key={match._id}>
                    <TableCell>
                      <Chip
                        icon={getTypeIcon(match.type)}
                        label={match.type}
                        color={getTypeColor(match.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={match.fromUser?.profileImage}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {match.fromUser?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#000' }}>
                          {match.fromUser?.name || 'Unknown User'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={match.toUser?.profileImage}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {match.toUser?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#000' }}>
                          {match.toUser?.name || 'Unknown User'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={match.status}
                        color={getStatusColor(match.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        {new Date(match.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewMatch(match)} color="primary">
                        <ViewIcon />
                      </IconButton>
                      {match.status === 'active' && (
                        <IconButton
                          onClick={() => handleUpdateStatus(match._id, 'rejected')}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Match Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Match Details</DialogTitle>
        <DialogContent>
          {selectedMatch && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ color: '#000', mb: 1 }}>
                    From User
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={selectedMatch.fromUser?.profileImage}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {selectedMatch.fromUser?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#000' }}>
                        {selectedMatch.fromUser?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {selectedMatch.fromUser?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ color: '#000', mb: 1 }}>
                    To User
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={selectedMatch.toUser?.profileImage}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {selectedMatch.toUser?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#000' }}>
                        {selectedMatch.toUser?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {selectedMatch.toUser?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#000', mb: 1 }}>
                    Match Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={getTypeIcon(selectedMatch.type)}
                      label={`Type: ${selectedMatch.type}`}
                      color={getTypeColor(selectedMatch.type)}
                    />
                    <Chip
                      label={`Status: ${selectedMatch.status}`}
                      color={getStatusColor(selectedMatch.status)}
                    />
                    <Chip
                      label={`Date: ${new Date(selectedMatch.createdAt).toLocaleDateString()}`}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatchesConnections;
