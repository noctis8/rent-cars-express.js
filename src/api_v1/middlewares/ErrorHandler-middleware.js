const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: `Something went wrong!! error: ${err}`
        });
    }
}

export default errorHandler;