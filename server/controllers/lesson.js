const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'));
    }
  }
}).single('audio');

const scoreShadowing = async (req, res) => {    
    // console.log('req.file===>', req.file);
    // console.log('Uploaded file path:', req.file ? req.file.path : 'No file uploaded');


  try {
    // Handle file upload using multer
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No audio file provided' });
      }

      // Prepare form data for OpenAI API
      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path));
      formData.append('model', 'whisper-1');

      // Send to OpenAI Whisper API
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });

      // Clean up: Delete the uploaded file
      fs.unlinkSync(req.file.path);

      // Return the transcription result
      res.json({ 
        success: true, 
        transcription: response.data.text 
      });
    });
  } catch (error) {
    console.error('Error in scoreShadowing:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error processing audio file' 
    });
  }
}

module.exports = {
  scoreShadowing
};
