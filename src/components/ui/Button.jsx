function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={"px-4 py-2 rounded-xl text-white bg-secondary hover:bg-secondary-100 transition cursor-pointer " }
    >
      {children}
    </button>
  );
}

export default Button;