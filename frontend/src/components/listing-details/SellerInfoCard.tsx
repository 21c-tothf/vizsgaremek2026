import { Card, CardContent } from "@/components/ui/Card";

interface SellerInfoCardProps {
  sellerName: string;
  sellerEmail?: string;
  location: string;
  showEmail: boolean;
}

function SellerInfoCard({ sellerName, sellerEmail, location, showEmail }: SellerInfoCardProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold text-black">Eladó adatai</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Név:</span> {sellerName}
          </p>
          <p>
            <span className="font-semibold">Helyszín:</span> {location}
          </p>
          <p>
            <span className="font-semibold">E-mail:</span>{" "}
            {showEmail ? (sellerEmail || "-") : "Bejelentkezés után elérhető"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SellerInfoCard;