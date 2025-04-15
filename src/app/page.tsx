import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { Textarea } from "~/components/ui/textarea";
export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <Button variant={"elevated"}>Click me</Button>
      </div>
      <div>
        <Input placeholder="Enter your name" />
      </div>
      <div>
        <Progress value={50} />
      </div>
      <div>
        <Textarea placeholder="Enter your message" />
      </div>
      <div>
        <Checkbox />
      </div>
    </div>
  );
}
