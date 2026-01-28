export interface ICustomSearchProps<T = unknown> {
  onSearch: (query: string) => Promise<void> | void;
  placeholder: string;
  textExample: string[];
  isDebounced?: boolean;
  disabled?: boolean;
  propsAnimate?: {
    results: T[];
    children: (result: T, index: number) => React.ReactNode;
    childrenButton?: React.ReactNode;
  };
  isSearching?: boolean;
  classNameContainer?: string;
}
