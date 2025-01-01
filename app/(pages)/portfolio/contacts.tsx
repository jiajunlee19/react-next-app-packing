import ContactForm from "@/app/(pages)/portfolio/contact-form";

export default function Contacts() {

    // mailto:to?cc=cc1,cc2&bcc=bcc&subject=s&body=b
    // linebreak = %0D%0A

    return (
        <section id="contacts" className="scroll-mt-8">
            <h2 className="mt-0">Contact Me</h2>
            <p>Feel free to contact me directly at <a href="mailto:jiajunlee19@gmail.com?subject=%5Bname%5D%20%5BContact%20from%20Portfolio%20%7C%20Jia%20Jun%20Lee%5D">jiajunlee19@gmail.com</a> or through this form below !</p>
            <ContactForm />
        </section>
    );
};