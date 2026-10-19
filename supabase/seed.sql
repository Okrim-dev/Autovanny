-- ============================================================
-- Autovanny — Dati di esempio (seed)
-- Eseguire DOPO schema.sql
-- ============================================================

insert into public.cars (
  slug, brand, model, trim, title, year, price, currency, mileage,
  fuel, transmission, body_style, engine, bhp, mpg,
  certified, featured, stock, description, exterior_color,
  deposit, monthly_note, specs, images
) values
(
  'audi-a6-avant-3-0-tdi-quattro',
  'Audi', 'A6 Avant', '3.0 TDI quattro Tiptronic', 'Audi A6 Avant',
  2021, 42900, 'GBP', 28000,
  'Diesel', 'Automatic', 'Estate', '3.0 TDI', 282, 47,
  true, true, true,
  'Premium executive estate with quattro all-wheel drive, full dealer history and accident-free guarantee.',
  'Daytona Grey', 179, 'From £512/mo with PCP',
  '{"Doors":"5","Seats":"5","Drive":"Quattro 4WD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'bmw-m4-competition-m-xdrive-coupe',
  'BMW', 'M4 Competition', 'M xDrive Coupe', 'BMW M4 Competition',
  2022, 78500, 'GBP', 9500,
  'Petrol', 'Automatic', 'Coupe', '3.0 TwinPower Turbo', 510, 30,
  true, true, true,
  'Stunning high-performance coupe in an eye-catching spec, with adaptive M suspension and M Driver''s Package.',
  'Isle of Man Green', 179, 'From £819/mo with PCP',
  '{"Doors":"2","Seats":"4","Drive":"M xDrive 4WD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'audi-q5-40-tdi-quattro-s-line',
  'Audi', 'Q5', '40 TDI Quattro S Line 5dr S Tronic', 'Audi Q5',
  2022, 41950, 'GBP', 15000,
  'Diesel', 'Automatic', 'SUV', '2.0 TDI', 201, 42,
  true, false, true,
  'S Line SUV with quattro, virtual cockpit and panoramic sunroof. One previous owner.',
  'Navarra Blue', 179, 'From £499/mo with PCP',
  '{"Doors":"5","Seats":"5","Drive":"Quattro 4WD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'bmw-3-series-320i-m-sport',
  'BMW', '3 Series', '320i M Sport 4dr Step Auto', 'BMW 3 Series',
  2021, 28950, 'GBP', 22400,
  'Petrol', 'Automatic', 'Saloon', '2.0 Petrol', 184, 44,
  false, false, true,
  'Executive saloon finished in Alpine White with M Sport styling pack and harman/kardon audio.',
  'Alpine White', 179, 'From £349/mo with PCP',
  '{"Doors":"4","Seats":"5","Drive":"RWD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'mercedes-benz-c-class-c220d-amg-line',
  'Mercedes-Benz', 'C-Class', 'C220d AMG Line Premium 5dr 9G-Tronic', 'Mercedes-Benz C-Class',
  2023, 36500, 'GBP', 8100,
  'Diesel', 'Automatic', 'Saloon', '2.0 CDI', 200, 52,
  true, true, true,
  'Near-new C220d in AMG Line Premium trim with MBUX infotainment and 360-degree camera.',
  'Polar White', 179, 'From £449/mo with PCP',
  '{"Doors":"4","Seats":"5","Drive":"RWD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'audi-a4-avant-2-0-tdi-s-line',
  'Audi', 'A4 Avant', '2.0 TDI S line S Tronic 5dr', 'Audi A4 Avant',
  2021, 28450, 'GBP', 22500,
  'Diesel', 'Automatic', 'Estate', '2.0 TDI', 190, 50,
  true, true, true,
  'S line estate in brilliant black with S Tronic, full Audi service history and recent MOT.',
  'Brilliant Black', 179, 'From £345/mo with PCP',
  '{"Doors":"5","Seats":"5","Drive":"FWD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'porsche-911-carrera',
  'Porsche', '911 Carrera', '3.0 Carrera 2dr PDK', 'Porsche 911 Carrera',
  2022, 89950, 'GBP', 6200,
  'Petrol', 'Automatic', 'Coupe', '3.0 Twin-Turbo', 385, 28,
  true, false, true,
  'Iconic 992-generation 911 Carrera finished in Guards Red with Sport Chrono package.',
  'Guards Red', 179, 'From £1,049/mo with PCP',
  '{"Doors":"2","Seats":"4","Drive":"RWD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'mercedes-benz-e-class-e300de',
  'Mercedes-Benz', 'E-Class', 'E300de AMG Line 4dr G-Tronic', 'Mercedes-Benz E-Class',
  2022, 46500, 'GBP', 18500,
  'Diesel', 'Automatic', 'Saloon', '2.0 Diesel Hybrid', 306, 168,
  true, false, true,
  'Plug-in hybrid executive saloon with panoramic roof, memory seats and head-up display.',
  'Obsidian Black', 179, 'From £549/mo with PCP',
  '{"Doors":"4","Seats":"5","Drive":"RWD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1600&auto=format&fit=crop'
  ]
)
on conflict (slug) do nothing;

