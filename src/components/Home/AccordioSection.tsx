import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordioSection = () => {
  return (
    <div className="w-1/2 mx-auto mt-5">
      <h3 className="text-3xl text-center font-bold">Frequently Asked Questions</h3>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What are the visiting hours?</AccordionTrigger>
          <AccordionContent>
            Visiting hours are from 10:00 AM to 8:00 PM every day. Please check with specific departments for exceptions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I book an appointment?</AccordionTrigger>
          <AccordionContent>
            You can book an appointment online through our website or call our reception desk at +880-XXXX-XXXXXX.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Do you accept health insurance?</AccordionTrigger>
          <AccordionContent>
            Yes, we accept most major health insurance providers. Please bring your insurance card during your visit.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is emergency service available 24/7?</AccordionTrigger>
          <AccordionContent>
            Yes, our emergency department operates 24/7 with full medical support.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordioSection;
