import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  TextField, 
  Typography, 
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import TodayIcon from '@mui/icons-material/Today';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TagIcon from '@mui/icons-material/Tag';
import LaptopIcon from '@mui/icons-material/Laptop';
import './calendar.scss';

// Helper function to get days in a month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the day of week for the first day of the month
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Helper function to check if a date is in the past
const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Get dates for next month preview
const getNextMonthDates = (year, month, daysInMonth, firstDayOfMonth) => {
  const totalCells = 42; // 6 rows of 7 days
  const filledCells = firstDayOfMonth + daysInMonth;
  const nextMonthDays = totalCells - filledCells;
  
  return Array.from({ length: nextMonthDays }, (_, i) => i + 1);
};

const PostingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [postText, setPostText] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editPostIndex, setEditPostIndex] = useState(null);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Calculate days in current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Format date range for display (e.g., "Dec 1, 2024 - Jan 1, 2025")
  const getDateRangeDisplay = () => {
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 1);
    
    const formatDate = (date) => {
      const monthAbbr = date.toLocaleString('default', { month: 'short' });
      return `${monthAbbr} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open modal for creating a post
  const handleOpenModal = (date = null) => {
    // If no date is provided (Create Post button) use current date
    const dateToUse = date || new Date();
    
    // Check if the date is in the past
    if (isDateInPast(dateToUse)) {
      return; // Don't open modal for past dates
    }
    
    setSelectedDate(dateToUse);
    setPostText('');
    setFrequency('once');
    setIsEditing(false);
    setEditPostIndex(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setPostText('');
    setIsEditing(false);
    setEditPostIndex(null);
  };

  // Handle saving a post
  const handleSavePost = () => {
    if (!postText.trim() || !selectedDate) return;
    
    // Double-check the selected date is not in the past
    if (isDateInPast(selectedDate)) {
      return;
    }
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    // If we're editing an existing post
    if (isEditing && editPostIndex !== null) {
      setPosts(prevPosts => {
        const updatedPosts = { ...prevPosts };
        const postsList = [...updatedPosts[dateKey]];
        postsList[editPostIndex] = postText;
        updatedPosts[dateKey] = postsList;
        return updatedPosts;
      });
    } else {
      // Handle different frequency options for new posts
      if (frequency === 'once') {
        setPosts(prevPosts => ({
          ...prevPosts,
          [dateKey]: [...(prevPosts[dateKey] || []), postText]
        }));
      } else if (frequency === 'weekly') {
        const newPosts = { ...posts };
        let currentPostDate = new Date(selectedDate);
        
        // Add weekly posts for the next 4 weeks
        for (let i = 0; i < 4; i++) {
          const dateStr = currentPostDate.toISOString().split('T')[0];
          newPosts[dateStr] = [...(newPosts[dateStr] || []), postText];
          currentPostDate.setDate(currentPostDate.getDate() + 7);
        }
        
        setPosts(newPosts);
      } else if (frequency === 'monthly') {
        const newPosts = { ...posts };
        let currentPostDate = new Date(selectedDate);
        
        // Add monthly posts for the next 3 months
        for (let i = 0; i < 3; i++) {
          const dateStr = currentPostDate.toISOString().split('T')[0];
          newPosts[dateStr] = [...(newPosts[dateStr] || []), postText];
          currentPostDate.setMonth(currentPostDate.getMonth() + 1);
        }
        
        setPosts(newPosts);
      }
    }
    
    handleCloseModal();
  };

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  // Go to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Delete a post
  const handleDeletePost = (dateKey, index) => {
    console.log('delet called')
    // Convert dateKey to Date object for past date check
    const postDate = new Date(dateKey);
        
    setPosts(prevPosts => {
      const updatedPosts = { ...prevPosts };
      updatedPosts[dateKey] = updatedPosts[dateKey].filter((_, i) => i !== index);
      
      if (updatedPosts[dateKey].length === 0) {
        delete updatedPosts[dateKey];
      }
      
      return updatedPosts;
    });
  };

  // Open edit modal for an existing post
  const handleEditPost = (date, index) => {
    // Check if the date is in the past
    // if (isDateInPast(date)) {
    //   return; // Don't allow editing posts from past dates
    // }
    
    const dateKey = date.toISOString().split('T')[0];
    const postContent = posts[dateKey][index];
    
    setSelectedDate(date);
    setPostText(postContent);
    setFrequency('once'); // Default to once when editing
    setIsEditing(true);
    setEditPostIndex(index);
    setIsModalOpen(true);
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const calendarDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(currentYear, currentMonth, 0 - i);
      const day = prevMonthDate.getDate();
      
      calendarDays.unshift(
        <div key={`prev-${day}`} className="calendar-day empty">
          <div className="day-number">{day}</div>
        </div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = date.toISOString().split('T')[0];
      const hasPost = posts[dateKey] && posts[dateKey].length > 0;
      const isPastDate = isDateInPast(date);
      const isToday = date.toDateString() === today.toDateString();
      
      calendarDays.push(
        <div 
          key={`current-${day}`} 
          className={`calendar-day ${hasPost ? 'has-post' : ''} ${isPastDate ? 'past-date' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => !isPastDate && !hasPost && handleOpenModal(date)}
        >
          <div className={`day-number ${isToday ? 'today-marker' : ''}`}>
            {day}
            {/* {isPastDate && (
              <Tooltip title="Past dates cannot be edited">
                <LockIcon fontSize="small" className="lock-icon" />
              </Tooltip>
            )} */}
          </div>
          
          {hasPost && (
            <div className="posts-container">
              {posts[dateKey].map((post, index) => (
                <div 
                  key={index} 
                  className="post-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    !isPastDate && handleEditPost(date, index);
                  }}
                >
                  <Chip 
                    label={post.length > 20 ? `${post.substring(0, 20)}...` : post} 
                    size="small" 
                    color={isPastDate ? "default" : "primary"} 
                    onDelete={!isPastDate ? (e) => {
                      e.stopPropagation();
                      handleDeletePost(dateKey, index);
                    } : undefined}
                    clickable={!isPastDate}
                  />
                </div>
              ))}
            </div>
          )}
          
          {(day === 25) && (
            <div className="add-post-icon">
              <AddIcon />
            </div>
          )}
        </div>
      );
    }
    
    // Add next month days to fill the grid
    const nextMonthDays = getNextMonthDates(currentYear, currentMonth, daysInMonth, firstDayOfMonth);
    for (let day of nextMonthDays) {
      calendarDays.push(
        <div key={`next-${day}`} className="calendar-day empty">
          <div className="day-number">{day}</div>
        </div>
      );
    }
    
    return calendarDays;
  };

  // Function to validate date in the modal's date picker
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    
    // Don't allow selecting past dates
    if (isDateInPast(newDate)) {
      return;
    }
    
    setSelectedDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="top-navigation">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          className="status-tabs"
          sx={{color: '#6750f5'}}
        >
          <Tab label="All Posts" />
          <Tab label="Drafts" />
          <Tab label="Scheduled" />
          <Tab label="Published" />
          <Tab label="Deleted" />
        </Tabs>
        
        <div className="top-actions">
          <div className="search-container">
            <OutlinedInput
              placeholder="Search"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              className="search-input"
            />
          </div>
          
          <IconButton className="more-options">
            <MoreVertIcon />
          </IconButton>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            className="create-post-button"
            onClick={() => handleOpenModal()}
          >
            Create Post
          </Button>
        </div>
      </div>
      
      <div className="calendar-controls">
        <div className="left-controls">
          <Button 
            variant="outlined" 
            className="today-button" 
            onClick={handleToday}
          >
            Today
          </Button>
          
          <div className="date-navigation">
            <IconButton onClick={handlePrevMonth} size="small">
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            
            <Typography variant="body1" className="date-range">
              {getDateRangeDisplay()}
            </Typography>
            
            <IconButton onClick={handleNextMonth} size="small">
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </div>
          
          <div className="view-dropdown">
            <Button 
              variant="outlined"
              startIcon={<CalendarMonthIcon />}
              endIcon={<ArrowForwardIosIcon fontSize="small" style={{ fontSize: '12px' }} />}
              className="view-button"
            >
              Monthly
            </Button>
          </div>
        </div>
        
        <div className="right-controls">
          <div className="filter-buttons">
            <Button 
              variant="outlined"
              startIcon={<TagIcon />}
              endIcon={<ArrowForwardIosIcon fontSize="small" style={{ fontSize: '12px' }} />}
              className="filter-button"
            >
              Tags
            </Button>
            
            <Button 
              variant="outlined"
              startIcon={<LaptopIcon />}
              endIcon={<ArrowForwardIosIcon fontSize="small" style={{ fontSize: '12px' }} />}
              className="filter-button"
            >
              Channels
            </Button>
          </div>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="week-day">Sunday</div>
        <div className="week-day">Monday</div>
        <div className="week-day">Tuesday</div>
        <div className="week-day">Wednesday</div>
        <div className="week-day">Thursday</div>
        <div className="week-day">Friday</div>
        <div className="week-day">Saturday</div>
        {renderCalendarDays()}
      </div>
      
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="post-modal-title"
      >
        <Paper className="modal-content">
          <div className="modal-header">
            <Typography id="post-modal-title" variant="h6">
              {isEditing 
                ? `Edit Post for ${selectedDate?.toLocaleDateString()}`
                : selectedDate 
                  ? `Create Post for ${selectedDate.toLocaleDateString()}`
                  : 'Create New Post'
              }
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </div>
          
          <div className="modal-body">
            {!selectedDate && (
              <TextField
                label="Select Date"
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0] // Set min date to today
                }}
              />
            )}
            
            <TextField
              label="Post Content"
              multiline
              rows={4}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            
            {!isEditing && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="frequency-label">Posting Frequency</InputLabel>
                <Select
                  labelId="frequency-label"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  label="Posting Frequency"
                >
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="weekly">Weekly (4 weeks)</MenuItem>
                  <MenuItem value="monthly">Monthly (3 months)</MenuItem>
                </Select>
              </FormControl>
            )}
          </div>
          
          <div className="modal-footer">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSavePost}
              disabled={!postText.trim() || !selectedDate}
            >
              {isEditing ? 'Update Post' : 'Save Post'}
            </Button>
          </div>
        </Paper>
      </Modal>
      

    </div>
  );
};

export default PostingCalendar;