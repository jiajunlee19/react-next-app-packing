// not-found.tsx is rendered when not-found() is being called.

import Page404 from "@/app/_components/page_404";

export default function notFoundPage() {
    return (
        <Page404 errMessage="This page could not be found." />
    );
};