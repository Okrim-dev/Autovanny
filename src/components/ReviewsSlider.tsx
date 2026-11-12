import { getReviews } from "@/lib/data";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} stelle su 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`${star <= rating ? "fas fa-star text-amber-400" : "far fa-star text-zinc-300"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default async function ReviewsSlider() {
  const reviews = await getReviews();

  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Recensioni</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Cosa dicono di noi
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-500">
          La fiducia dei nostri clienti è la nostra migliore garanzia.
        </p>
      </div>

      <div className="mt-10 -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ul className="flex snap-x snap-mandatory gap-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="w-[300px] shrink-0 snap-center sm:w-[380px]"
            >
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-6 text-zinc-600">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-5 border-t border-line pt-4 text-sm font-semibold text-ink">
                  {review.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
