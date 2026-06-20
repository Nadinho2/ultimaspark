export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-spark to-growth p-0.5 shadow-sm shadow-spark/20">
        <span className="flex h-full w-full items-center justify-center rounded-[7px] bg-bg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
              fill="url(#logo-gradient)"
              stroke="url(#logo-gradient)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="logo-gradient" x1="4" y1="2" x2="21" y2="22">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </span>
      <span className="text-base font-bold tracking-tight text-text-primary">
        Ultima
        <span className="bg-gradient-to-r from-spark to-growth bg-clip-text text-transparent">
          Spark
        </span>
        <span className="ml-1 text-sm font-medium text-text-secondary">
          Academy
        </span>
      </span>
    </span>
  );
}