insert into public.articles (
  slug, title, excerpt, content, category, cover_image, author, published_at, visible
) values
(
  'how-to-choose-your-next-pcp-finance',
  'How to choose your next PCP finance plan',
  'Our quick guide to understanding deposits, monthly payments and what really matters when spreading the cost of your next car.',
  E'PCP (Personal Contract Purchase) lets you spread the cost of a vehicle over a fixed term while keeping your monthly payments lower.\n\nA deposit is typically 10% of the vehicle price and is fully refundable if you decide not to proceed at the point of order. At Autovanny we hold a part-exchange and order deposit of just £179.\n\nAt the end of the agreement you have three options: pay the balloon payment to own the car outright, return it, or part-exchange it against a brand-new vehicle.\n\nAlways check the guaranteed minimum future value and total amount payable before signing.',
  'Financing',
  'https://images.unsplash.com/photo-1553440569-b97c935aab37?q=80&w=1600&auto=format&fit=crop',
  'Autovanny Team', '2024-05-20T09:00:00Z', true
),
(
  'the-150-point-inspection-explained',
  'The 150-point inspection explained',
  'Every vehicle that joins our showroom passes a rigorous multi-stage quality check. Here''s what our technicians actually look at.',
  E'Before a car reaches our showroom floor it completes a 150-point inspection carried out by our certified technicians.\n\nWe verify the body panels, paint thickness and accident history. We lift every vehicle and inspect suspension, brakes, steering and driveline components.\n\nAll fluids, filters and tyres are checked, and the electronic systems — from engine management to sensors and driver assistance — are scanned for fault codes.\n\nFinally, a full road test verifies performance, gearbox behaviour and NVH (noise, vibration, harshness) levels.',
  'Guarantees',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1600&auto=format&fit=crop',
  'Autovanny Team', '2024-04-18T09:00:00Z', true
),
(
  'free-valuation-trade-in-guide',
  'Sell or part-exchange: a free valuation guide',
  'Thinking of upgrading? Learn how our valuation team prices your current car and how to maximise its part-exchange value.',
  E'Your car''s value depends on age, mileage, condition and service history. We provide free, no-obligation valuations both online and in-branch.\n\nA full service history, complete with stamps and receipts, can add real value. Keep the car clean and take good photos — first impressions matter.\n\nMinor stone chips and alloy scuffs are normal wear; we don''t penalise them, but significant bodywork damage will be reflected in the offer.\n\nOnce quoted, your part-exchange value is held firm for 14 days.',
  'Valuation',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1600&auto=format&fit=crop',
  'Autovanny Team', '2024-03-25T09:00:00Z', true
)
on conflict (slug) do nothing;

-- Aggiorna la vetrina (featured) e aggiunge convertible + elettrica per le categorie
update public.cars set featured = true
where slug in ('audi-q5-40-tdi-quattro-s-line', 'porsche-911-carrera');

insert into public.cars (
  slug, brand, model, trim, title, year, price, currency, mileage,
  fuel, transmission, body_style, engine, bhp, mpg,
  certified, featured, stock, description, exterior_color,
  deposit, monthly_note, specs, images
) values
(
  'audi-a5-cabriolet-2-0-tfsi-s-line',
  'Audi', 'A5 Cabriolet', '2.0 TFSI S line S Tronic 2dr', 'Audi A5 Cabriolet',
  2021, 36950, 'GBP', 18200,
  'Petrol', 'Automatic', 'Convertible', '2.0 TFSI', 204, 39,
  true, false, true,
  'Open-top elegance in metallic grey with heated seats, matrix LED headlights and B&O sound system.',
  'Daytona Grey', 179, 'From £399/mo with PCP',
  '{"Doors":"2","Seats":"4","Drive":"FWD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1553440569-b97c935aab37?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop'
  ]
),
(
  'audi-e-tron-gt-quattro',
  'Audi', 'e-tron GT', 'e-tron GT quattro 4dr', 'Audi e-tron GT',
  2023, 72500, 'GBP', 4200,
  'Electric', 'Automatic', 'Saloon', 'Dual-motor EV', 476, 240,
  true, false, true,
  'Fully electric grand tourer with a real-world range of over 280 miles and a rapid-charging 270kW system.',
  'Daytona Grey', 179, 'From £799/mo with PCP',
  '{"Doors":"4","Seats":"4","Drive":"Quattro 4WD"}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553440569-b97c935aab37?q=80&w=1600&auto=format&fit=crop'
  ]
)
on conflict (slug) do nothing;