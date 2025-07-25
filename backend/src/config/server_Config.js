import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGOOSEURI;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_PHONE_NUMBER_TO = process.env.TWILIO_PHONE_NUMBER_TO;
const EMAILPaSS=process.env.EMAILPaSS;
const EMAIL=process.env.EMAIL
const ADMINEMAIL=process.env.ADMINEMAIL

export {
  URI,
  PORT,
  TOKEN_SECRET,
  ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  TWILIO_PHONE_NUMBER_TO,
  EMAILPaSS,
  EMAIL,
  ADMINEMAIL
};
