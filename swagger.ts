import swaggerJsDoc from "swagger-jsdoc";
import fs from "fs";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Chat API',
            version: '1.0.0',
            description: 'A simple chat api',
        },
        servers: [
            {
                url: 'http://localhost:8000',
            },
        ],
    },
    apis: ['./src/routers/*.ts', "./src/models/*.ts"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));

export const specs: Object = swaggerJsDoc(swaggerOptions);
