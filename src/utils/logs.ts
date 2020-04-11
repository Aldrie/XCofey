/* eslint-disable no-console */
import colors from 'colors';
import HighlightJson from './jsonHighlight';

export const listenLog = (host: string, port?: number): void => {
  console.log(colors.rainbow('┌–––––––––––––––––––––––––––––––––––––––––––––––––┐'));
  console.log(`${colors.rainbow('|')}                    ${colors.black.bold('X')}${colors.white('Cofey ☕')}                    ${colors.rainbow('|')}`);
  console.log(colors.rainbow('└–––––––––––––––––––––––––––––––––––––––––––––––––┘'));
  console.log(`\n${colors.bold('Running at')}: ${colors.green(`[${host}${port ? `:${port}` : ''}]`)}\n`);
};

export const requestLog = (method: string, path: string, request?: Object) => {
  const methodColors = {
    GET: {
      bg: colors.bgBlue.white,
      fg: colors.blue,
    },
    POST: {
      bg: colors.bgGreen.white,
      fg: colors.green,
    },
    PUT: {
      bg: colors.bgYellow.black,
      fg: colors.yellow,
    },
    PATCH: {
      bg: colors.bgCyan.black,
      fg: colors.cyan,
    },
    DELETE: {
      bg: colors.bgRed.white,
      fg: colors.red,
    },
    DEFAULT: {
      bg: colors.bgWhite.black,
      fg: colors.white,
    },
  };

  const { bg, fg } = methodColors[method] ? methodColors[method] : methodColors.DEFAULT;

  console.log(`${bg.bold(` ${method} `)} ${fg(path)}`);
  if (Object.keys(request).length > 0) {
    console.log(`${fg('↓ Request')}\n${HighlightJson(request)}`);
  }
};

export const errorLog = (error: string) => {
  console.error(colors.red(error));
};
