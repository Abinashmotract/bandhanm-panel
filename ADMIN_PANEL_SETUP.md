# BandhanM Admin Panel Setup Guide

## Overview
The BandhanM Admin Panel has been completely updated to focus on matrimonial website management with full user control, subscription management, and comprehensive admin features.

## 🎯 Key Features

### 1. **User Management**
- **Complete User List**: View all registered users in a comprehensive table
- **User Details**: Detailed user profiles with personal information
- **Block/Unblock Users**: Full control over user account status
- **Verification Management**: Verify email and phone numbers
- **Profile Completion Tracking**: Monitor user profile completion percentage
- **Search & Filter**: Advanced filtering by status, plan, and search terms
- **Bulk Actions**: Manage multiple users at once

### 2. **Subscription Management**
- **Plan Creation**: Create new subscription plans with custom features
- **Plan Editing**: Modify existing plans and pricing
- **Plan Status Control**: Activate/deactivate plans
- **Analytics**: Track subscription performance and revenue
- **Feature Management**: Configure plan features and limits

### 3. **Dashboard Analytics**
- **Real-time Statistics**: Live user and activity metrics
- **Match Statistics**: Track successful matches and connections
- **User Growth**: Monitor new registrations and active users
- **Revenue Tracking**: Subscription revenue and conversion rates
- **Activity Feed**: Recent user activities and system events

### 4. **Admin Navigation**
- **User Management**: Complete user control and management
- **Subscription Management**: Plan creation and management
- **Matches & Connections**: Track user interactions (Coming Soon)
- **Messages & Chats**: Monitor user communications (Coming Soon)
- **Verification Center**: Profile verification management (Coming Soon)
- **Reports & Analytics**: Detailed reporting and insights (Coming Soon)
- **Success Stories**: Manage success stories (Coming Soon)
- **Notifications**: System notifications management (Coming Soon)
- **System Settings**: Platform configuration (Coming Soon)

## 🚀 Setup Instructions

### 1. **Backend Setup**
```bash
cd /home/motract/Documents/abinash/bandhnam-backend
npm install
npm start
```

### 2. **Admin Panel Setup**
```bash
cd /home/motract/Documents/abinash/bandhnam-panel
npm install
npm run dev
```

### 3. **Admin Login**
- **URL**: `http://localhost:3000` (or your configured port)
- **Email**: `bandhnam@example.com`
- **Password**: `Bandhnam@123`

## 📊 Admin Panel Features

### **Dashboard Overview**
- **Total Matches**: Number of successful matches
- **Active Users**: Currently active users
- **Upcoming Events**: New user registrations
- **Messages Exchanged**: User communication activity
- **Successful Unions**: Completed marriages through the platform

### **User Management Table**
| Column | Description |
|--------|-------------|
| **User** | Name, gender, profile type, avatar |
| **Contact** | Email and phone number |
| **Location** | City and state |
| **Plan** | Current subscription plan |
| **Profile Completion** | Completion percentage with progress bar |
| **Verification** | Email and phone verification status |
| **Status** | Active/Blocked status |
| **Actions** | View, block/unblock, more options |

### **User Actions Available**
- **View Details**: Complete user profile information
- **Block/Unblock**: Control user account access
- **Verify Email**: Mark email as verified
- **Verify Phone**: Mark phone as verified
- **Edit Profile**: Modify user information (Coming Soon)

### **Subscription Plan Management**
- **Create Plans**: Add new subscription tiers
- **Edit Plans**: Modify existing plans
- **Plan Features**: Configure features and limits
- **Pricing**: Set plan prices and durations
- **Status Control**: Activate/deactivate plans
- **Analytics**: Track plan performance

## 🔧 API Endpoints

### **User Management**
- `GET /api/admin/users` - Get all users with pagination
- `GET /api/admin/users/:userId` - Get specific user details
- `PATCH /api/admin/users/:userId` - Update user (block, verify, etc.)
- `DELETE /api/admin/users/:userId` - Delete user (soft delete)

### **Subscription Management**
- `GET /api/membership/plans` - Get all subscription plans
- `POST /api/membership/plans` - Create new plan
- `PUT /api/membership/plans/:planId` - Update plan
- `DELETE /api/membership/plans/:planId` - Delete plan
- `PATCH /api/membership/plans/:planId` - Toggle plan status

### **Dashboard & Analytics**
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/analytics` - Get detailed analytics
- `GET /api/admin/reports` - Get user reports
- `POST /api/admin/notifications` - Send system notifications

## 🎨 User Interface Features

### **Responsive Design**
- Mobile-friendly interface
- Tablet and desktop optimized
- Touch-friendly controls

### **Advanced Filtering**
- Search by name, email, or phone
- Filter by account status
- Filter by subscription plan
- Filter by verification status

### **Real-time Updates**
- Live statistics updates
- Real-time user activity feed
- Instant status changes

### **Data Visualization**
- Progress bars for profile completion
- Color-coded status indicators
- Interactive charts and graphs

## 🔒 Security Features

### **Admin Authentication**
- JWT-based authentication
- Secure admin login
- Session management

### **Access Control**
- Role-based permissions
- Admin-only access to sensitive features
- Secure API endpoints

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📈 Analytics & Reporting

### **User Analytics**
- Total registered users
- Active vs inactive users
- Profile completion rates
- Verification statistics

### **Subscription Analytics**
- Plan distribution
- Revenue tracking
- Conversion rates
- Popular plans

### **Platform Metrics**
- Daily active users
- Monthly growth
- User engagement
- Success rates

## 🚀 Future Enhancements

### **Planned Features**
1. **Matches & Connections Management**
   - Track user interactions
   - Monitor match success rates
   - Manage connection requests

2. **Message & Chat Monitoring**
   - View user conversations
   - Moderate inappropriate content
   - Track communication patterns

3. **Advanced Analytics**
   - Detailed reporting dashboard
   - Custom report generation
   - Data export capabilities

4. **Success Stories Management**
   - Add/edit success stories
   - Photo management
   - Story approval workflow

5. **System Settings**
   - Platform configuration
   - Feature toggles
   - Maintenance mode

## 🛠️ Troubleshooting

### **Common Issues**

1. **Login Issues**
   - Verify admin credentials
   - Check JWT token validity
   - Clear browser cache

2. **API Connection Issues**
   - Verify backend server is running
   - Check API base URL configuration
   - Verify CORS settings

3. **Data Loading Issues**
   - Check database connection
   - Verify API endpoints
   - Check network connectivity

### **Support**
- Check browser console for errors
- Verify all environment variables
- Ensure all dependencies are installed
- Check server logs for detailed error messages

## 📝 Admin Guidelines

### **User Management Best Practices**
1. **Blocking Users**: Only block users for serious violations
2. **Verification**: Verify users promptly to improve platform trust
3. **Profile Completion**: Encourage users to complete their profiles
4. **Communication**: Respond to user reports and issues quickly

### **Subscription Management**
1. **Plan Pricing**: Set competitive and fair pricing
2. **Feature Limits**: Ensure limits are reasonable and clear
3. **Plan Updates**: Communicate changes to users in advance
4. **Analytics**: Regularly review plan performance

## 🎉 Conclusion

The BandhanM Admin Panel now provides comprehensive control over the matrimonial platform with:
- Complete user management capabilities
- Advanced subscription plan management
- Real-time analytics and reporting
- Secure admin authentication
- Responsive and user-friendly interface

The admin panel is ready for production use and provides all necessary tools to effectively manage the BandhanM matrimonial platform.
