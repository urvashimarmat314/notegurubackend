// mongodb+srv://urvashimarmat:<password>@merndatabase.feys3uy.mongodb.net/


import { connect } from "mongoose";

const connectToMongo = async () => {
  try {
    await connect('mongodb+srv://urvashimarmat:marmat_9926@merndatabase.feys3uy.mongodb.net/eNoteBook');
    console.log("---***Database Connected Successfully***---")
  } catch (error) {
    console.log(error);
  }
}

export default connectToMongo;