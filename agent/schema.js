const {SchemaType} = require("@google/generative-ai")

const schema = {
  description: "Mental wellness agent",
  type: SchemaType.OBJECT,
  properties: {
    message: {
      type: SchemaType.STRING,
      description: "Your normal conversational message.",
      nullable: false,
    },
    requireDailyTasks:{
      type: SchemaType.BOOLEAN,
      description: "true if you need daily tasks of the user",
      nullable: true
    },
    getUserDetails:{
      type: SchemaType.BOOLEAN,
      description:"true if you need user details",
      nullable: true
    },
    getUserMoodData:{
      type: SchemaType.BOOLEAN,
      description: "true if you need whole day mood data of user",
      nullable: true
    },
    getUserSleepData:{
      type: SchemaType.BOOLEAN,
      description: "true if you need users previous sleep data",
      nullable: true
    },
    getUserBecksTestScore:{
      type: SchemaType.BOOLEAN,
      description: "true if you need users becks test score",
      nullable: true
    }
  },
  required: ["message", "requireDailyTasks", "getUserDetails", "getUserMoodData", "getUserSleepData", "getUserBecksTestScore"],
}

module.exports = {schema}