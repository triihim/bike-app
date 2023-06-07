interface NumberInputProps {
  id: string;
  label: string;
  min: number;
  max: number;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const NumberInput = (props: NumberInputProps) => {
  return (
    <>
      <label htmlFor={props.id}>{props.label}</label>
      <br />
      <input type="number" min={props.min} max={props.max} onChange={props.onChange} />
    </>
  );
};
