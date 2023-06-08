interface SelectInputProps<T> {
  label: string;
  id: string;
  options: Array<T>;
  optionRenderer(option: T): JSX.Element;
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void;
}

export const SelectInput = <T,>(props: SelectInputProps<T>) => {
  return (
    <>
      <label htmlFor={props.id}>{props.label}</label>
      <br />
      <select id={props.id} onChange={props.onChange}>
        <option></option>
        {props.options.map((option) => props.optionRenderer(option))}
      </select>
    </>
  );
};
