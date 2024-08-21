/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import express, { Request, Response, NextFunction } from 'express'
import logger from 'jet-logger'

import 'express-async-errors'

import BaseRouter from '@/routes'

import Paths from '@/common/Paths'
import EnvVars from '@/common/EnvVars'
import HttpStatusCodes from '@/common/HttpStatusCodes'
import { NodeEnvs } from '@/common/misc'
import compression from 'compression'
import { ConflictErr } from './common/classes'

// **** Variables **** //

const app = express()

// **** Setup **** //

// Basic middleware
app.use(express.json())
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(EnvVars.CookieProps.Secret))

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'))
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet())
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter)

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true)
    }
    let status = HttpStatusCodes.BAD_REQUEST
    if (err instanceof ConflictErr) {
      status = err.status
      err.message = `the field '${err.message}' already exists`
    }

    const json = parseJson(err.message)

    return res.status(status).json({ error: !!json ? json : err.message })
  },
)

function parseJson(str: string) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}

// **** Export default **** //

export default app
