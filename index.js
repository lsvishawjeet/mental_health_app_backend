const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const app = express()
const dailyTask = require("./models/dailyTaskModel")
const connectDB = require('./config/db')
const WebSocket = require('ws');
const multer = require('multer')
const fs = require('fs')
const {
  spawn
} = require('child_process')
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
const wss = new WebSocket.Server({
  port: 9000
});
const socket = new WebSocket('ws://localhost:9000');

//routes
app.use("/api/v1/auth", require('./routes/userRoutes'))
app.use("/api/v1/dailyTask", require('./routes/taskRoute'))
app.use("/api/v1/feel", require('./routes/feelingRoute'))
app.use("/api/v1/sleep", require('./routes/sleepRoute'))
app.use("/api/v1/weeklyTest", require('./routes/weeklyTestRoute'))


app.get("/dailyTasks", async (req, res) => {
  let tasks = await dailyTask.find()
  if (tasks.length > 0) {
    res.send(tasks)
  } else {
    res.send("nothing found") 
  }
})

const executePython = (script, args) => {
  return new Promise((resolve, reject) => {
    const arguments = args.map(arg => arg.toString());
    const py = spawn('python', [script, ...arguments]);
 
    let output = '';

    // Get output from Python script
    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Handle error
    py.stderr.on('data', (data) => {
      console.error(`[python] error occurred ${data}`);
      reject(`error occurred in ${script}`);
    });

    // Python script execution finished
    py.on('close', (code) => {
      console.log(`Child process executed with code ${code}`);
      resolve(output);
    });
  });
};


const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('video'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  await fs.renameSync(file.path, `uploads/${file.originalname}`);
  
  try {
    const result = await executePython('./AICamTextOutput.py', [`D:\\AIIMS_Project\\V1\\backend\\uploads\\${file.originalname}`]);
    console.log(result);
    res.json({ result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});


app.listen(port, (err) => {
  if (err) { 
    console.log(err)
  } else {
    console.log(`App is working on port ${port}`.bgWhite.black)
  }
})