export interface IReservation {
  name: string;
  email: string;
  reservationDate: string;
  userId: string;
  owner: string;
  phone?: string;
  $key?: string;
  imageUrl?: string;
}
