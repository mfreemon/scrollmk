import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  Divider,
  Grid
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
import ImageIcon from '@mui/icons-material/Image';
import './calendar.scss';
import PostModal from './PostModal';
import CalendarDays from './CalendarDays';

// Helper function to get days in a month
// const getDaysInMonth = (year, month) => {
//   return new Date(year, month + 1, 0).getDate();
// };

// // Helper function to get the day of week for the first day of the month
// const getFirstDayOfMonth = (year, month) => {
//   return new Date(year, month, 1).getDay();
// };

// Helper function to check if a date is in the past
const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Get dates for next month preview
// const getNextMonthDates = (year, month, daysInMonth, firstDayOfMonth) => {
//   const totalCells = 42; // 6 rows of 7 days
//   const filledCells = firstDayOfMonth + daysInMonth;
//   const nextMonthDays = totalCells - filledCells;
  
//   return Array.from({ length: nextMonthDays }, (_, i) => i + 1);
// };

// Simulate caption generation - in a real app this would call an API
const generateCaption = async (prompt) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sample captions based on prompts
  const captions = {
    'product': [
      "Elevate your routine with our latest innovation. #GameChanger",
      "Quality meets design. Discover the difference today.",
      "The perfect addition to your collection. Now available!"
    ],
    'announcement': [
      "Exciting news! We're thrilled to announce our newest venture.",
      "Mark your calendars! Something big is coming your way soon.",
      "The wait is over. Introducing our latest offering!"
    ],
    'engagement': [
      "What's your favorite way to use our products? Share below!",
      "Tag someone who needs to see this in their life!",
      "Double tap if you're as excited as we are!"
    ],
    'default': [
      "Innovation meets excellence. The journey continues.",
      "Crafted with care, designed for you.",
      "Every detail matters. Experience the difference."
    ]
  };

  // Select random caption from the appropriate category or default
  const category = prompt.toLowerCase().includes('product') ? 'product' :
                  prompt.toLowerCase().includes('announce') ? 'announcement' :
                  prompt.toLowerCase().includes('engage') ? 'engagement' : 'default';
  
  const randomIndex = Math.floor(Math.random() * captions[category].length);
  return captions[category][randomIndex];
};

// Simulate image generation - in a real app this would call an API
const generateImage = async (prompt) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a placeholder image URL
  // In a real application, this would return a generated image
  return `https://placehold.co/600x400`;
};

const PostingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [postText, setPostText] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editPostIndex, setEditPostIndex] = useState(null);
  
  // New state for caption and image generation
  const [captionPrompt, setCaptionPrompt] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Calculate days in current month
  // const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  // const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
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
    
    // Reset generation fields
    setCaptionPrompt('');
    setGeneratedCaption('');
    setImagePrompt('');
    setGeneratedImage('');
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setPostText('');
    setIsEditing(false);
    setEditPostIndex(null);
    
    // Reset generation fields
    setCaptionPrompt('');
    setGeneratedCaption('');
    setImagePrompt('');
    setGeneratedImage('');
  };

  // Handle saving a post
  const handleSavePost = () => {
    if (!postText.trim() || !selectedDate) return;
    
    // Double-check the selected date is not in the past
    if (isDateInPast(selectedDate)) {
      return;
    }
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    // Create post object with content and generated media
    const postData = {
      text: postText,
      caption: generatedCaption || '',
      image: generatedImage || ''
    };
    
    // If we're editing an existing post
    if (isEditing && editPostIndex !== null) {
      setPosts(prevPosts => {
        const updatedPosts = { ...prevPosts };
        const postsList = [...updatedPosts[dateKey]];
        postsList[editPostIndex] = postData;
        updatedPosts[dateKey] = postsList;
        return updatedPosts;
      });
    } else {
      // Handle different frequency options for new posts
      if (frequency === 'once') {
        setPosts(prevPosts => ({
          ...prevPosts,
          [dateKey]: [...(prevPosts[dateKey] || []), postData]
        }));
      } else if (frequency === 'weekly') {
        const newPosts = { ...posts };
        let currentPostDate = new Date(selectedDate);
        
        // Add weekly posts for the next 4 weeks
        for (let i = 0; i < 4; i++) {
          const dateStr = currentPostDate.toISOString().split('T')[0];
          newPosts[dateStr] = [...(newPosts[dateStr] || []), postData];
          currentPostDate.setDate(currentPostDate.getDate() + 7);
        }
        
        setPosts(newPosts);
      } else if (frequency === 'monthly') {
        const newPosts = { ...posts };
        let currentPostDate = new Date(selectedDate);
        
        // Add monthly posts for the next 3 months
        for (let i = 0; i < 3; i++) {
          const dateStr = currentPostDate.toISOString().split('T')[0];
          newPosts[dateStr] = [...(newPosts[dateStr] || []), postData];
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
    const dateKey = date.toISOString().split('T')[0];
    const postData = posts[dateKey][index];
    
    setSelectedDate(date);
    
    // Handle both string and object post formats for backward compatibility
    if (typeof postData === 'string') {
      setPostText(postData);
      setGeneratedCaption('');
      setGeneratedImage('');
    } else {
      setPostText(postData.text || '');
      setGeneratedCaption(postData.caption || '');
      setGeneratedImage(postData.image || '');
    }
    
    setFrequency('once'); // Default to once when editing
    setIsEditing(true);
    setEditPostIndex(index);
    setIsModalOpen(true);
  };

  // Generate caption based on prompt
  const handleGenerateCaption = async () => {
    if (!captionPrompt.trim()) return;
    
    setIsGeneratingCaption(true);
    try {
      const caption = await generateCaption(captionPrompt);
      setGeneratedCaption(caption);
      
      // Automatically add the caption to the post text if empty
      if (!postText.trim()) {
        setPostText(caption);
      }
    } catch (error) {
      console.error('Error generating caption:', error);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  // Generate image based on prompt
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Apply generated caption to post text
  const handleApplyCaption = () => {
    if (generatedCaption) {
      setPostText(generatedCaption);
    }
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

  const postModalProps = {
    captionPrompt,
    isModalOpen,
    handleCloseModal,
    isEditing,
    selectedDate,
    handleDateChange,
    postText,
    handleGenerateCaption,
    handleGenerateImage,
    isGeneratingCaption,
    generatedCaption,
    imagePrompt,
    isGeneratingImage,
    generatedImage,
    frequency,
    setPostText,
    setCaptionPrompt,
    setImagePrompt,
    handleSavePost,
    handleCloseModal,
    setFrequency
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
        <CalendarDays 
          currentDate={currentDate} 
          currentMonth={currentMonth} 
          currentYear={currentYear} 
          posts={posts}
          isDateInPast={isDateInPast}
          handleOpenModal={handleOpenModal}
        />
      </div>
      
      <PostModal {...postModalProps}/>
    </div>
  );
};

export default PostingCalendar;