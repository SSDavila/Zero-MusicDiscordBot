import chalk from 'chalk';

const logger = {
    info: (message) => console.log(chalk.cyan(`[INFO] ${message}`)),
    warn: (message) => console.log(chalk.yellow(`[WARN] ${message}`)),
    error: (message) => console.log(chalk.red(`[ERROR] ${message}`)),
};

export default logger;