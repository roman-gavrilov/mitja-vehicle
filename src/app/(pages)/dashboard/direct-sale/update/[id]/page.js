"use client";
import { useParams } from 'next/navigation';
import CarInfoForm from '../CarInfoForm';

export default function CarPage() {
  const params = useParams();
  const { id } = params;

  return (
    <CarInfoForm carId={id} />
  );
}