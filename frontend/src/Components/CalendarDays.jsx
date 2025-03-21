import { Chip} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const CalendarDays = ({
  currentMonth, 
  currentDate, 
  currentYear, 
  posts,
  isDateInPast,
  handleOpenModal,
  handleEditPost,
  handleDeletePost
}) => {
  const calendarDays = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Get dates for next month preview
  const getNextMonthDates = (year, month, daysInMonth, firstDayOfMonth) => {
    const totalCells = 42; // 6 rows of 7 days
    const filledCells = firstDayOfMonth + daysInMonth;
    const nextMonthDays = totalCells - filledCells;
    
    return Array.from({ length: nextMonthDays }, (_, i) => i + 1);
  };

  // Helper function to get days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get the day of week for the first day of the month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  // Calculate days in current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);


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
        </div>
        
        {hasPost && (
          <div className="posts-container">
            {posts[dateKey].map((post, index) => {
              // Handle both string and object post formats
              const postContent = typeof post === 'string' ? post : post.text;
              const hasMedia = typeof post === 'object' && (post.image || post.caption);
              
              return (
                <div 
                  key={index} 
                  className="post-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    !isPastDate && handleEditPost(date, index);
                  }}
                >
                  <Chip 
                    label={postContent.length > 20 ? `${postContent.substring(0, 20)}...` : postContent} 
                    size="small" 
                    color={isPastDate ? "default" : "primary"} 
                    icon={hasMedia ? <ImageIcon fontSize="small" /> : undefined}
                    onDelete={!isPastDate ? (e) => {
                      e.stopPropagation();
                      handleDeletePost(dateKey, index);
                    } : undefined}
                    clickable={!isPastDate}
                  />
                </div>
              );
            })}
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

export default CalendarDays;