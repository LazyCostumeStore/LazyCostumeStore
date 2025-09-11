import {type ReactNode} from 'react';

type AsideProps = {
  children?: ReactNode;
  heading: ReactNode;
  id: string;
};

export function Aside({children, heading, id}: AsideProps) {
  return (
    <aside className="aside" id={id}>
      <div className="aside-content">
        <header className="aside-header">
          <h3 className="aside-heading">{heading}</h3>
          <CloseAside />
        </header>
        <main className="aside-main">{children}</main>
      </div>
    </aside>
  );
}

function CloseAside() {
  return (
    <a className="aside-close" href="#" aria-label="Close sidebar">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </a>
  );
}