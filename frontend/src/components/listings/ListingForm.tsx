import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import type { ListingCreateRequest, ListingResponse, ListingUpdateRequest } from "@/types/listings";

export interface ListingFormValues {
  title: string;
  description: string;
  price: string;
  brand: string;
  model: string;
  manufactureYear: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  engineSize: string;
  horsepower: string;
  location: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
}

export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>>;

interface ListingFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<ListingFormValues>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (payload: ListingCreateRequest | ListingUpdateRequest) => Promise<void>;
}

const initialFormValues: ListingFormValues = {
  title: "",
  description: "",
  price: "",
  brand: "",
  model: "",
  manufactureYear: "",
  mileage: "",
  fuelType: "",
  transmission: "",
  bodyType: "",
  color: "",
  engineSize: "",
  horsepower: "",
  location: "",
  sellerName: "",
  sellerPhone: "",
  sellerEmail: ""
};

export function mapListingToFormValues(listing: ListingResponse): ListingFormValues {
  return {
    title: listing.title || `${listing.brand} ${listing.model}`,
    description: listing.description,
    price: String(listing.price ?? ""),
    brand: listing.brand,
    model: listing.model,
    manufactureYear: String(listing.manufactureYear ?? ""),
    mileage: String(listing.mileage ?? ""),
    fuelType: listing.fuelType,
    transmission: listing.transmission,
    bodyType: listing.bodyType,
    color: listing.color || "",
    engineSize: listing.engineSize != null ? String(listing.engineSize) : "",
    horsepower: listing.horsepower != null ? String(listing.horsepower) : "",
    location: listing.location,
    sellerName: listing.sellerName,
    sellerPhone: listing.sellerPhone || "",
    sellerEmail: listing.sellerEmail || ""
  };
}

