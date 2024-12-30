const express = require("express");
const cors = require("cors"); 
const pptRoutes = require("./routes/ppt");
const app = express();
const PORT = 3000;


app.use(cors()); 
app.use(express.json());


app.use("/", pptRoutes);


app.listen(PORT, () => {
  
});