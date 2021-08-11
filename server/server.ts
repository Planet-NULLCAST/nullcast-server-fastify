import dotenv from 'dotenv';
import start from './app';

dotenv.config()

async function initServer() {
    try {
        const server  = await start(); 
        server.listen((process.env.PORT as unknown as number), (error, address) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        
            console.log('server started@ ',address);
        } )  
    } catch(error) {
        console.error(error)
        process.exit(1);
    }
}

initServer();
