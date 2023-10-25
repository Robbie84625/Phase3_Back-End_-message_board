const pool = require("../database_connect").pool;
const dotenv = require("dotenv");
dotenv.config();

class messageProcess {
    async insertMessage(content,image) {
        try {
            let mysqlQuery = "INSERT INTO `message_board`(content,image_url) VALUES(?, ?);";
            let values = [content,image];
            await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }
    }
    async getMessage() {
        try {
            let mysqlQuery = "SELECT content, image_url FROM message_board ORDER BY created_time DESC;"
            const results = await pool.query(mysqlQuery);

            return results; 
        } catch (error) {
            console.error("error:", error.message);
        }
    }
    

}


module.exports = {
    messageProcess
};