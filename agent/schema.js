const { SchemaType } = require("@google/generative-ai");

const schema = {
  description: "Mental wellness agent response schema",
  type: SchemaType.OBJECT,
  properties: {
    message: {
      type: SchemaType.STRING,
      description: "Your normal conversational message to the user.",
      nullable: false,
    },
    requireTools: {
      description: "Specifies if tools are needed to fetch user data.",
      type: SchemaType.OBJECT,
      properties: {
        isAccessToToolsRequired: {
          type: SchemaType.BOOLEAN,
          description: "True if access to tools is required.",
          nullable: false,
        },
        getDailyTasks: {
          type: SchemaType.BOOLEAN,
          description: "True if daily tasks of the user are needed.",
          nullable: true,
        },
        getUserDetails: {
          type: SchemaType.BOOLEAN,
          description: "True if user details are needed.",
          nullable: true,
        },
        getUserMoodData: {
          type: SchemaType.BOOLEAN,
          description: "True if user's mood data is needed.",
          nullable: true,
        },
        getUserSleepData: {
          type: SchemaType.BOOLEAN,
          description: "True if user's sleep data is needed.",
          nullable: true,
        },
        getBecksTestScore: {
          type: SchemaType.BOOLEAN,
          description: "True if user's Beck's test score is needed.",
          nullable: true,
        },
      },
      required: ["isAccessToToolsRequired"],
    },
    updateDataToDatabase: {
      description: "Specifies if data should be saved to the database.",
      type: SchemaType.OBJECT,
      properties: {
        wantToUpdateDatabase: {
          type: SchemaType.BOOLEAN,
          description: "True if data should be updated in the database.",
          nullable: false,
        },
        updateEmotionalBehaviour: {
          type: SchemaType.STRING,
          description: "Emotion: 'sad', 'happy', 'excited', 'angry', 'critical', etc.",
          nullable: false, 
        },
        causeOfBehaviour: {
          type: SchemaType.STRING,
          description: "Reason for the emotional behavior.",
          nullable: false, 
        },
      },
      required: ["wantToUpdateDatabase", "updateEmotionalBehaviour", "causeOfBehaviour"], 
    },
  },
  required: ["message", "requireTools", "updateDataToDatabase"],
};

module.exports = { schema };