const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const { GoogleGenerativeAI } = require("@google/generative-ai")
const app = express()
const dailyTask = require("../models/dailyTaskModel")
const connectDB = require('../config/db')
const http = require('http')
const {sysPrompt} = require('../agent/sysPrompt')
// const WebSocket = require('ws');
const multer = require('multer')
const {WebSocketServer} = require('ws')
const fs = require('fs')
const {
  spawn
} = require('child_process')
const faceDetectModel = require('../models/faceDetectModel')
const { schema } = require('../agent/schema')
//DOTENV 
dotenv.config();

//Connect DB mongoose
connectDB();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//port
const port = process.env.PORT || 5000

//websockt
const server = http.createServer(app);
const wss = new WebSocketServer({server})

//routes
app.use("/api/v1/auth", require('../routes/userRoutes'))
app.use("/api/v1/auth", require('../routes/doctorRoutes'))
app.use("/api/v1/dailyTask", require('../routes/taskRoute'))
app.use("/api/v1/feel", require('../routes/feelingRoute'))
app.use("/api/v1/sleep", require('../routes/sleepRoute'))
app.use("/api/v1/weeklyTest", require('../routes/weeklyTestRoute'))
app.use("/api/v1/streak", require('../routes/streakRoute'))

app.get("/dailyTasks", async (req, res) => {
  let tasks = await dailyTask.find()
  if (tasks.length > 0) {
    res.send(tasks)
  } else {
    res.send("nothing found")
  }
})

app.get("/faceData", async (req, res) => {
  let data = await faceDetectModel.find()
  if (data.length > 0) {
    res.send(data)
  } else {
    res.send("no data available")
  }
})

const upload = multer({
  dest: 'uploads/'
});

app.post('/upload', upload.single('video'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  await fs.renameSync(file.path, `uploads/${file.originalname}`);

  // res.status(200).send({
  //   message:"Video Uploaded"
  // })
  console.log("Video Uploaded")
  try {
    const {
      exec
    } = require('child_process');
    const pythonScript = 'AICamTextOutput.py';
    const videoPath = `D:\\AIIMS_Project\\V1\\backend\\uploads\\${file.originalname}`

    let emotion

    exec(`python ${pythonScript} ${videoPath}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`error executing python script: ${error.message}`)
        return;
      }
      const lines = stdout.split('\n');
      const lastLine = lines[lines.length - 2];
      emotion = lastLine.split(' ').pop();

      console.log(`${emotion}`);

      const saveData = await faceDetectModel({
        score: emotion
      }).save()
      res.send({
        success: true,
        message: "reports are ready",
        saveData
      })

    });

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during Python script execution.');
  }
});

const executePython2 = (script, args) => {
  return new Promise((resolve, reject) => {
    console.log("AI model started loading....")
    const py = spawn('python', [script, args], { stdio: ['pipe', 'pipe', 'ignore'] }); // Pass args directly
    let output = '';

    // Get output from Python script
    py.stdout.on('data', (data) => {
      output += data;

    });

    // Handle error
    py.on('error', (error) => {
      console.error(`Error executing Python script: ${error}`);
      reject(`Error executing Python script: ${error}`);
    });

    // Python script execution finished 
    py.on('close', (code) => {
      console.log(`Child process executed with code ${code}`);
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Python script exited with non-zero exit code: ${code}`);
      }
    });
  });
};

app.post('/text/', async (req, res) => {
  const data = req.body.data;
  console.log(data);
  try { 
    const result = await executePython2('./AIAudioInterference.py', [data]); 
    console.log(result);
    res.send(result); 
  } catch (error) {
    console.error(error); 
    res.status(500).send('Internal Server Error'); 
  }
});



app.delete('/delete/:_id', async (req, res) => {
  try {
    const result = await dailyTask.deleteOne({
      _id: req.params._id
    });

    if (result.deletedCount > 0) {
      res.json({
        success: true,
        message: 'Item deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

//for ai chatbot (web socker)
wss.on('connection', async(ws)=>{
  console.log("client connected")
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
  
  const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: sysPrompt,
      generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
      },
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hi" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello" }],
      }
    ],
  });
  
  let userData = [];
  ws.on('message', async(message)=>{
    try {
      const msg = message.toString();
      // let result = await chat.sendMessage(msg);
      const result = await chat.sendMessage(JSON.stringify({userMessage: msg, requestedData:userData}));
      const botmsg = JSON.parse(result.response.text())
      if(botmsg.getUserBecksTestScore == true){
        userData.push("becksScore: 8")
      }
      if(botmsg.getUserDetails == true){
        userData.push("name: Ram, age: 21")
      }
      if(botmsg.getUserMoodData == true){
        userData.push("morning: happy, noon: sad")
      }
      if(botmsg.getUserSleepData == true){
        userData.push("8 hours")
      }
      console.log(botmsg.message);
      console.log(result.response.text());
      ws.send(botmsg.message)
    } catch (error) {
      console.log(error)
    } 
  })

  ws.on('close', () => {
    console.log("Client disconnected");
});
})


server.listen(port, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`App is working on port ${port}`.bgWhite.black)
  }
})

// module.exports = app;
