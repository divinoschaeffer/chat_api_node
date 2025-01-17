import swaggerJsDoc from "swagger-jsdoc";

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

export const specs: Object = swaggerJsDoc(swaggerOptions);
