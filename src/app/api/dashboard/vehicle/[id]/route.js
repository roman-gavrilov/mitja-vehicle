import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = params.id;

  // TODO: Replace this with actual database query
  const vehicle = {
    id: id,
    name: '181',
    make: 'Volkswagen',
    model: '181',
    purchaseDate: 'March 2015',
    annualMileage: '9.000',
    totalMileage: '150.000',
    nextService: '02/2027',
    marketValue: 'Compare',
  };

  return NextResponse.json(vehicle);
}