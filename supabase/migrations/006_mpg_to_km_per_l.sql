-- ============================================================
-- Consumi: da mpg a km/l
-- I valori esistenti erano mpg (UK): km/l = mpg * 1.609344 / 4.54609
-- Per le elettriche il consumo ha senso solo in kWh: si azzera.
-- ============================================================

alter table public.cars rename column mpg to km_per_l;

update public.cars
   set km_per_l = null
 where lower(fuel) = 'electric';

update public.cars
   set km_per_l = round((km_per_l * 1.609344 / 4.54609)::numeric, 1)
 where km_per_l is not null;
