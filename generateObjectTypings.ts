import { load } from "https://deno.land/std@0.182.0/dotenv/mod.ts";
import yargs from "https://deno.land/x/yargs@v17.7.1-deno/deno.ts";
import { typeMap, typeMapDateAsString } from "./typeMap.ts";

interface Arguments {
  type: string;
  objectTypes: string[];
  commentOntologyType: string;
  dateAsString: string;
  help: string;
}

interface ObjectTypeProperty {
  description?: string;
  baseType?: keyof typeof typeMap;
}

interface ObjectType {
  apiName: string;
  description?: string;
  primaryKey?: string[];
  properties?: Map<string, ObjectTypeProperty>;
}

const env = await load();
const token = env["TOKEN"] ?? Deno.env.get("TOKEN");
const hostname = env["HOSTNAME"] ?? Deno.env.get("HOSTNAME");
const ontologyRid = env["ONTOLOGYRID"] ?? Deno.env.get("ONTOLOGYRID");

const inputArgs: Arguments = yargs(Deno.args)
  .option("t", {
    alias: "type",
    describe: "Create Typescript types instead of interfaces",
    type: "boolean",
  })
  .option("o", {
    alias: "objectTypes",
    describe: "The list of object types to create type definitions for.",
    type: "string[]",
    demandOption: "Provide the Foundry API Name of at least one Object Type",
  })
  .option("c", {
    alias: "commentOntologyType",
    describe: "Add original Foundry property types as comments on each line",
    type: "boolean",
  })
  .option("d", {
    alias: "dateAsString",
    describe: "Type date and time properties as strings instead of Date",
    type: "boolean",
  })
  .help()
  .array("o").argv;

const urlBase = `https://${hostname}/api/v1/ontologies/${ontologyRid}/objectTypes/`;

for (const objectType of inputArgs.objectTypes) {
  try {
    const url = `${urlBase}${objectType}`;
    await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => {
        resp.status !== 200 &&
          Promise.reject(
            `Error for ${objectType}: ${resp.status} ${resp.statusText}`
          );
        return resp.json();
      })
      .then((respJson: ObjectType) => {
        if (respJson.properties) {
          const interfaceOrType = `${inputArgs.type ? "type" : "interface"} ${
            respJson.apiName
          } ${inputArgs.type ? "= " : ""}`;
          const opening = `\n${interfaceOrType}{`;
          const closing = "\n}";
          const properties = `${Object.entries(respJson.properties)
            .map(
              ([propertyApiName, property]: [string, ObjectTypeProperty]) => {
                if (property.baseType) {
                  const key = `\n  ${propertyApiName}`;
                  const isOptional = `${
                    respJson.primaryKey &&
                    respJson.primaryKey.includes(propertyApiName)
                      ? ""
                      : "?"
                  }`;
                  const value = `${
                    inputArgs.dateAsString
                      ? typeMapDateAsString[property.baseType]
                      : typeMap[property.baseType]
                  }`;
                  const comment = `${
                    inputArgs.commentOntologyType
                      ? `    # ${property.baseType}`
                      : ""
                  }`;
                  return `${key}${isOptional}: ${value}${comment};`;
                }
              }
            )
            .join("")}`;
          return `${opening}${properties}${closing}`;
        }
      })
      .then((typeDef) => console.log(typeDef));
  } catch (error) {
    console.error(error);
  }
}
