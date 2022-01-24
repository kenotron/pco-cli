import dotenv from "dotenv";
import fs from "fs";
import pLimit from "p-limit";
import path from "path/posix";
import yargs from "yargs";
import { JsonFileWriter } from "./JsonFileWriter";
import { PlanningCenterClient } from "./PlanningCenterClient";

dotenv.config();

const args = yargs(process.argv.slice(2))
  .options("outdir", {
    alias: ["o"],
    description: "output directory",
    default: path.join(process.cwd(), "exported", new Date().toISOString()),
  })
  .parseSync();

const limit = pLimit(15);

async function run() {
  const applicationKey = process.env.PLANNING_CENTER_APPLICATION_ID || process.env.PCO_APPLICATION_ID || "";
  const secret = process.env.PLANNING_CENTER_SECRET || process.env.PCO_SECRET || "";

  const fileWriters = {
    groups: new JsonFileWriter(path.join(args.outdir, "groups.json")),
    groupsMemberships: new JsonFileWriter(path.join(args.outdir, "groupsMemberships.json")),
  };

  const client = new PlanningCenterClient(applicationKey, secret);

  // Exports groups
  const groups = client.get("groups", "groups");

  // Exports members
  const membershipsPromises = [];

  for await (const group of groups) {
    fileWriters.groups.append(group);

    const memberPromise = limit(async () => {
      const memberships = client.get("groups", `groups/${group.id}/memberships`);
      for await (const membership of memberships) {
        fileWriters.groupsMemberships.append(membership);
      }
    });

    membershipsPromises.push(memberPromise);
  }

  await Promise.all(membershipsPromises);

  fileWriters.groupsMemberships.close();

  fileWriters.groups.close();
}

run();
