"use client";
import { useParams } from 'next/navigation';
import CarInfoForm from '../CarInfoForm';

export default function CarPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="container mx-auto">
      <CarInfoForm carId={id} />
    </div>
  );
}