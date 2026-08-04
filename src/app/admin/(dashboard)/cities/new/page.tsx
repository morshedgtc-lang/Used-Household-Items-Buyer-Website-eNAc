import { createCity } from "@/features/admin/cities/actions";
import { CityForm } from "@/components/admin/forms/city-form";

export default function NewCityPage() {
  return <CityForm action={createCity} />;
}
