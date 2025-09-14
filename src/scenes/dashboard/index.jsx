import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
  CircularProgress,
  Avatar,
  Chip,
  IconButton,
  Divider
} from "@mui/material";
import {
  Header,
} from "../../components";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import Cookies from "js-cookie";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CelebrationIcon from '@mui/icons-material/Celebration';

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

function Dashboard() {
  const [overviewData, setOverviewData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [rawRecentActivity, setRawRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchOverViewDataOfDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/overview`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        setOverviewData(response.data.data);
        setRawRecentActivity(response.data.data.recentActivity);
        const updated = response.data.data.recentActivity.map((item) => ({
          ...item,
          time: timeAgo(item.timeRaw),
        }));
        setRecentActivity(updated);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchOverViewDataOfDashboard();
    }
  }, [authToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = rawRecentActivity.map((item) => ({
        ...item,
        time: timeAgo(item.timeRaw),
      }));
      setRecentActivity(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, [rawRecentActivity]);

  // Mock data for marriage platform
  const overviewStats = [
    {
      title: "Total Matches",
      value: overviewData.totalMatches || 128,
      color: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      icon: <FavoriteIcon sx={{ color: "#d23669" }} />,
      trend: "+12% this month"
    },
    {
      title: "Active Users",
      value: overviewData.activeUsers || 542,
      color: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      icon: <PeopleIcon sx={{ color: "#6a3093" }} />,
      trend: "+8% this month"
    },
    {
      title: "Upcoming Events",
      value: overviewData.upcomingEvents || 23,
      color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      icon: <EventIcon sx={{ color: "#ff8c00" }} />,
      trend: "5 new this week"
    },
    {
      title: "Messages Exchanged",
      value: overviewData.messages || 1247,
      color: "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
      icon: <ChatIcon sx={{ color: "#1e6fa3" }} />,
      trend: "+23% this month"
    },
    {
      title: "Successful Unions",
      value: overviewData.successfulUnions || 42,
      color: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      icon: <CelebrationIcon sx={{ color: "#00b09b" }} />,
      trend: "3 this month"
    }
  ];

  // Sample activities for marriage platform
  const sampleActivities = [
    {
      id: 1,
      user: "Priya S.",
      action: "created a new profile",
      time: "2 min ago",
      avatar: "/static/images/avatar/1.jpg"
    },
    {
      id: 2,
      user: "Rahul M.",
      action: "sent a connection request",
      time: "15 min ago",
      avatar: "/static/images/avatar/2.jpg"
    },
    {
      id: 3,
      user: "Admin",
      action: "verified a new profile",
      time: "1 hr ago",
      avatar: "/static/images/avatar/3.jpg"
    },
    {
      id: 4,
      user: "Neha K.",
      action: "updated preferences",
      time: "3 hrs ago",
      avatar: "/static/images/avatar/4.jpg"
    },
    {
      id: 5,
      user: "System",
      action: "scheduled maintenance",
      time: "5 hrs ago",
      avatar: "/static/images/avatar/5.jpg"
    }
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", p: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Header title="MARRIAGE DASHBOARD" subtitle="Welcome to your marriage matching platform" />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {overviewStats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.title}>
                <Card 
                  sx={{ 
                    background: stat.color, 
                    borderRadius: 3, 
                    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
                    overflow: "visible",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 20px 0 rgba(0,0,0,0.15)"
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.3)',
                      mb: 1.5
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d2d2d', mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontWeight: 600, textAlign: 'center', mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Chip 
                      label={stat.trend} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.7)', 
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recent Activity
                    </Typography>
                    <IconButton size="small">
                      <NotificationsIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box>
                    {sampleActivities.map((activity) => (
                      <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                        <Avatar src={activity.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {activity.user} <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>{activity.action}</Typography>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Quick Stats
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {[
                    { label: "Profiles Completed", value: "92%", color: "#00b09b" },
                    { label: "Response Rate", value: "78%", color: "#5a79c5" },
                    { label: "Premium Members", value: "35%", color: "#f57170" },
                    { label: "Verified Profiles", value: "87%", color: "#9c27b0" }
                  ].map((stat, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                      <Chip 
                        label={stat.value} 
                        size="small" 
                        sx={{ 
                          backgroundColor: stat.color, 
                          color: 'white', 
                          fontWeight: 600,
                          minWidth: 50
                        }} 
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default Dashboard;