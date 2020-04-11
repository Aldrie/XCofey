import { ICreateServerDefaultOptions, ICreateServerOptions } from 'types';

export default function useEnvironment(
  dev: boolean, devOptions: ICreateServerDefaultOptions, options: ICreateServerOptions,
) {
  return (optionField: string) => {
    if (dev) {
      if (devOptions ? devOptions[optionField] : false) {
        return devOptions[optionField];
      }
    }
    return options[optionField];
  };
}
