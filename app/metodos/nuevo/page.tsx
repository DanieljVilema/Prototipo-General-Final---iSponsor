'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function NuevoMetodoPage() {
  const router = useRouter();
  const { logAudit } = useDemoStore();
  
  const [formData, setFormData] = useState({
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: '',
    nombreTitular: '',
    tipoTarjeta: 'credito'
  });
  
  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validar número de tarjeta (simple simulación)
    if (!formData.numeroTarjeta || formData.numeroTarjeta.replace(/\s/g, '').length < 16) {
      newErrors.numeroTarjeta = 'Número de tarjeta inválido';
    }
    
    // Validar fecha de vencimiento
    if (!formData.fechaVencimiento || !/^\d{2}\/\d{2}$/.test(formData.fechaVencimiento)) {
      newErrors.fechaVencimiento = 'Formato inválido (MM/AA)';
    }
    
    // Validar CVV
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    // Validar nombre
    if (!formData.nombreTitular.trim()) {
      newErrors.nombreTitular = 'Nombre del titular es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    // Remover espacios y caracteres no numéricos
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Agregar espacios cada 4 dígitos
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const detectCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'numeroTarjeta') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'fechaVencimiento') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor corrige los errores en el formulario');
      return;
    }

    // Log audit
    logAudit({
      actor: 'Donador',
      accion: 'Completar datos método de pago',
      entidad: 'metodo_pago',
      resultado: 'Pendiente',
      ref: detectCardBrand(formData.numeroTarjeta)
    });

    showToast('Procesando método de pago...');
    
    // Simular validación y redirección a pasarela
    setTimeout(() => {
      const pasarelaUrl = `/pasarela?context=metodo_pago&cardData=${encodeURIComponent(JSON.stringify({
        brand: detectCardBrand(formData.numeroTarjeta),
        last4: formData.numeroTarjeta.slice(-4),
        type: formData.tipoTarjeta
      }))}`;
      
      router.push(pasarelaUrl);
    }, 1000);
  };

  const cardBrand = detectCardBrand(formData.numeroTarjeta);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Volver a métodos de pago
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agregar Método de Pago</h1>
          <p className="text-gray-600">Ingresa los datos de tu tarjeta de crédito o débito</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de tarjeta
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoTarjeta"
                    value="credito"
                    checked={formData.tipoTarjeta === 'credito'}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoTarjeta: e.target.value }))}
                    className="mr-2"
                  />
                  Crédito
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoTarjeta"
                    value="debito"
                    checked={formData.tipoTarjeta === 'debito'}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoTarjeta: e.target.value }))}
                    className="mr-2"
                  />
                  Débito
                </label>
              </div>
            </div>

            {/* Número de tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.numeroTarjeta}
                  onChange={(e) => handleInputChange('numeroTarjeta', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full p-3 pr-12 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.numeroTarjeta ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
              </div>
              {cardBrand !== 'Tarjeta' && (
                <p className="text-sm text-blue-600 mt-1">{cardBrand} detectada</p>
              )}
              {errors.numeroTarjeta && (
                <p className="text-sm text-red-600 mt-1">{errors.numeroTarjeta}</p>
              )}
            </div>

            {/* Nombre del titular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del titular *
              </label>
              <input
                type="text"
                value={formData.nombreTitular}
                onChange={(e) => handleInputChange('nombreTitular', e.target.value)}
                placeholder="Nombre como aparece en la tarjeta"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nombreTitular ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombreTitular && (
                <p className="text-sm text-red-600 mt-1">{errors.nombreTitular}</p>
              )}
            </div>

            {/* Fecha de vencimiento y CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento *
                </label>
                <input
                  type="text"
                  value={formData.fechaVencimiento}
                  onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fechaVencimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaVencimiento && (
                  <p className="text-sm text-red-600 mt-1">{errors.fechaVencimiento}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <div className="relative">
                  <input
                    type={showCvv ? 'text' : 'password'}
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full p-3 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.cvv && (
                  <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Seguridad y Privacidad</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Tus datos están protegidos con encriptación SSL</li>
                    <li>• No almacenamos tu información de tarjeta</li>
                    <li>• Procesamos pagos a través de pasarelas seguras</li>
                    <li>• Cumplimos con estándares PCI DSS</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors"
              >
                Continuar al pago
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Al continuar, aceptas nuestros términos de servicio y política de privacidad</p>
        </div>
      </div>
    </div>
  );
}
