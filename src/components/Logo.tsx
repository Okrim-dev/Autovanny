type LogoProps = {
  className?: string;
  withBackground?: boolean;
  title?: string;
};

export default function Logo({
  className = "h-11 w-11",
  withBackground = true,
  title = "AutoVanny",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 447 447"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {withBackground && <rect width="447" height="447" fill="#000000" />}
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M152.7 171 L186.3 171 L231.4 296 L200.3 296 L193.3 275 L144.7 275 L137.7 296 L107.6 296 Z M169 202 L186.3 254 L151.7 254 Z"
      />
      <path
        fill="#CE2C29"
        d="M215.6 200 L250.5 296 L288.9 296 L338.7 150 L308.3 150 L269 266 L247.7 200 Z"
      />
    </svg>
  );
}
