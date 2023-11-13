// not-found.tsx is rendered when not-found() is being called.

export default function notFoundPage() {
    return (
        <div className="h-[100vh] align-middle flex flex-column items-center justify-center gap-4">
            <span className="font-semibold">404</span>
            <span>|</span>
            <span className="font-semibold" >This page could not be found.</span>
        </div>
    );
};