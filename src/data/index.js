const { DatabaseManager } = require('./Database');
const { ProjectModel } = require('./models/Project');
const { SessionModel } = require('./models/Session');
const { ConfigModel } = require('./models/Config');
const { StatsModel } = require('./models/Stats');
const { AchievementModel } = require('./models/Achievement');
const { PhraseModel } = require('./models/Phrase');

class DataService {
  constructor() {
    this.database = new DatabaseManager();
    this.projects = null;
    this.sessions = null;
    this.configs = null;
    this.stats = null;
    this.achievements = null;
    this.phrases = null;
  }

  initialize() {
    this.database.initialize();

    // Initialize all models
    this.projects = new ProjectModel(this.database);
    this.sessions = new SessionModel(this.database);
    this.configs = new ConfigModel(this.database);
    this.stats = new StatsModel(this.database);
    this.achievements = new AchievementModel(this.database);
    this.phrases = new PhraseModel(this.database);

    console.log('DataService initialized successfully');
  }

  close() {
    this.database.close();
  }
}

// Singleton instance
let dataServiceInstance = null;

function getDataService() {
  if (!dataServiceInstance) {
    dataServiceInstance = new DataService();
  }
  return dataServiceInstance;
}

module.exports = { DataService, getDataService };
