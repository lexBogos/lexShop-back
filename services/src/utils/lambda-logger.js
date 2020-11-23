const argumentsMapper = args => {
    return [...args].map(argument => {
        return typeof argument === 'object' ? JSON.stringify(argument) : argument;
    });
};

export const lambdaLogger = () => ({

    log: function () {
        const args = argumentsMapper(arguments);
        console.log.apply(console, args);
    },
    error: function () {
        const args = argumentsMapper(arguments);
        console.error.apply(console, args)
    },
});