interface FormErrorProps {
  message: string;
  id?: string;
}

export function FormError({ message, id }: FormErrorProps) {
  return (
    <p id={id} role="alert" className="text-xs text-danger mt-0.5">
      {message}
    </p>
  );
}