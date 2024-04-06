import colors from 'colors';

const chalk = {
    success: (message: string) => console.log(colors.green.bold(message)),
    error: (message: string) => console.log(colors.red.bold(message)),
    warning: (message: string) => console.log(colors.yellow.bold(message)),
    info: (message: string) => console.log(colors.blue.bold(message)),
    port: (message: string) => console.log(colors.magenta.bold(message)),
};

export default chalk;