/* eslint-disable no-undef */
const local = {
    httpPort: process.env.PORT,
    httpsPort: process.env.HTTPS_PORT,
    app: process.env.APP,
    jwtTokenKey: process.env.JWT_TOKEN,
    env: process.env.ENV,
    secret: process.env.SECRET,
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY,
    bucketPath: process.env.BUCKET_PATH,
    mongoDB: process.env.MONGO_DB,
    baseUrl: process.env.BASE_URL,
    fileLocation: process.env.FILE_LOCATION,
    menteeMessagesLimit: process.env.MESSAGES_LIMIT_MENTEE,
    mentorMessagesLimit: process.env.MESSAGES_LIMIT_MENTOR,
    ERROR_LOG: process.env.ERROR_LOG,
  };
  
  const qa = {};
  
  const prod = {};
  
  module.exports =
    process.env.ENV === 'qa'
      ? qa
      : 
      process.env.ENV === 'prod'
        ? prod
        : local;