function mongooseValidationEHM(err, req, res, next) {
    try{
        if (err.name === 'ValidationError') {
            console.log("validation error --------------------------------------------------------------------------------------------------------------------------------")
            console.log("validation error --------------------------------------------------------------------------------------------------------------------------------")
            // Mongoose validation error
            const errors = Object.values(err.errors).map(error => error.message);
            // return res.status(400).json({ 
            return res.json({ 
                success: false, 
                message: 'Validation Error', 
                errors 
            });
        }
    
        if (err.code === 11000) {
            console.log("duplicate key error --------------------------------------------------------------------------------------------------------------------------------")
            // Mongoose duplicate key error
            const field = Object.keys(err.keyValue)[0]; // Get the field causing the conflict
            // return res.status(409).json({ 
            return res.json({ 
                success: false, 
                message: `Duplicate key error: The value for '${field}' must be unique.` 
            });
        }
    
        if (err.name === 'CastError') {
            console.log("cast error --------------------------------------------------------------------------------------------------------------------------------")
            // Mongoose type mismatch or invalid ObjectId error
            // return res.status(400).json({ 
            return res.json({ 
                success: false, 
                message: `Invalid value for ${err.path}: ${err.value}.` 
            });
        }
    
        if (err.name === 'MongoServerError' && err.code === 66) {
            // Immutable field update error
            // return res.status(400).json({ 
            return res.json({ 
                success: false, 
                message: 'Attempted to modify an immutable field.' 
            });
        }
    
        if (err.name === 'StrictModeError') {
            // Mongoose strict mode error
            // return res.status(400).json({ 
            return res.json({ 
                success: false, 
                message: `Field '${err.path}' is not allowed in the schema.` 
            });
        }
    
        if (err.name === 'MissingSchemaError') {
            // Missing schema error
            // return res.status(500).json({ 
            return res.json({ 
                success: false, 
                message: 'A required schema is missing for this operation.' 
            });
        }
    
        if (err.name === 'DisconnectedError') {
            // Database connection error
            // return res.status(500).json({ 
            return res.json({ 
                success: false, 
                message: 'Database connection was lost.' 
            });
        }
    
        if (err.name === 'OverwriteModelError') {
            // Mongoose model overwrite error
            // return res.status(500).json({ 
            return res.json({ 
                success: false, 
                message: `Model overwrite error: ${err.message}` 
            });
        }
    
        // Handle generic errors
        // return res.status(500).json({ 
        return res.json({ 
            success: false, 
            message: err.message || 'An unknown error occurred.' 
        });
    }catch(err){
        next(err)
    }
}

module.exports = {mongooseValidationEHM};
