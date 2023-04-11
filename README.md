# Generate Foundry Object Typings

This is a script that helps you quickly generate Typescript types or interfaces for Foundry object types.

If you make an app in Typescript that uses Foundry's Ontology APIs, you need interfaces or types for whatever object types your code uses. Today, creating those types is a manual process. This script automates that process.

## Installation

This script uses Deno, which you can install with [these instructions](https://deno.land/manual/getting_started/installation).

## Setup

This script relies on a Foundry API token. [Generate a token](https://www.palantir.com/docs/foundry/api/general/overview/authentication/#authentication-during-development), and store it in an environment variable called TOKEN. Also store the hostname of your stack and the ontology rid for the relevant ontology. You can find the ontology rid in the Advanced pane of the Ontology Manager app:

```
export $TOKEN=<your foundry token>
export $HOSTNAME=<your hostname>  # often in the form something.palantirfoundry.com
export $ONTOLOGYRID=<your ontology rid>
```

Alternately, create a `.env` file and add your token there:

```
# ./.env

TOKEN=<your foundry token>
HOSTNAME=<your hostname>
ONTOLOGYRID=<your ontology rid>
```

## Use

To use the script, run the following command. It will print out the interface definitions for each object type you supply. You can then copy the definitions wherever you need them. All properties except the primary key will be typed as optional. Properties will remain in the same order as received in the response from Foundry's API.

Use the `-o` or `--objectTypes` option before the object types.

```
deno --allow-net run generateObjectTypings -o <objectType1ApiName> <objectType2ApiName> ...
```

It will print the interface definitions:

```
interface ObjectType1 {
  propPrimaryKey: someType;
  prop2?: someType;
  prop3?: someType;
  ...
}
```

### Options
- If you want to extend a generic OntologyObject interface, add the `-e` or `--extendOntologyObject` option. This option is incompatible with the `-t` option and will be overriden by that option.
- If you want types instead of interfaces, add the `-t` or `--types` option.
- If you want the original object types included as comments, add the `-c` or `--commentOntologyType` option.
- If you want to type date and timestamp fields as strings instead of `Date`, add the `-d` or `--dateAsString` option.

## Contact
Please email taylor@ontologize.com with any questions or comments.