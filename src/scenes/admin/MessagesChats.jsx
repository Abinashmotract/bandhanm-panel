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
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Send as SendIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

const MessagesChats = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [systemMessage, setSystemMessage] = useState('');
  const [systemMessageDialog, setSystemMessageDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/admin/messages`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setMessages(response.data.data.messages);
        setStats(response.data.data.stats);
      }
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    
    // Fetch conversation between users
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/messages/conversation/${message.fromUser._id}/${message.toUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setConversation(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  const handleSendSystemMessage = async () => {
    if (!systemMessage.trim()) return;
    
    try {
      const authToken = Cookies.get("token");
      await axios.post(`${API_BASE_URL}/admin/messages/system`, 
        { 
          toUser: selectedMessage?.toUser._id,
          message: systemMessage,
          type: 'system'
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess('System message sent successfully');
      setSystemMessage('');
      setSystemMessageDialog(false);
      fetchMessages();
    } catch (err) {
      setError('Failed to send system message');
      console.error('Error sending system message:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'success';
      case 'delivered': return 'info';
      case 'read': return 'primary';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'text': return 'primary';
      case 'image': return 'secondary';
      case 'system': return 'warning';
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

  const filteredMessages = messages.filter(message => {
    if (tabValue === 0) return true; // All messages
    if (tabValue === 1) return message.status === 'sent';
    if (tabValue === 2) return message.status === 'delivered';
    if (tabValue === 3) return message.status === 'read';
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2f444d', fontWeight: 'bold' }}>
          Messages & Chats
        </Typography>
        <Button
          variant="contained"
          onClick={fetchMessages}
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
                  <MessageIcon sx={{ color: '#51365F', mr: 1 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
                      {stat.count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', textTransform: 'capitalize' }}>
                      {stat._id} Messages
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
          <Tab label={`All Messages (${messages.length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Sent (${messages.filter(m => m.status === 'sent').length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Delivered (${messages.filter(m => m.status === 'delivered').length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
          <Tab label={`Read (${messages.filter(m => m.status === 'read').length})`} sx={{ color: '#000', fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>From User</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>To User</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Message</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No messages found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={message.fromUser?.profileImage}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {message.fromUser?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#000' }}>
                          {message.fromUser?.name || 'Unknown User'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={message.toUser?.profileImage}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {message.toUser?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#000' }}>
                          {message.toUser?.name || 'Unknown User'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#000',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {message.messageContent || 'No content'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={message.messageType || 'text'}
                        color={getMessageTypeColor(message.messageType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={message.status}
                        color={getStatusColor(message.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewMessage(message)} color="primary">
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Message Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#000' }}>
              Conversation Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SendIcon />}
              onClick={() => setSystemMessageDialog(true)}
              size="small"
            >
              Send System Message
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box>
              <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
                Conversation between {selectedMessage.fromUser?.name} and {selectedMessage.toUser?.name}
              </Typography>
              
              <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                <List>
                  {conversation.map((msg, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          src={msg.fromUser?.profileImage}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        >
                          {msg.fromUser?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                          {msg.fromUser?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', ml: 2 }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#000', ml: 4 }}>
                        {msg.messageContent}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Send System Message Dialog */}
      <Dialog open={systemMessageDialog} onClose={() => setSystemMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send System Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="System Message"
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSystemMessageDialog(false)}>Cancel</Button>
          <Button onClick={handleSendSystemMessage} variant="contained">
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessagesChats;
