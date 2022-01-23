import dotenv from "dotenv";
import { PlanningCenterClient } from "./PlanningCenterClient";

dotenv.config();

async function run() {
  const applicationKey = process.env.PLANNING_CENTER_APPLICATION_ID || process.env.PCO_APPLICATION_ID || "";
  const secret = process.env.PLANNING_CENTER_SECRET || process.env.PCO_SECRET || "";

  const client = new PlanningCenterClient(applicationKey, secret);

  const groups = await client.get<any[]>("groups", "groups");
  const memberships = [];

  for (const group of groups) {
    const groupMemberships = await client.get<any[]>("groups", `groups/${group.id}/memberships`);
    for (const membership of groupMemberships) {
      memberships.push(membership);
    }
  }

  
}

run();
