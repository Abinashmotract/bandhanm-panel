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
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  PersonAdd as PersonAddIcon,
  PersonOff as PersonOffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuUser, setMenuUser] = useState(null);

  const authToken = Cookies.get("token");

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, filterStatus, filterPlan]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { isActive: filterStatus === 'active' }),
        ...(filterPlan !== 'all' && { plan: filterPlan })
      });

      const response = await axios.get(`${API_BASE_URL}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data, 'usermanagerment');
      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isActive) => {
    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}`, 
        { isActive: !isActive },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess(`User ${isActive ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verificationType) => {
    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}`, 
        { [verificationType]: true },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess('User verification updated successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to update verification status');
      console.error('Error updating verification:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuUser(null);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Blocked';
  };

  const getPlanColor = (plan) => {
    const planColors = {
      'Basic': 'default',
      'Entry': 'primary',
      'Advanced': 'secondary',
      'Premium': 'warning',
      'Elite': 'error'
    };
    return planColors[plan] || 'default';
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const filteredUsers = users.filter(user => {
    if (tabValue === 0) return true; // All users
    if (tabValue === 1) return user.isActive; // Active users
    if (tabValue === 2) return !user.isActive; // Blocked users
    if (tabValue === 3) return user.isEmailVerified && user.isPhoneVerified; // Verified users
    if (tabValue === 4) return user.profileCompletion >= 80; // Complete profiles
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2f444d', fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Plan</InputLabel>
            <Select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              label="Plan"
            >
              <MenuItem value="all">All Plans</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Entry">Entry</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Elite">Elite</MenuItem>
            </Select>
          </FormControl>
        </Box>
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All Users (${users.length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Active (${users.filter(u => u.isActive).length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Blocked (${users.filter(u => !u.isActive).length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Verified (${users.filter(u => u.isEmailVerified && u.isPhoneVerified).length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Complete Profiles (${users.filter(u => u.profileCompletion >= 80).length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Profile Completion</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Verification</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={user.profileImage} 
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {user.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#000' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {user.gender} • {user.profileFor}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                        <Typography variant="body2" sx={{ color: '#000' }}>{user.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                        <Typography variant="body2" sx={{ color: '#000' }}>{user.phoneNumber}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        {user.city}, {user.state}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.membership?.plan?.name || 'Basic'} 
                      color={getPlanColor(user.membership?.plan?.name || 'Basic')}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: 'grey.300',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              width: `${user.profileCompletion || 0}%`,
                              height: '100%',
                              backgroundColor: user.profileCompletion >= 80 ? 'success.main' : 
                                             user.profileCompletion >= 50 ? 'warning.main' : 'error.main',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 35, color: '#000' }}>
                        {user.profileCompletion || 0}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}>
                        <Chip
                          icon={<EmailIcon />}
                          label="E"
                          size="small"
                          color={user.isEmailVerified ? 'success' : 'default'}
                        />
                      </Tooltip>
                      <Tooltip title={user.isPhoneVerified ? 'Phone Verified' : 'Phone Not Verified'}>
                        <Chip
                          icon={<PhoneIcon />}
                          label="P"
                          size="small"
                          color={user.isPhoneVerified ? 'success' : 'default'}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusText(user.isActive)} 
                      color={getStatusColor(user.isActive)}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewUser(user)} color="primary">
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleBlockUser(user._id, user.isActive)}
                      color={user.isActive ? 'error' : 'success'}
                    >
                      {user.isActive ? <BlockIcon /> : <UnblockIcon />}
                    </IconButton>
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={selectedUser.profileImage} sx={{ width: 60, height: 60, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{selectedUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.gender} • {selectedUser.profileFor}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2"><strong>Email:</strong> {selectedUser.email}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {selectedUser.phoneNumber}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {selectedUser.city}, {selectedUser.state}</Typography>
                <Typography variant="body2"><strong>Occupation:</strong> {selectedUser.occupation}</Typography>
                <Typography variant="body2"><strong>Education:</strong> {selectedUser.education}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>Account Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Profile Completion:</strong> {selectedUser.profileCompletion}%</Typography>
                  <Typography variant="body2"><strong>Email Verified:</strong> {selectedUser.isEmailVerified ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2"><strong>Phone Verified:</strong> {selectedUser.isPhoneVerified ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2"><strong>Account Status:</strong> {getStatusText(selectedUser.isActive)}</Typography>
                  <Typography variant="body2"><strong>Plan:</strong> {selectedUser.membership?.plan?.name || 'Basic'}</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>Actions</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleVerifyUser(selectedUser._id, 'isEmailVerified')}
                    disabled={selectedUser.isEmailVerified}
                  >
                    Verify Email
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleVerifyUser(selectedUser._id, 'isPhoneVerified')}
                    disabled={selectedUser.isPhoneVerified}
                  >
                    Verify Phone
                  </Button>
                  <Button
                    variant={selectedUser.isActive ? 'contained' : 'outlined'}
                    color={selectedUser.isActive ? 'error' : 'success'}
                    size="small"
                    onClick={() => handleBlockUser(selectedUser._id, selectedUser.isActive)}
                  >
                    {selectedUser.isActive ? 'Block User' : 'Unblock User'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewUser(menuUser);
          handleMenuClose();
        }}>
          <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleBlockUser(menuUser._id, menuUser.isActive);
          handleMenuClose();
        }}>
          <ListItemIcon>
            {menuUser?.isActive ? <BlockIcon fontSize="small" /> : <UnblockIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{menuUser?.isActive ? 'Block User' : 'Unblock User'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleVerifyUser(menuUser._id, 'isEmailVerified');
          handleMenuClose();
        }}>
          <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Verify Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleVerifyUser(menuUser._id, 'isPhoneVerified');
          handleMenuClose();
        }}>
          <ListItemIcon><PhoneIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Verify Phone</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserManagement;
