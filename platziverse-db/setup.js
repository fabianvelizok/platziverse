'use strict'

const chalk = require('chalk')
const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const common = require('platziverse-common')

async function setup () {
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
      return console.log('Nothing happened.')
    }
  }

  const config = Object.assign({}, common.db.config, {
    logging: s => debug(s),
    setup: true,
    operatorsAliases: false
  })

  await db(config).catch(handleFatalError)
  process.exit(0)
}

const handleFatalError = (err) => {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
