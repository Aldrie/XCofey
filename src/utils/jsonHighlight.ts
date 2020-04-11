// thanks https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
import colors from 'colors';

export default function Highlight(json: Object | string) {
  let string = JSON.stringify(typeof json === 'object' ? json : JSON.parse(json), (i, value) => {
    if (value instanceof Array) {
      return JSON.stringify(value).replace(/,/g, ', ');
    }
    return value;
  }, 2).replace(/\\/g, '')
    .replace(/"\[/g, '[')
    .replace(/\]"/g, ']')
    .replace(/"\{/g, '{')
    .replace(/\}"/g, '}');

  string = string.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          return `${colors.cyan(`${match.replace(':', colors.red(':'))}`)}`;
        }
        return colors.yellow(match);
      } if (/true|false/.test(match)) {
        return colors.blue(match);
      }
      if (/null|undefined/.test(match)) {
        return colors.gray(match);
      }
      return colors.blue(match);
    });
  return string;
}
