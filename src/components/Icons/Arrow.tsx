type ArrowProps = {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
  };
  
  const Arrow = ({ isCollapsed, toggleCollapsed }: ArrowProps) => {
    return (
      <button
        onClick={toggleCollapsed}
        title={isCollapsed ? "Hide Replies" : "Show Replies"}
        className="text-white focus:outline-none"
        aria-label="Toggle replies"
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        )}
      </button>
    );
  };
  
  export default Arrow;
  