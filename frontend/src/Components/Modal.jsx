import { 
    Modal, 
    Paper, 
    Typography, 
    IconButton,
    TextField,
    Divider,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TitleIcon from '@mui/icons-material/Title';
import ImageIcon from '@mui/icons-material/Image';


const PostModal = ({
  captionPrompt,
  setCaptionPrompt,
  setImagePrompt,
  isModalOpen, 
  isEditing, 
  selectedDate, 
  handleDateChange, 
  postText,
  handleGenerateCaption,
  isGeneratingCaption,
  generatedCaption,
  handleApplyCaption,
  imagePrompt,
  handleGenerateImage,
  isGeneratingImage,
  generatedImage,
  frequency,
  handleSavePost,
  handleCloseModal,
  setPostText
}) => {
  console.log(selectedDate)
  return (

    <Modal
      className='scroll-mk-modal'
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
          
          {/* AI Generation Section */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            <AutoAwesomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            AI Generation Tools
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Caption Generator */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <TitleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
                Caption Generator
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Describe what you want in your caption"
                placeholder="e.g., 'Engaging product announcement for our spring collection'"
                value={captionPrompt}
                onChange={(e) => setCaptionPrompt(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateCaption}
                disabled={isGeneratingCaption || !captionPrompt.trim()}
                fullWidth
                startIcon={isGeneratingCaption ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              >
                {isGeneratingCaption ? 'Generating...' : 'Generate Caption'}
              </Button>
            </Grid>
            
            {generatedCaption && (
              <>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1">{generatedCaption}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleApplyCaption}
                    size="small"
                  >
                    Use This Caption
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
          
          {/* Image Generator */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <ImageIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
                Image Generator
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Describe the image you want to generate"
                placeholder="e.g., 'Product on a minimalist background with natural lighting'"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                fullWidth
                startIcon={isGeneratingImage ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              >
                {isGeneratingImage ? 'Generating...' : 'Generate Image'}
              </Button>
            </Grid>
            
            {generatedImage && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <img 
                    src={generatedImage} 
                    alt="Generated content" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
          
          <Divider sx={{ mt: 3, mb: 3 }} />
          
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
  )  
}

export default PostModal;