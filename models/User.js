module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user', {
		userId: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
    smites: {
      type:DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    username: {
      type:DataTypes.STRING,
      allowNull: true,
    }
	}, {
		timestamps: false,
	});
};