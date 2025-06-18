import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Trip from './trip.model.js';

const TripDetail = sequelize.define('TripDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    speed: {
        type: DataTypes.REAL,
    },
    tilt_angle: {
        type: DataTypes.REAL,
    },
    battery_percent: {
        type: DataTypes.INTEGER,
    },
    recorded_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'trip_details',
    timestamps: false,
});

TripDetail.belongsTo(Trip, {
    foreignKey: 'trip_id',
    onDelete: 'CASCADE',
});

Trip.hasMany(TripDetail, {
    foreignKey: 'trip_id',
});

export default TripDetail;
