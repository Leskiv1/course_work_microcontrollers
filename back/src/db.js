import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgresql://ridetrackerdb_owner:npg_8gxICrTvGqy0@ep-wispy-silence-a20azdit-pooler.eu-central-1.aws.neon.tech/ridetrackerdb?sslmode=require', {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully with Sequelize.');
} catch (error) {
    console.error('Unable to connect to PostgreSQL database:', error);
}

export default sequelize;
