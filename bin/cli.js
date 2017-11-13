#!/usr/bin/env node
let program = require("commander");
const makeNewProject = require("../lib/makeNewProject");
const fs = require('fs');
const spawnSync = require("child_process").spawnSync;
const chdir = require('process').chdir;
const cwd = require('process').cwd;

program
  .command("init <projectname> [projectpath]")
  .description("Initialize a new swift-based native component project")
  .action(function(projectname, projectpath) {
     if(!projectpath) projectpath = "./" + projectname
     makeNewProject(projectname, projectpath); 
   })

program
  .command("makeapp <appprojectname> <pathToSwiftProjecrt> [appprojectpath]")
  .description("Create a blank app that adds a swift module to make development easier")
  .action(function(appname, swiftpath, appprojectpath) {
    if(!appprojectpath) appprojectpath = "./" + appname
    if(["/", "."].indexOf(swiftpath.substring(0,1)) == -1) swiftpath = "./" + swiftpath; 
    if(swiftpath.substring(0,1) != "/") swiftpath = cwd() + "/" + swiftpath;
    if(!fs.existsSync(swiftpath + "/package.json")) {
      console.log("There is no valid project at the path: " + swiftpath + "\n"); 
      return; 
    }
    let opts = {
      'encoding': 'utf8', 
      stdio: "inherit"
    }
    spawnSync("react-native", ["init", appname, appprojectpath], opts);
    chdir(appprojectpath); 
    spawnSync("yarn", ["add", swiftpath], opts);
    spawnSync("yarn", ["add", "react-native-swift"], opts);
    spawnSync("react-native", ["link"], opts); 
    console.log("Done. To edit your project in xcode, type \"open ios/*xcode*\"\n");     
  })
program
  .parse(process.argv)

if(!process.argv.slice(2).length) {
  program.outputHelp(); 
}