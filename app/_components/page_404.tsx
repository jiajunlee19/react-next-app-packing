type page404Props = {
    errMessage: string;
};

export default function Page404 ({ errMessage }: page404Props) {
    return (
        <div className="h-[100vh] align-middle flex flex-column items-center justify-center gap-4">
            <span className="font-semibold">404</span>
            <span>|</span>
            <span className="font-semibold" >{errMessage}</span>
        </div>
    );
};