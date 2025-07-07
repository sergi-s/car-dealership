import { Link } from 'react-router-dom';
import { 
  Car, 
  Truck,
  Car as SedanIcon,
  Car as CoupeIcon,
  Car as ConvertibleIcon,
  Car as WagonIcon,
  Car as HatchbackIcon,
  Car as VanIcon,
  Car as AtvIcon,
  Bike as MotorcycleIcon,
  Bus as CamperIcon,
  Truck as CargoVanIcon,
  Bus as MinivanIcon,
  Truck as PickupIcon,
  Truck as CrewCabIcon,
  Truck as ExtendedCabIcon,
  Truck as RegularCabIcon,
  Car as SportUtilityIcon,
  Car as LuxuryIcon,
  Car as ClassicIcon,
  Car as RecreationalIcon,
  Truck as CommercialIcon,
  Car as OtherIcon
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface BodyType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  description: string;
}

const bodyTypes: BodyType[] = [
  { id: 'sedan', name: 'Sedan', icon: SedanIcon, description: 'Classic sedans' },
  { id: 'suv', name: 'SUV', icon: Car, description: 'Sport utility vehicles' },
  { id: 'truck', name: 'Truck', icon: Truck, description: 'Pickup trucks' },
  { id: 'coupe', name: 'Coupe', icon: CoupeIcon, description: 'Sport coupes' },
  { id: 'convertible', name: 'Convertible', icon: ConvertibleIcon, description: 'Convertible cars' },
  { id: 'wagon', name: 'Wagon', icon: WagonIcon, description: 'Station wagons' },
  { id: 'hatchback', name: 'Hatchback', icon: HatchbackIcon, description: 'Hatchback cars' },
  { id: 'van', name: 'Van', icon: VanIcon, description: 'Passenger vans' },
  { id: 'atv', name: 'ATV', icon: AtvIcon, description: 'All-terrain vehicles' },
  { id: 'motorcycle', name: 'Motorcycle', icon: MotorcycleIcon, description: 'Motorcycles' },
  { id: 'camper', name: 'Camper', icon: CamperIcon, description: 'Campers & RVs' },
  { id: 'cargo-van', name: 'Cargo Van', icon: CargoVanIcon, description: 'Cargo vans' },
  { id: 'minivan', name: 'Minivan', icon: MinivanIcon, description: 'Minivans' },
  { id: 'pickup', name: 'Pickup', icon: PickupIcon, description: 'Pickup trucks' },
  { id: 'crew-cab', name: 'Crew Cab', icon: CrewCabIcon, description: 'Crew cab trucks' },
  { id: 'extended-cab', name: 'Extended Cab', icon: ExtendedCabIcon, description: 'Extended cab trucks' },
  { id: 'regular-cab', name: 'Regular Cab', icon: RegularCabIcon, description: 'Regular cab trucks' },
  { id: 'sport-utility', name: 'Sport Utility', icon: SportUtilityIcon, description: 'Sport utility vehicles' },
  { id: 'luxury', name: 'Luxury', icon: LuxuryIcon, description: 'Luxury vehicles' },
  { id: 'classic', name: 'Classic', icon: ClassicIcon, description: 'Classic cars' },
  { id: 'recreational', name: 'Recreational', icon: RecreationalIcon, description: 'Recreational vehicles' },
  { id: 'commercial', name: 'Commercial', icon: CommercialIcon, description: 'Commercial vehicles' },
  { id: 'other', name: 'Other', icon: OtherIcon, description: 'Other vehicles' }
];

const BodyTypeIcons = () => {
  const { theme } = useTheme();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Vehicle Type
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect vehicle for your needs by browsing our different body types
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4 min-w-max">
            {bodyTypes.map((bodyType) => {
              const IconComponent = bodyType.icon;
              return (
                <Link
                  key={bodyType.id}
                  to={`/vehicles/${bodyType.id}`}
                  className="flex flex-col items-center p-4 rounded-lg transition-all duration-200 min-w-[100px] group"
                  style={{
                    borderRadius: theme.borderRadius.lg,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div 
                    className="rounded-full p-4 mb-3 transition-all duration-200"
                                         style={{
                       backgroundColor: theme.colors.primary[100],
                       borderRadius: '50%',
                     }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.primary[200];
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.primary[100];
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <IconComponent 
                      className="h-8 w-8" 
                      style={{
                        color: theme.colors.primary[600],
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center">
                    {bodyType.name}
                  </span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    {bodyType.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BodyTypeIcons; 