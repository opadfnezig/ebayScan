const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.DATABASE_HOST}:27017/${process.env.DATABASE_NAME}?authSource=admin`,
    {
        useNewUrlParser: true,
    }
)
    .then(() => console.log('Connected to database'))
    .catch(err => console.error(err));