import {z} from "zod"
import { BadRequestError } from "../errors/appError.js"

export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers
        });

        if (result.body) Object.assign(req.body, result.body);
        if (result.params) Object.assign(req.params, result.params);
        if (result.query) Object.assign(req.query, result.query);

        next();
    } catch (error) {
        console.error(error);
        next(new BadRequestError("Request mal formada"));
    }
};