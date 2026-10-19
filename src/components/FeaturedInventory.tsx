import CarCard from "./CarCard";
import SectionHeading from "./SectionHeading";
import { getFeaturedCars } from "@/lib/data";
import { bricks } from "@/lib/site";

export default async function FeaturedInventory() {
  const cars = await getFeaturedCars(bricks.featuredLimit);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="In evidenza"
          title="Modelli selezionati a mano"
          subtitle="Modelli scelti uno a uno che rispettano i nostri standard più alti."
        />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}