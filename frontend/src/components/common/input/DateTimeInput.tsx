interface DateTimeInputProps {
  id: string;
  label: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const DateTimeInput = (props: DateTimeInputProps) => {
  return (
    <>
      <label htmlFor={props.id}>{props.label}</label>
      <br />
      <input id={props.id} type="datetime-local" onChange={props.onChange} />
    </>
  );
};
