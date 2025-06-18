import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Trip from './trip.model.js';

const TripStatistic = sequelize.define('TripStatistic', {
    trip_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Trip,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    distance_km: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    duration_hr: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    finish_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    avg_speed: {
        type: DataTypes.REAL,
    },
    percentage_up: {
        type: DataTypes.REAL,
    },
    percentage_down: {
        type: DataTypes.REAL,
    },
}, {
    tableName: 'trip_statistics',
    timestamps: false,
});

// Define association
TripStatistic.belongsTo(Trip, {
    foreignKey: 'trip_id',
    onDelete: 'CASCADE',
});

Trip.hasOne(TripStatistic, {
    foreignKey: 'trip_id',
});

export default TripStatistic;
