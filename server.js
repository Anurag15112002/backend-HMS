import app from "./app.js";
import cloudinary from "cloudinary"
import cors from "cors";

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

app.use(
    cors({
      origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Corrected option name
    })
  );
app.listen(process.env.PORT, () => {
    console.log(`server listening on port  ${process.env.PORT}`);

})