import { Link } from "react-router-dom";
import type { CarSummary } from "@/types/car";
import { formatHuf } from "@/utils/currency";
import { Card, CardContent } from "@/components/ui/Card";

interface Props {
  car: CarSummary;
}

function CarCard({ car }: Props) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="h-44 w-full bg-slate-200">
        {car.thumbnailUrl ? (
          <img src={car.thumbnailUrl} alt={car.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
        )}
      </div>

      <CardContent className="space-y-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{car.title}</h3>
          <p className="text-2xl font-extrabold text-brand-900">{formatHuf(car.priceHuf)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
          <span>{car.year}</span>
          <span>{car.mileageKm.toLocaleString("hu-HU")} km</span>
          <span>{car.fuelType}</span>
          <span>{car.transmission}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm text-slate-500">{car.location}</span>
          <Link
            to={`/listings/${car.id}`}
            className="btn-base btn-primary btn-sm rounded-full"
          >
            View
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default CarCard;