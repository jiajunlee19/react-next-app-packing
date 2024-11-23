import Page404 from "@/app/_components/page_404";

export default function tooManyRequestsPage() {
    return (
        <Page404 errMessage="Too many requests, try again later." />
    );
};