function ListingForm({ mode, initialValues, isSubmitting = false, submitLabel, onSubmit }: ListingFormProps) {
  const [values, setValues] = useState<ListingFormValues>({ ...initialFormValues, ...initialValues });
  const [errors, setErrors] = useState<ListingFormErrors>({});

  useEffect(() => {
    setValues({ ...initialFormValues, ...initialValues });
    setErrors({});
  }, [initialValues]);

  const resolvedSubmitLabel = useMemo(() => {
    if (submitLabel) {
      return submitLabel;
    }
    return mode === "create" ? "Hirdetés létrehozása" : "Változások mentése";
  }, [mode, submitLabel]);

  function updateField<K extends keyof ListingFormValues>(field: K, value: ListingFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(nextValues: ListingFormValues): ListingFormErrors {
    const nextErrors: ListingFormErrors = {};

    const requiredFields: Array<keyof ListingFormValues> = [
      "title",
      "description",
      "price",
      "brand",
      "model",
      "manufactureYear",
      "mileage",
      "fuelType",
      "transmission",
      "bodyType",
      "color",
      "engineSize",
      "horsepower",
      "location",
      "sellerName",
      "sellerPhone",
      "sellerEmail"
    ];

    requiredFields.forEach((field) => {
      if (!nextValues[field].trim()) {
        nextErrors[field] = "Ez a mező kötelező.";
      }
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nextValues.sellerEmail && !emailPattern.test(nextValues.sellerEmail)) {
      nextErrors.sellerEmail = "Adj meg egy érvényes e-mail címet.";
    }

    if (nextValues.price && Number(nextValues.price) < 0) {
      nextErrors.price = "Az árnak legalább 0-nak kell lennie.";
    }

    if (nextValues.manufactureYear) {
      const year = Number(nextValues.manufactureYear);
      if (year < 1900 || year > 2100) {
        nextErrors.manufactureYear = "Az évjáratnak 1900 és 2100 között kell lennie.";
      }
    }

    if (nextValues.mileage && Number(nextValues.mileage) < 0) {
      nextErrors.mileage = "A futásteljesítmény legalább 0 kell legyen.";
    }

    if (nextValues.engineSize && Number(nextValues.engineSize) < 0) {
      nextErrors.engineSize = "A hengerűrtartalom legalább 0 kell legyen.";
    }

    if (nextValues.horsepower && Number(nextValues.horsepower) < 1) {
      nextErrors.horsepower = "A lóerő legalább 1 kell legyen.";
    }

    return nextErrors;
  }

  function buildRequestPayload(formValues: ListingFormValues): ListingCreateRequest {
    return {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      price: Number(formValues.price),
      brand: formValues.brand.trim(),
      model: formValues.model.trim(),
      manufactureYear: Number(formValues.manufactureYear),
      mileage: Number(formValues.mileage),
      fuelType: formValues.fuelType.trim(),
      transmission: formValues.transmission.trim(),
      bodyType: formValues.bodyType.trim(),
      color: formValues.color.trim(),
      engineSize: Number(formValues.engineSize),
      horsepower: Number(formValues.horsepower),
      location: formValues.location.trim(),
      sellerName: formValues.sellerName.trim(),
      sellerPhone: formValues.sellerPhone.trim(),
      sellerEmail: formValues.sellerEmail.trim()
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = buildRequestPayload(values);
    await onSubmit(mode === "create" ? payload : payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField id="title" label="Cím" value={values.title} onChange={(event) => updateField("title", event.target.value)} error={errors.title} required />
        <InputField id="brand" label="Márka" value={values.brand} onChange={(event) => updateField("brand", event.target.value)} error={errors.brand} required />
        <InputField id="model" label="Modell" value={values.model} onChange={(event) => updateField("model", event.target.value)} error={errors.model} required />
        <InputField id="price" label="Ár" type="number" value={values.price} onChange={(event) => updateField("price", event.target.value)} error={errors.price} required />
        <InputField id="manufactureYear" label="Évjárat" type="number" value={values.manufactureYear} onChange={(event) => updateField("manufactureYear", event.target.value)} error={errors.manufactureYear} required />
        <InputField id="mileage" label="Futásteljesítmény (km)" type="number" value={values.mileage} onChange={(event) => updateField("mileage", event.target.value)} error={errors.mileage} required />

        <div>
          <label htmlFor="fuelType" className="label-base">Üzemanyag</label>
          <select id="fuelType" className="input-base" value={values.fuelType} onChange={(event) => updateField("fuelType", event.target.value)}>
            <option value="">Válassz üzemanyagot</option>
            <option value="Petrol">Benzin</option>
            <option value="Diesel">Dízel</option>
            <option value="Hybrid">Hibrid</option>
            <option value="Electric">Elektromos</option>
            <option value="LPG">LPG</option>
          </select>
          {errors.fuelType ? <p className="input-hint text-danger-500">{errors.fuelType}</p> : null}
        </div>

        <div>
          <label htmlFor="transmission" className="label-base">Váltó</label>
          <select id="transmission" className="input-base" value={values.transmission} onChange={(event) => updateField("transmission", event.target.value)}>
            <option value="">Válassz váltót</option>
            <option value="Manual">Kézi</option>
            <option value="Automatic">Automata</option>
          </select>
          {errors.transmission ? <p className="input-hint text-danger-500">{errors.transmission}</p> : null}
        </div>

        <InputField id="bodyType" label="Ajtók száma" value={values.bodyType} onChange={(event) => updateField("bodyType", event.target.value)} error={errors.bodyType} required />
        <InputField id="color" label="Szín" value={values.color} onChange={(event) => updateField("color", event.target.value)} error={errors.color} required />
        <InputField id="engineSize" label="Motor mérete (Liter)" type="number" step="0.1" value={values.engineSize} onChange={(event) => updateField("engineSize", event.target.value)} error={errors.engineSize} required />
        <InputField id="horsepower" label="Lóerő" type="number" value={values.horsepower} onChange={(event) => updateField("horsepower", event.target.value)} error={errors.horsepower} required />
        <InputField id="location" label="Város" value={values.location} onChange={(event) => updateField("location", event.target.value)} error={errors.location} required />
        <InputField id="sellerName" label="Eladó neve" value={values.sellerName} onChange={(event) => updateField("sellerName", event.target.value)} error={errors.sellerName} required />
        <InputField id="sellerPhone" label="Eladó telefonszáma" value={values.sellerPhone} onChange={(event) => updateField("sellerPhone", event.target.value)} error={errors.sellerPhone} required />
        <InputField id="sellerEmail" label="Eladó e-mail címe" type="email" value={values.sellerEmail} onChange={(event) => updateField("sellerEmail", event.target.value)} error={errors.sellerEmail} required />
      </div>

      <div>
        <label htmlFor="description" className="label-base">Leírás</label>
        <textarea id="description" className="input-base min-h-36" value={values.description} onChange={(event) => updateField("description", event.target.value)} />
        {errors.description ? <p className="input-hint text-danger-500">{errors.description}</p> : null}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mentés..." : resolvedSubmitLabel}
        </Button>
      </div>
    </form>
  );
}

export default ListingForm;