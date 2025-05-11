export function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="absolute top-0 bg-red-300 text-white z-40">
      hello{message}
    </div>
  );
}
