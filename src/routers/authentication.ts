import {Router} from "express";
import {register} from "../features/authentication/register/registerController";
import {login} from "../features/authentication/login/loginController";

const authRouter:Router = Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description : Authentification routes
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Register a new user
 *      tags:
 *          - Auth
 *      description: Creates a new user account by accepting user details.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: true
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: johndoe
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: johndoe@example.com
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: mySecurePassword123
 *      responses:
 *          200:
 *              description: User successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  $ref: '#/components/schemas/UserDTO'
 *                              token:
 *                                 type: string
 *                                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *          400:
 *              description: Bad Request - Missing or invalid data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Invalid email, password, name
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Something went wrong
 */
authRouter.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Login a user
 *      tags:
 *          - Auth
 *      description: Authenticates a user and returns a token.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: true
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: johndoe@example.com
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: mySecurePassword123
 *      responses:
 *          200:
 *              description: User successfully authenticated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  $ref: '#/components/schemas/UserDTO'
 *                              token:
 *                                 type: string
 *                                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *          401:
 *              description: Unauthorized - Invalid credentials
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Invalid email or password
 *          400:
 *              description: Bad Request - Missing or invalid data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Email and password are required
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Something went wrong
 */
authRouter.post('/login', login);

export default authRouter;
