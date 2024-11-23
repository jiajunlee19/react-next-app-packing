import Page404 from "@/app/_components/page_404";

export default function deniedPage() {
    return (
        <Page404 errMessage="Access Denied." />
    );
};