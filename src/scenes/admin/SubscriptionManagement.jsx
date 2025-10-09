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
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

const SubscriptionManagement = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Predefined features for each plan
  const planFeatures = {
    'Basic': [
      'View 5 profiles per day',
      'Basic profile information',
      'Create your profile',
      'Basic search filters',
      'Limited messaging'
    ],
    'Entry': [
      'View 20 profiles',
      'Send 5 interests',
      'Profile shortlisting (5 profiles)',
      'Messaging (5 profiles)',
      'Contact views (5 profiles)',
      'Advanced search filters',
      'Priority customer support'
    ],
    'Advanced': [
      'View 50 profiles',
      'Send 50 interests',
      'Daily recommendations',
      'Advanced search filters',
      'Horoscope matching',
      'See who viewed your profile',
      'Priority support',
      'Profile boost'
    ],
    'Premium': [
      'Unlimited profile views',
      'Unlimited interests',
      'Unlimited messaging',
      'Video/voice calling',
      'Priority support',
      'Profile boost',
      'Advanced AI matching',
      'Exclusive events access'
    ],
    'Elite': [
      'All Premium features',
      'Elite member badge',
      'Dedicated relationship manager',
      'Exclusive elite features',
      'Advanced AI matching',
      'Personalized matchmaking',
      'VIP customer support',
      'Exclusive networking events'
    ]
  };

  const [planForm, setPlanForm] = useState({
    name: '',
    price: 0,
    duration: 'monthly',
    planType: 'paid',
    profileViews: 0,
    interests: 0,
    shortlists: 0,
    contactViews: 0,
    features: [],
    description: '',
    isPopular: false,
    isActive: true
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/membership/plans`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      setSubscriptionPlans(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch subscription plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      price: 0,
      duration: 'monthly',
      planType: 'paid',
      profileViews: 0,
      interests: 0,
      shortlists: 0,
      contactViews: 0,
      features: [],
      description: '',
      isPopular: false,
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      planType: plan.planType,
      profileViews: plan.profileViews,
      interests: plan.interests,
      shortlists: plan.shortlists,
      contactViews: plan.contactViews,
      features: [...plan.features],
      description: plan.description,
      isPopular: plan.isPopular,
      isActive: plan.isActive
    });
    setDialogOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      setLoading(true);
      const authToken = Cookies.get("token");
      const planData = {
        ...planForm,
        profileViews: planForm.profileViews === -1 ? -1 : planForm.profileViews,
        interests: planForm.interests === -1 ? -1 : planForm.interests,
        shortlists: planForm.shortlists === -1 ? -1 : planForm.shortlists,
        contactViews: planForm.contactViews === -1 ? -1 : planForm.contactViews
      };

      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };

      if (editingPlan) {
        await axios.put(`${API_BASE_URL}/membership/plans/${editingPlan._id}`, planData, { headers });
        setSuccess('Plan updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/membership/plans`, planData, { headers });
        setSuccess('Plan created successfully');
      }

      setDialogOpen(false);
      fetchSubscriptionPlans();
    } catch (err) {
      setError('Failed to save plan');
      console.error('Error saving plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        setLoading(true);
        const authToken = Cookies.get("token");
        await axios.delete(`${API_BASE_URL}/membership/plans/${planId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('Plan deleted successfully');
        fetchSubscriptionPlans();
      } catch (err) {
        setError('Failed to delete plan');
        console.error('Error deleting plan:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePlanStatus = async (planId, isActive) => {
    try {
      setLoading(true);
      const authToken = Cookies.get("token");
      await axios.patch(`${API_BASE_URL}/membership/plans/${planId}`, 
        { isActive }, 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess(`Plan ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchSubscriptionPlans();
    } catch (err) {
      setError('Failed to update plan status');
      console.error('Error updating plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== index)
    });
  };

  // Handle plan name change and update features accordingly
  const handlePlanNameChange = (planName) => {
    const defaultFeatures = planFeatures[planName] || [];
    setPlanForm({
      ...planForm,
      name: planName,
      features: defaultFeatures
    });
  };

  // Handle feature checkbox change
  const handleFeatureChange = (feature, checked) => {
    if (checked) {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, feature]
      });
    } else {
      setPlanForm({
        ...planForm,
        features: planForm.features.filter(f => f !== feature)
      });
    }
  };

  // Select all features for the current plan
  const selectAllFeatures = () => {
    const allFeatures = planFeatures[planForm.name] || [];
    setPlanForm({
      ...planForm,
      features: allFeatures
    });
  };

  // Deselect all features
  const deselectAllFeatures = () => {
    setPlanForm({
      ...planForm,
      features: []
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getPlanTypeColor = (type) => {
    switch (type) {
      case 'free': return 'info';
      case 'paid': return 'primary';
      default: return 'default';
    }
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2f444d', fontWeight: 'bold' }}>
          Subscription Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePlan}
          sx={{
            background: 'linear-gradient(135deg, #51365F 0%, #ad1457 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)',
            },
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(216, 27, 96, 0.3)',
          }}
        >
          Create New Plan
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Plans" sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label="Active Plans" sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label="Free Plans" sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label="Paid Plans" sx={{ color: '#000', fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Plan Name</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Features</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Popular</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionPlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#000' }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {plan.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" sx={{ color: plan.price === 0 ? '#4caf50' : '#51365F' }}>
                      {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={plan.duration} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.planType} 
                      color={getPlanTypeColor(plan.planType)}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      {plan.features.length} features
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.isActive ? 'Active' : 'Inactive'} 
                      color={getStatusColor(plan.isActive ? 'active' : 'inactive')}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {plan.isPopular && (
                      <Chip 
                        label="Popular" 
                        color="warning" 
                        size="small" 
                        icon={<CheckIcon />}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditPlan(plan)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleTogglePlanStatus(plan._id, !plan.isActive)}
                      color={plan.isActive ? 'error' : 'success'}
                    >
                      {plan.isActive ? <CancelIcon /> : <CheckIcon />}
                    </IconButton>
                    <IconButton onClick={() => handleDeletePlan(plan._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Plan Name</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Features</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionPlans.filter(plan => plan.isActive).map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#000' }}>
                      {plan.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" sx={{ color: plan.price === 0 ? '#4caf50' : '#51365F' }}>
                      {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={plan.duration} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.planType} 
                      color={getPlanTypeColor(plan.planType)}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      {plan.features.length} features
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditPlan(plan)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionPlans.filter(plan => plan.planType === 'free').map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={plan.duration} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      {plan.features.length} features
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.isActive ? 'Active' : 'Inactive'} 
                      color={getStatusColor(plan.isActive ? 'active' : 'inactive')}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditPlan(plan)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionPlans.filter(plan => plan.planType === 'paid').map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      ₹{plan.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={plan.duration} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      {plan.features.length} features
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.isActive ? 'Active' : 'Inactive'} 
                      color={getStatusColor(plan.isActive ? 'active' : 'inactive')}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditPlan(plan)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Create/Edit Plan Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plan Name"
                value={planForm.name}
                onChange={(e) => handlePlanNameChange(e.target.value)}
                select
              >
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Entry">Entry</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Elite">Elite</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={planForm.duration}
                  onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plan Type</InputLabel>
                <Select
                  value={planForm.planType}
                  onChange={(e) => setPlanForm({ ...planForm, planType: e.target.value })}
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profile Views (-1 for unlimited)"
                type="number"
                value={planForm.profileViews}
                onChange={(e) => setPlanForm({ ...planForm, profileViews: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interests (-1 for unlimited)"
                type="number"
                value={planForm.interests}
                onChange={(e) => setPlanForm({ ...planForm, interests: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Shortlists (-1 for unlimited)"
                type="number"
                value={planForm.shortlists}
                onChange={(e) => setPlanForm({ ...planForm, shortlists: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Views (-1 for unlimited)"
                type="number"
                value={planForm.contactViews}
                onChange={(e) => setPlanForm({ ...planForm, contactViews: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#000', fontWeight: 'bold' }}>
                  Features for {planForm.name || 'Selected Plan'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={selectAllFeatures}
                    disabled={!planForm.name}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={deselectAllFeatures}
                    disabled={planForm.features.length === 0}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Deselect All
                  </Button>
                </Box>
              </Box>
              <FormGroup>
                <Grid container spacing={1}>
                  {planFeatures[planForm.name]?.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={planForm.features.includes(feature)}
                            onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#000' }}>
                            {feature}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
              {planForm.features.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#000' }}>
                    Selected Features ({planForm.features.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {planForm.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        onDelete={() => removeFeature(index)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={planForm.isPopular}
                    onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                  />
                }
                label="Mark as Popular"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={planForm.isActive}
                    onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePlan} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingPlan ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionManagement;
