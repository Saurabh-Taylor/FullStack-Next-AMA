import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

let connection:ConnectionObject  ={} 

async function dbConnect():Promise<void> {
    if(connection?.isConnected){
        console.log('DB already connected')
        return 
    }

   try {
     const db = await mongoose.connect(process.env.MONGO_URI || "" , {})
     console.log("DB from dbConnect.ts: ",db);
     console.log("DB Connections from dbConnect.ts: ",db.connections);
     connection.isConnected = db.connections[0].readyState
     console.log("DB connected Successfully");
     
   } catch (error) {
        console.log("DB connection Failed",error);
        //Gracefully exit in case of a connection error
        process.exit(1)
   }
    
}

export default dbConnect