import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {


  const payload = await getPayload({
    config: configPromise
  });

  const { docs: data } = await payload.find({
    collection: "categories"
  })∏



  return (
    <div>

    </div>
  );
}
