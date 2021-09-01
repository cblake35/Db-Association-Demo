require('dotenv').config()

const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    }
);


const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

/* One to One Relationship */
const Profile = sequelize.define('profile', {
    birthday: {
        type: DataTypes.DATE,
    }
})

User.hasOne(Profile, {
    onDelete: 'CASCADE' //should a delete trigger then CASCADE(delete things associated with it)
});
Profile.belongsTo(User);

/* One to Many*/
const Order = sequelize.define('order', {
    shipDate: {
        type: DataTypes.DATE,
    }
});

User.hasMany(Order)
Order.belongsTo(User)

/* Many to Many*/
const Class = sequelize.define('Class', {
    className: {
        type: DataTypes.STRING
    },
    startDate: {
        type: DataTypes.DATE
    }
})

User.belongsToMany(Class, { through: 'Users_Classes'}); //through creates a 'Users_Classes' junction table
Class.belongsToMany(User, { through: 'Users_Classes'});

;(async () => {
    await sequelize.sync({force: true});

   let my_user =  await User.create({
        username: 'Chris'
    })

   let my_profile = await Profile.create({
        birthday: new Date()
    })

    await my_user.setProfile(my_profile)
    await my_profile.setUser(my_user)

    console.log(await my_profile.dataValues)
    // console.log(await my_user.getProfile())
})();