const { Sequelize } = require('sequelize');


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('phongtro123', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 4306,
  logging : false
});

const  connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
export default connectDatabase