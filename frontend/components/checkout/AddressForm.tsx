'use client';

import { useState, useEffect } from 'react';
import allCitiesData from '@/lib/data/data.json';
import { useAuthStore } from '@/lib/stores/authStore';

interface CityData {
  name: string;
  counties: {
    name: string;
    districts: {
      name: string;
      neighborhoods: {
        name: string;
        code: string;
      }[];
    }[];
  }[];
}

interface AddressFormProps {
  onSubmit: (data: AddressData) => void;
}

export interface AddressData {
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  phone: string;
  fullName: string;
}

export default function AddressForm({ onSubmit }: AddressFormProps) {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<AddressData>({
    city: '',
    district: '',
    neighborhood: '',
    address: '',
    phone: '',
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<AddressData>>({});

  // Get cities from JSON - cast the imported data
  const citiesData = allCitiesData as CityData[];
  const cities = citiesData
    .map((city) => city.name)
    .sort((a, b) => a.localeCompare(b, 'tr'));

  // Update districts when city changes
  useEffect(() => {
    if (formData.city) {
      const selectedCity = citiesData.find((city) => city.name === formData.city);

      if (selectedCity) {
        // Get all unique county names (ilçe) from the city
        const uniqueDistricts = selectedCity.counties.map((county) => county.name);
        setDistricts(uniqueDistricts.sort((a, b) => a.localeCompare(b, 'tr')));
        setFormData((prev) => ({ ...prev, district: '', neighborhood: '' }));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.city]);

  // Update neighborhoods when district changes
  useEffect(() => {
    if (formData.city && formData.district) {
      const selectedCity = citiesData.find((city) => city.name === formData.city);

      if (selectedCity) {
        const selectedCounty = selectedCity.counties.find(
          (county) => county.name === formData.district
        );

        if (selectedCounty) {
          // Flatten all neighborhoods from all districts in this county
          const allNeighborhoods: string[] = [];
          selectedCounty.districts.forEach((district) => {
            district.neighborhoods.forEach((neighborhood) => {
              allNeighborhoods.push(neighborhood.name);
            });
          });

          // Remove duplicates and sort
          const uniqueNeighborhoods = [...new Set(allNeighborhoods)].sort((a, b) =>
            a.localeCompare(b, 'tr')
          );

          setNeighborhoods(uniqueNeighborhoods);
          setFormData((prev) => ({ ...prev, neighborhood: '' }));
        } else {
          setNeighborhoods([]);
        }
      }
    } else {
      setNeighborhoods([]);
    }
  }, [formData.city, formData.district]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Phone: only numbers
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '');
    }

    // Full name: only letters and spaces (Turkish characters included)
    if (name === 'fullName') {
      processedValue = value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    // Clear error when user types
    if (errors[name as keyof AddressData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad soyad gerekli';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası gerekli';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }
    if (!formData.city) {
      newErrors.city = 'İl seçin';
    }
    if (!formData.district) {
      newErrors.district = 'İlçe seçin';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adres gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Ad Soyad
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Adınız ve soyadınız"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Telefon Numarası
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="5XX XXX XX XX"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          İl
        </label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">İl seçin</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      {/* District */}
      <div>
        <label
          htmlFor="district"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          İlçe
        </label>
        <select
          id="district"
          name="district"
          value={formData.district}
          onChange={handleChange}
          disabled={!formData.city}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.district ? 'border-red-500' : 'border-gray-300'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">
            {formData.city ? 'İlçe seçin' : 'Önce il seçin'}
          </option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        {errors.district && (
          <p className="text-red-500 text-sm mt-1">{errors.district}</p>
        )}
      </div>

      {/* Neighborhood */}
      <div>
        <label
          htmlFor="neighborhood"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Mahalle
        </label>
        <select
          id="neighborhood"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleChange}
          disabled={!formData.district || neighborhoods.length === 0}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.neighborhood ? 'border-red-500' : 'border-gray-300'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">
            {!formData.district
              ? 'Önce ilçe seçin'
              : neighborhoods.length === 0
              ? 'Mahalle bilgisi bulunamadı'
              : 'Mahalle seçin (opsiyonel)'}
          </option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
        {errors.neighborhood && (
          <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Adres
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Mahalle, sokak, bina no, daire no vb."
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
      >
        Ödemeye Geç
      </button>
    </form>
  );
}
