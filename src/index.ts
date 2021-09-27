import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

async function run() {
  const results = await axios.get(
    "https://api.planningcenteronline.com/services/v2",
    {
      auth: {
        username: process.env.PCO_APPLICATION_ID || "",
        password: process.env.PCO_SECRET || "",
      },
    }
  );

  console.log(results.data);
}

run();
