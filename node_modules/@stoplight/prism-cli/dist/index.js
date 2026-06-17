#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const mock_1 = require("./commands/mock");
const proxy_1 = require("./commands/proxy");
yargs
    .scriptName('prism')
    .version()
    .help(true)
    .strict()
    .wrap(yargs.terminalWidth())
    .command(mock_1.default)
    .command(proxy_1.default)
    .demandCommand(1, '').argv;
