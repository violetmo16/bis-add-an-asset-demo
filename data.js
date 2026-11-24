/* Sample data for the Flow 1 demo. Vehicles list values copied from the Figma frames (as of 2026/10/10). */
window.DEMO = {
  CATS: [
    { id: 'vehicles', label: 'Vehicles', types: ['Truck', 'SUV', 'Van', 'Car'] },
    { id: 'heavy', label: 'Heavy Equipment', types: ['Excavator', 'Backhoe', 'Boom Lift', 'Forklift', 'Skid Steer'] },
    { id: 'safety', label: 'Safety Equipment', types: ['Gas Detector', 'AED', 'Fire Extinguisher', 'Fall Protection', 'Eyewash Station'] }
  ],
  DEACT: { vehicles: 1, heavy: 1, safety: 1 },
  NOUN: { vehicles: 'vehicles', heavy: 'heavy equipment assets', safety: 'safety equipment assets' },
  // Existing Heavy and Safety assets (from the prototype sample data, forms lines counted to 2026/10/10)
  HEAVY: [
    { id: 'h01', cat: 'heavy', name: 'Bobcat S650 Skid Steer', type: 'Skid Steer', status: 'Active', make: 'Bobcat S650', colour: '', formsText: 'No forms yet', formsMeta: 'No inspections on record' },
    { id: 'h02', cat: 'heavy', name: 'CAT 320 Excavator', type: 'Excavator', status: 'Active', make: 'Caterpillar 320 GC', colour: 'Yellow', formsText: '1 form in progress', formsMeta: 'Sent today' },
    { id: 'h03', cat: 'heavy', name: 'Genie S-65 Boom Lift', type: 'Boom Lift', status: 'Active', make: 'Genie S-65 XC', colour: 'Orange', formsText: 'No forms in progress', formsMeta: 'Last completed 2026/10/09' },
    { id: 'h04', cat: 'heavy', name: 'John Deere 310SL Backhoe', type: 'Backhoe', status: 'Needs Inspection', make: 'John Deere 310SL', colour: 'Green', formsText: '1 form in progress', formsMeta: 'Sent 25 days ago' },
    { id: 'h05', cat: 'heavy', name: 'Toyota 8FGU25 Forklift', type: 'Forklift', status: 'Out of Service', make: 'Toyota 8FGU25', colour: 'Red', formsText: '2 forms in progress', formsMeta: 'Oldest sent 1 day ago' }
  ],
  SAFETY: [
    { id: 's01', cat: 'safety', name: 'Eyewash Station - Shop', type: 'Eyewash Station', status: 'Active', make: 'Bradley S19-224', colour: '', formsText: 'No forms yet', formsMeta: 'No inspections on record' },
    { id: 's02', cat: 'safety', name: 'Fire Extinguisher - Bay 3', type: 'Fire Extinguisher', status: 'Active', make: 'Amerex B500 10 lb ABC', colour: 'Red', formsText: 'No forms in progress', formsMeta: 'Last completed 2026/10/01' },
    { id: 's03', cat: 'safety', name: 'MSA Altair 4XR #G-07', type: 'Gas Detector', status: 'Active', make: 'MSA Altair 4XR', colour: 'Blue', formsText: '1 form in progress', formsMeta: 'Sent today' },
    { id: 's04', cat: 'safety', name: 'AED - Site Office', type: 'AED', status: 'Needs Inspection', make: 'Philips HeartStart FRx', colour: 'Red', formsText: '1 form in progress', formsMeta: 'Sent 9 days ago' },
    { id: 's05', cat: 'safety', name: '3M DBI-SALA Harness H-12', type: 'Fall Protection', status: 'Out of Service', make: '3M DBI-SALA ExoFit NEX', colour: 'Brown', formsText: 'No forms in progress', formsMeta: 'Last completed 2026/10/03' }
  ],
  PAL: { White: '#ffffff', Silver: '#c3c7cc', Grey: '#6e737a', Black: '#1c1c1c', Blue: '#1f5fae', Red: '#c62828', Green: '#2e7d32', Yellow: '#f2b705', Orange: '#ef6c00', Brown: '#6d4c41', Purple: '#6a1b9a' },
  STATUS: {
    'Active': { cls: 'chip-status--success', fg: '#167b00', bg: '#fafff2', sub: '' },
    'Needs Inspection': { cls: 'chip-status--warning', fg: '#a1851f', bg: '#fffcf2', sub: 'Inspect before use' },
    'In Repair': { cls: 'chip-status--repair', fg: '#a85200', bg: '#fff7f0', sub: 'Not usable' },
    'Out of Service': { cls: 'chip-status--error', fg: '#cc2222', bg: '#fff2f2', sub: 'Do not use' }
  },
  ORDER: { 'Active': 0, 'Needs Inspection': 1, 'In Repair': 2, 'Out of Service': 3 },
  // Existing vehicles. formsText/formsMeta are the lines shown in the Figma list frames.
  VEHICLES: [
    { id: 'v14', name: 'Ford F-150 #14', type: 'Truck', status: 'Active', make: 'Ford F-150 XLT', colour: 'Blue', formsText: '4 forms in progress', formsMeta: 'Oldest sent 181 days ago' },
    { id: 'v31', name: 'Ford Transit Van #31', type: 'Van', status: 'Active', make: 'Ford Transit 250', colour: '', formsText: 'No forms in progress', formsMeta: 'Last completed 2026/10/08' },
    { id: 'v05', name: 'Toyota RAV4 #05', type: 'SUV', status: 'Active', make: 'Toyota RAV4 LE', colour: 'Purple', formsText: 'No forms yet', formsMeta: 'No inspections on record' },
    { id: 'v09', name: 'Toyota Tacoma #09', type: 'Truck', status: 'Needs Inspection', make: 'Toyota Tacoma SR5', colour: 'Green', formsText: '2 forms in progress', formsMeta: 'Oldest sent 9 days ago' },
    { id: 'v18', name: 'Chevrolet Silverado 2500HD #18', type: 'Truck', status: 'In Repair', make: 'Chevrolet Silverado 2500HD', colour: 'Red', formsText: '1 form in progress', formsMeta: 'Sent today' },
    { id: 'v22', name: 'Ram 1500 #22', type: 'Truck', status: 'Out of Service', make: 'Ram 1500 Big Horn', colour: 'Purple', formsText: '4 forms in progress', formsMeta: 'Oldest sent 181 days ago' }
  ]
};
