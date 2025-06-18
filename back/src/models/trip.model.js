import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.model.js';

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'trips',
    timestamps: false,
});

Trip.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(Trip, {
    foreignKey: 'user_id',
});

export default Trip;
