'use strict'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

async function setup() {
  const byPass = process.argv.indexOf('yes') !== -1
  
  if (!byPass) {
    const prompt = inquirer.createPromptModule()
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'Are you sure to destroy the database?'
      }
    ])
  
    if (!answer.setup) {
      return console.log('Nothing happend.')
    }
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true,
    operatorsAliases: false,
  }

  await db(config).catch(handleFatalError)
  console.log('Success')
  process.exit(0)
}

const handleFatalError = (err) => {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
