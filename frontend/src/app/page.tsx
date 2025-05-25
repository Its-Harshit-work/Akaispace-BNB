import Hero from "./section/Hero";
import Why from "./section/Why";
import Applications from "./section/Applications";
import Form from "./section/Form";

export default function Home() {
  return (
    <div className='min-h-screen min-w-screen' >
      <Hero />
      <Why />
      {/* <Component /> */}
      {/* <Testimonials /> */}
      <Applications />
      <Form />
    </div>
  );
}
