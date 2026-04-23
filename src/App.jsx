import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  User, Key, CheckCircle, Mail, Activity, Calculator, PieChart, Utensils, Save, Menu, ChevronRight, ChevronLeft,
  ArrowRight, PlusCircle, ShieldQuestion, X, Zap, BookOpen, Loader2, Printer, Download, FileText, Maximize, Minimize, Lock,
  Database, ExternalLink, Settings, UserSearch, Search, Edit, Camera, Trash2, Upload, RefreshCcw, MapPin, LineChart,
  TestTube, MessageCircle, Clock, CalendarDays, Calendar, Dumbbell, ChevronDown, ChevronUp, DollarSign, ShoppingCart, Hash, BarChart, ShoppingBag, Scan, Tag, Bookmark, FolderOpen
} from 'lucide-react';

// 👇 1. IMPORTAMOS SUPABASE 👇
import { createClient } from '@supabase/supabase-js';

// 👇 2. CONFIGURAMOS TUS CREDENCIALES (¡Cámbialas por las tuyas!) 👇
const supabaseUrl = 'https://kjemhtuleasglgozkjvh.supabase.co'; // <--- PEGA TU URL AQUÍ
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZW1odHVsZWFzZ2xnb3pranZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MTI5NTQsImV4cCI6MjA5MTE4ODk1NH0.yTKlMgQK07LXvC_ajOn8qb25fqGfG8PefJ9q30_L9rQ';     // <--- PEGA TU ANON KEY AQUÍ
export const supabase = createClient(supabaseUrl, supabaseKey);
// 👆 FIN DE LA CONFIGURACIÓN DE SUPABASE 👆

// --- BASE DE DATOS DE EQUIVALENTES (SMAE) ---
const SMAE = {
  verduras: { nombre: 'Verduras', energia: 25, prot: 2, lip: 0, hc: 4 },
  frutas: { nombre: 'Frutas', energia: 60, prot: 0, lip: 0, hc: 15 },
  cereales_sg: { nombre: 'Cereales s/grasa', energia: 70, prot: 2, lip: 0, hc: 15 },
  cereales_cg: { nombre: 'Cereales c/grasa', energia: 115, prot: 2, lip: 5, hc: 15 },
  leguminosas: { nombre: 'Leguminosas', energia: 120, prot: 8, lip: 1, hc: 20 },
  aoa_mbg: { nombre: 'AOA Muy bajo aporte grasa', energia: 40, prot: 7, lip: 1, hc: 0 },
  aoa_bg: { nombre: 'AOA Bajo aporte grasa', energia: 55, prot: 7, lip: 3, hc: 0 },
  aoa_mg: { nombre: 'AOA Moderado aporte grasa', energia: 75, prot: 7, lip: 5, hc: 0 },
  aoa_ag: { nombre: 'AOA Alto aporte grasa', energia: 100, prot: 7, lip: 8, hc: 0 },
  leche_des: { nombre: 'Leche Descremada', energia: 95, prot: 9, lip: 2, hc: 12 },
  leche_semi: { nombre: 'Leche Semidescremada', energia: 110, prot: 9, lip: 4, hc: 12 },
  leche_entera: { nombre: 'Leche Entera', energia: 150, prot: 9, lip: 8, hc: 12 },
  leche_azucar: { nombre: 'Leche c/Azúcar', energia: 200, prot: 8, lip: 5, hc: 30 },
  aceites_sp: { nombre: 'Aceites y grasas s/proteína', energia: 45, prot: 0, lip: 5, hc: 0 },
  aceites_cp: { nombre: 'Aceites y grasas c/proteína', energia: 70, prot: 3, lip: 5, hc: 3 },
  azucares_sg: { nombre: 'Azúcares s/grasa', energia: 40, prot: 0, lip: 0, hc: 10 },
  azucares_cg: { nombre: 'Azúcares c/grasa', energia: 85, prot: 0, lip: 5, hc: 10 },
};

// URLS POR DEFECTO PARA GOOGLE SHEETS Y APPS SCRIPT
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2j-5k3dkvhW_Q-sRCKtmZ-HyP2VbchLM8i9LxRbHZxB28PaRZRxZbrFRBndGTtDQU/exec"; 
const DEFAULT_SHEETS_URL = "https://docs.google.com/spreadsheets/d/13g5sJyJlRa89tbogQ6B1B7zRSMARS29lKc1v3EiAM9w/edit?usp=sharing"; 

// --- CONFIGURACIÓN DE CONTRASEÑA REMOTA (ADMINISTRADOR) ---
const ADMIN_PASSWORD_URL = "https://script.google.com/macros/s/AKfycbxMr55y-fON1UZSGW9jhTMA0MKTrDRxseIClBYmjEgNArSNkUU8rRfJaXUgTdP6yYM/exec"; 
const FALLBACK_PASSWORD = "N1T0180";

// AÑADE ESTA LÍNEA (Cambiarás este valor en cada una de tus 5 copias: ADRIANA, LALO, DIANA, etc.)
const APP_ID ="LALO";

// --- CONFIGURACIÓN DE LA MARCA DE AGUA (AUDITADA A BASE64 PARA EVITAR FALLOS CORS) ---
const WATERMARK_BASE64 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// --- CUESTIONARIO CLÍNICO POR DEFECTO ---
const DEFAULT_MEDICAL_HISTORY = [
  { category: 'Antecedentes', id: 'ht', label: 'Hipertensión Arterial', siNo: '', obs: '' },
  { category: 'Antecedentes', id: 'diab', label: 'Diabetes', siNo: '', obs: '' },
  { category: 'Antecedentes', id: 'asma', label: 'Asma / Problemas Respiratorios', siNo: '', obs: '' },
  { category: 'Antecedentes', id: 'alerg', label: 'Alergias', siNo: '', obs: '' },
  { category: 'Antecedentes', id: 'cirx', label: 'Cirugías previas', siNo: '', obs: '' },
  { category: 'Antecedentes', id: 'otra_ant', label: 'OTRA CONDICIÓN', siNo: '', obs: '' },
  { category: 'Hábitos', id: 'fuma', label: '¿Fuma?', siNo: '', obs: '' },
  { category: 'Hábitos', id: 'alco', label: '¿Consume alcohol?', siNo: '', obs: '' },
  { category: 'Hábitos', id: 'ejer', label: '¿Hace ejercicio?', siNo: '', obs: '' },
  { category: 'Hábitos', id: 'otro_hab', label: 'OTRO HÁBITO', siNo: '', obs: '' },
  { category: 'Familiares', id: 'fam_dh', label: 'Diabetes o Hipertensión en familia', siNo: '', obs: '' },
  { category: 'Familiares', id: 'fam_can', label: 'Cáncer en la familia', siNo: '', obs: '' },
  { category: 'Familiares', id: 'otro_fam', label: 'OTRO ANTECEDENTE FAMILIAR', siNo: '', obs: '' }
];

// --- MARCAS COMERCIALES COMUNES (FASE 4) ---
const COMMON_BRANDS = [
  "Salmas Sanissimo", "Pan Bimbo Cero Cero", "Yoplait Griego Sin Azúcar",
  "Tostadas Charras Horneadas", "Queso Panela Lala Light", "Atún Dolores en Agua",
  "Leche Lala 100 Sin Lactosa", "Tortillas Susalia"
];

// --- OPCIONES DEL MENÚ LATERAL ---
const navItems = [
  { id: 'historia', label: 'Historia Clínica', icon: User },
  { id: 'antropo', label: 'Antropometría', icon: Activity },
  { id: 'get', label: 'Cálculo de Energía', icon: Calculator },
  { id: 'cuadro', label: 'Cuadro Dietosintético', icon: PieChart },
  { id: 'distribucion', label: 'Distribución de Menú', icon: Utensils },
  { id: 'menu', label: 'Menú y Notas', icon: FileText },
];

// ============================================================================
// FUNCIONES Y COMPONENTES INYECTADOS (FASES 1 - 5)
// ============================================================================

export const calculateSomatotype = (measurements) => {
  // Forzamos a que todo se lea como número (Float)
  const talla = parseFloat(measurements.talla) || 1;
  const peso = parseFloat(measurements.peso) || 1;
  
  const tri = parseFloat(measurements.pliegueTri) || 0;
  const sub = parseFloat(measurements.pliegueSub) || 0;
  const supra = parseFloat(measurements.pliegueSupra) || 0;
  
  const diamHumero = parseFloat(measurements.diamHumero) || 0;
  const diamFemur = parseFloat(measurements.diamFemur) || 0;
  const circBrazo = parseFloat(measurements.circBrazo) || 0;
  const circPantorrilla = parseFloat(measurements.circPantorrilla) || 0;

  // Corrección de estatura para Endomorfia
  const sum3 = (tri + sub + supra) * (170.18 / talla);
  
  let endomorphy = -0.7182 + 0.1451 * (sum3) - 0.00068 * Math.pow(sum3, 2) + 0.0000014 * Math.pow(sum3, 3);
  
  // Mesomorfia ( Heath-Carter simplificado )
  let mesomorphy = 0.858 * diamHumero + 0.601 * diamFemur + 0.188 * circBrazo + 0.161 * circPantorrilla - 0.131 * talla + 4.5;
  
  let ponderalIndex = talla / Math.pow(peso, 0.333);
  let ectomorphy = 0;
  if (ponderalIndex >= 40.75) ectomorphy = 0.732 * ponderalIndex - 28.58;
  else if (ponderalIndex > 38.25) ectomorphy = 0.463 * ponderalIndex - 17.63;
  else ectomorphy = 0.1; // Valor mínimo

  return { 
    endomorphy: Math.max(0.1, endomorphy), 
    mesomorphy: Math.max(0.1, mesomorphy), 
    ectomorphy: Math.max(0.1, ectomorphy) 
  };
};

const BusinessDashboard = ({ historyData }) => {
  const monthlyRevenue = historyData.reduce((acc, current) => {
    return acc + (parseFloat(current.finance?.monto) || 0);
  }, 0);
  const activePatientsCount = new Set(historyData.map(p => p.Nombre || p.nombre || p.Name)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-3 shrink-0">
      <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-3 rounded-lg text-white shadow-sm">
        <h4 className="text-xs font-medium opacity-90 flex items-center"><BarChart className="w-3.5 h-3.5 mr-1.5"/> Ingresos del Mes</h4>
        <p className="text-xl font-black mt-1">${monthlyRevenue.toFixed(2)} MXN</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-3 rounded-lg text-white shadow-sm">
        <h4 className="text-xs font-medium opacity-90 flex items-center"><Activity className="w-3.5 h-3.5 mr-1.5"/> Pacientes Activos</h4>
        <p className="text-xl font-black mt-1">{activePatientsCount}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-pink-700 p-3 rounded-lg text-white shadow-sm">
        <h4 className="text-xs font-medium opacity-90 flex items-center"><ShoppingBag className="w-3.5 h-3.5 mr-1.5"/> Retos Activos</h4>
        <p className="text-xl font-black mt-1">1 <span className="text-[10px] font-normal opacity-80">("Reto Salud")</span></p>
      </div>
    </div>
  );
};

const InteractiveCalendar = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-2">
      <h3 className="font-bold flex items-center text-gray-800 mb-4"><Calendar className="w-4 h-4 mr-2 text-purple-500" /> Agenda Semanal</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="font-bold text-gray-500 bg-gray-50 py-1 rounded">{day}</div>
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="h-10 border border-gray-100 rounded hover:bg-purple-50 cursor-pointer p-0.5 flex flex-col justify-end">
             {i === 12 && <div className="bg-purple-500 text-white rounded text-[8px] truncate p-0.5">10:00 Ana</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

function MuroDePago({ children, accesoReal }) {
  // 1. Mientras el sistema consulta a Supabase (Estado inicial)
  if (accesoReal === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="font-black text-emerald-900 animate-pulse uppercase tracking-widest">Verificando Suscripción Pro...</p>
      </div>
    );
  }

  // 2. Si el pago está aprobado, desbloqueamos la App
  if (accesoReal === true) {
    return <>{children}</>;
  }

  // 3. Si no hay pago o el correo no existe en suscripciones, mostramos el muro
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative z-[9999]">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-lg text-center border-t-8 border-blue-600">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tighter">ACCESO RESTRINGIDO</h2>
        <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed">
          Tu suscripción a **Nutri Health Pro** no está activa o el pago está pendiente de procesar.
        </p>
        
        <div className="flex flex-col gap-4">
          <a href="LINK_MERCADO_PAGO_ESTANDAR" target="_blank" className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 py-3 rounded-2xl font-bold hover:bg-gray-100 transition shadow-sm">
            Plan Estándar ($399 MXN)
          </a>
          <a href="LINK_MERCADO_PAGO_PLUS" target="_blank" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 fill-current" /> ADQUIRIR PLAN PLUS ($799 MXN)
          </a>
        </div>
        <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Si ya pagaste, espera 2 minutos y refresca la página.
        </p>
      </div>
    </div>
  );
}

// 👆 HASTA AQUÍ TERMINA EL MURO DE PAGO

// (Tu código actual debe continuar justo aquí abajo así:)
// function MainApp() {
//   const [activeTab, setActiveTab] = useState('historia');
// ...

// --- NUEVO COMPONENTE DE LOGIN ---
const LoginNutriHealth = ({ onComplete, isDarkMode, initialUser }) => {
    const [authMode, setAuthMode] = useState('login'); 
    const [userData, setUserData] = useState(initialUser || { name: '', phone: '', email: '', password: '' });
    
    const [recoveryCode, setRecoveryCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const theme = 'emerald';
    const neutral = 'slate';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (authMode === 'login' || authMode === 'register') {
            if (!userData.email || !userData.password) { setError('Correo y contraseña obligatorios.'); return; }
            if (authMode === 'register' && (!userData.name || !userData.phone)) { setError('Nombre y teléfono obligatorios.'); return; }
            onComplete(userData, setError, setIsLoading);
        } 
        else if (authMode === 'forgot_password') {
            if (!userData.email) { setError('Ingresa tu correo para buscar tu cuenta.'); return; }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setSuccessMsg('Código enviado a tu correo.');
                setAuthMode('verify_code');
            }, 1500);
        }
        else if (authMode === 'verify_code') {
            if (recoveryCode.length !== 6) { setError('El código debe tener 6 dígitos.'); return; }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                if (recoveryCode === '123456') { 
                    setSuccessMsg('Código verificado. Ingresa tu nueva contraseña.');
                    setAuthMode('reset_password');
                } else {
                    setError('Código incorrecto o expirado.');
                }
            }, 1000);
        }
        else if (authMode === 'reset_password') {
            if (newPassword.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setUserData({ ...userData, password: newPassword });
                setSuccessMsg('¡Contraseña actualizada con éxito!');
                setTimeout(() => setAuthMode('login'), 2000);
            }, 1500);
        }
    };

    const cardClass = isDarkMode ? `bg-${neutral}-800 border-${neutral}-700 text-white` : `bg-white border-${neutral}-200 text-${neutral}-800`;
    const inputClass = isDarkMode ? `bg-${neutral}-700 border-${neutral}-600 text-white placeholder-gray-400` : `bg-${neutral}-50 border-${neutral}-200 text-${neutral}-800 placeholder-gray-400`;

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md overflow-hidden ${isDarkMode ? `bg-${neutral}-900/90` : 'bg-emerald-900/95'}`}>
            {!isDarkMode && (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </>
            )}

            <div className={`w-full max-w-sm rounded-[2rem] shadow-2xl flex flex-col border transition-all duration-500 relative z-10 animate-in zoom-in-95 ${cardClass}`}>
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-${theme}-100 rounded-full flex items-center justify-center mx-auto mb-4 text-${theme}-600 shadow-inner`}>
                            {authMode === 'login' ? <Lock size={28} /> : 
                             authMode === 'register' ? <UserCircle2 size={28} /> : 
                             authMode === 'reset_password' ? <CheckCircle2 size={28} /> : <KeyRound size={28} />}
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">
                            NUTRI <span className={`text-${theme}-500`}>HEALTH</span>
                        </h2>
                        <p className="text-sm font-medium opacity-60 mt-1">
                            {authMode === 'login' ? 'Expediente Clínico' : 
                             authMode === 'register' ? 'Registro de Especialista' : 
                             authMode === 'reset_password' ? 'Nueva Contraseña' : 'Recuperación de Acceso'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {(authMode === 'login' || authMode === 'register' || authMode === 'forgot_password') && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                {authMode === 'register' && (
                                    <>
                                        <input type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className={`w-full p-4 rounded-xl border-2 text-center font-medium outline-none focus:border-${theme}-500 focus:ring-4 focus:ring-${theme}-100 ${inputClass}`} placeholder="Nombre Completo" />
                                        <input type="tel" value={userData.phone} onChange={e => setUserData({...userData, phone: e.target.value})} className={`w-full p-4 rounded-xl border-2 text-center font-medium outline-none focus:border-${theme}-500 focus:ring-4 focus:ring-${theme}-100 ${inputClass}`} placeholder="Teléfono" />
                                    </>
                                )}
                                <input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} className={`w-full p-4 rounded-xl border-2 text-center text-lg font-medium outline-none focus:border-${theme}-500 focus:ring-4 focus:ring-${theme}-100 ${inputClass}`} placeholder="Correo Electrónico" disabled={authMode === 'verify_code'} />
                                {(authMode === 'login' || authMode === 'register') && (
                                    <input type="password" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} className={`w-full p-4 rounded-xl border-2 text-center text-xl tracking-widest outline-none focus:border-${theme}-500 focus:ring-4 focus:ring-${theme}-100 ${inputClass}`} placeholder="••••••••" />
                                )}
                            </div>
                        )}

                        {authMode === 'verify_code' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center">
                                <p className="text-xs font-bold text-gray-500 mb-2">Código enviado a:<br/><span className={`text-${theme}-600`}>{userData.email}</span></p>
                                <input type="text" maxLength="6" value={recoveryCode} onChange={e => setRecoveryCode(e.target.value.replace(/\D/g, ''))} className={`w-full p-4 rounded-xl border-2 text-center text-3xl tracking-[0.5em] font-black outline-none focus:border-${theme}-500 focus:ring-4 focus:ring-${theme}-100 ${inputClass}`} placeholder="000000" autoFocus />
                            </div>
                        )}

                        {authMode === 'reset_password' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`w-full p-4 rounded-xl border-2 text-center text-xl tracking-widest outline-none focus:border-${theme}-500 focus:ring-4 focus:ring-${theme}-100 ${inputClass}`} placeholder="Nueva Contraseña" autoFocus />
                            </div>
                        )}
                        
                        {error && <p className="text-red-500 text-sm text-center mt-3 font-bold animate-in slide-in-from-top-1">{error}</p>}
                        {successMsg && <p className="text-emerald-600 text-sm text-center mt-3 font-bold animate-in slide-in-from-top-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">{successMsg}</p>}
                        
                        <button type="submit" disabled={isLoading} className={`w-full py-4 mt-2 bg-${theme}-600 hover:bg-${theme}-700 text-white font-bold rounded-xl shadow-lg shadow-${theme}-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70`}>
                            {isLoading ? 'Procesando...' : authMode === 'login' ? 'Ingresar al Sistema' : authMode === 'register' ? 'Crear Cuenta' : authMode === 'forgot_password' ? 'Enviar Código' : authMode === 'verify_code' ? 'Verificar Código' : 'Guardar y Entrar'} 
                            {!isLoading && <ArrowRight size={20}/>}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-gray-100/20 pt-4 flex flex-col gap-3">
                        {authMode === 'login' && <button type="button" onClick={() => {setAuthMode('forgot_password'); setError(''); setSuccessMsg('');}} className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">¿Olvidaste tu contraseña?</button>}
                        {(authMode === 'forgot_password' || authMode === 'verify_code' || authMode === 'register') && <button type="button" onClick={() => {setAuthMode('login'); setError(''); setSuccessMsg(''); setRecoveryCode('');}} className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">← Volver al inicio de sesión</button>}
                        {authMode === 'login' && <div className="text-xs font-medium opacity-60 mt-2">¿No tienes cuenta? <button onClick={() => {setAuthMode('register'); setError('');}} className={`ml-1 font-bold text-${theme}-500 hover:text-${theme}-600 hover:underline`}>Regístrate</button></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

function MainApp({ externoEmail }) { // Recibimos el email del login aquí
  const [activeTab, setActiveTab] = useState('historia');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 👇 ESTADOS DE CONTROL DE ACCESO (Sincronizados con Supabase)
  const [accesoPermitido, setAccesoPermitido] = useState(null); 
  const [usuarioEmail, setUsuarioEmail] = useState(externoEmail || ""); 

  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

// 🛡️ 2. FUNCIÓN DE VALIDACIÓN (Llave Maestra + Prueba 14 Días)
  const verificarAcceso = async (emailAValidar) => {
    if (!emailAValidar) return;
    
    const correoLimpio = emailAValidar.trim().toLowerCase();
    const MI_LLAVE_MAESTRA = "n1to@gmail.com".toLowerCase(); 

    console.log("🛠️ Validando acceso para:", correoLimpio);

    // ESCENARIO 1: ALEX (Llave Maestra, pase VIP infinito)
    if (correoLimpio === MI_LLAVE_MAESTRA) {
      console.log("🔓 LLAVE MAESTRA RECONOCIDA.");
      setAccesoPermitido(true);
      setHasPlusPlan(true);
      return;
    }

    // ESCENARIO 2: Verificamos en Supabase si ya pagó
    try {
      const { data } = await supabase
        .from('suscripciones')
        .select('estado_pago')
        .eq('correo_nutriologo', correoLimpio)
        .eq('estado_pago', 'approved')
        .single();

      if (data) {
        console.log("✅ Suscripción activa encontrada en Supabase.");
        setAccesoPermitido(true);
        setHasPlusPlan(true);
        return;
      }
    } catch (err) {
      console.log("ℹ️ No hay suscripción de pago en Supabase. Evaluando prueba gratuita...");
    }

    // ESCENARIO 3: Prueba gratuita de 14 días (Local)
    const registroKey = `fecha_registro_${correoLimpio}`;
    let fechaInicioPrueba = localStorage.getItem(registroKey);

    if (!fechaInicioPrueba) {
      fechaInicioPrueba = new Date().toISOString();
      localStorage.setItem(registroKey, fechaInicioPrueba);
    }

    const fechaInicio = new Date(fechaInicioPrueba);
    const hoy = new Date();
    const diasTranscurridos = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
    const diasRestantes = 14 - diasTranscurridos;

    if (diasRestantes > 0) {
      console.log(`🎁 Usuario en prueba gratuita. Le quedan ${diasRestantes} días.`);
      setAccesoPermitido(true);
      setHasPlusPlan(true);
    } else {
      console.log("❌ Prueba gratuita de 14 días terminada.");
      setAccesoPermitido(false);
    }
  };

  // --- ESTADOS DE CALENDARIO GENERAL ---
  const [showCalendarConfirm, setShowCalendarConfirm] = useState(false);
  const [isCalendarLinked, setIsCalendarLinked] = useState(() => localStorage.getItem('nutri_calendar_linked') === 'true');

  // --- ESTADO DE PLAN PLUS ---
  const [hasPlusPlan, setHasPlusPlan] = useState(false); // Iniciamos en false hasta validar pago

  // --- ESTADOS DE LA BIBLIOTECA DE RUTINAS ---
  const [selectedFolder, setSelectedFolder] = useState('PIERNA');
  const [newRoutineName, setNewRoutineName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [expandedTemplates, setExpandedTemplates] = useState({}); 
  
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [workoutLibrary, setWorkoutLibrary] = useState(() => {
    const cached = localStorage.getItem('nutri_workout_library_v4');
    return cached ? JSON.parse(cached) : {
      'PIERNA': [], 'BRAZO': [], 'ESPALDA': [], 'PECHO': [], 'GENERAL': []
    };
  });

  const [aiMode, setAiMode] = useState('rapido');
  const [aiSelectedGoal, setAiSelectedGoal] = useState('(Usar motivo de consulta general)');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  // --- ESTADOS DE CONFIGURACIÓN (Settings) ---
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [scriptUrl, setScriptUrl] = useState(() => localStorage.getItem('nutri_scriptUrl') || DEFAULT_SCRIPT_URL);
  const [sheetsUrl, setSheetsUrl] = useState(() => localStorage.getItem('nutri_sheetsUrl') || DEFAULT_SHEETS_URL);
  const [professionalName, setProfessionalName] = useState(() => localStorage.getItem('nutri_professionalName') || 'NUTRIOLOGO');
  const [location, setLocation] = useState(() => localStorage.getItem('nutri_location') || 'Guadalajara, Jalisco, México');
  const [onboardingUrl, setOnboardingUrl] = useState(() => localStorage.getItem('nutri_onboardingUrl') || '');
  
  const [tempScriptUrl, setTempScriptUrl] = useState('');
  const [tempSheetsUrl, setTempSheetsUrl] = useState('');
  const [tempProfessionalName, setTempProfessionalName] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempOnboardingUrl, setTempOnboardingUrl] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // --- SINCRONIZACIÓN DE RUTINAS ---
  const [isSyncingRoutines, setIsSyncingRoutines] = useState(false);

  const syncRoutinesToSheets = async (dataToSave) => {
    if (!scriptUrl || scriptUrl.includes("TU_URL_DE_GOOGLE")) return;
    const lib = (dataToSave && !dataToSave.nativeEvent && !dataToSave.type) ? dataToSave : workoutLibrary;
    setIsSyncingRoutines(true);
    try {
      const payload = { action: 'saveRoutines', routinesJSON: JSON.stringify(lib) };
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      console.log("☁️ Sincronización exitosa.");
    } catch (error) {
      console.error("Error al sincronizar:", error);
    } finally {
      setIsSyncingRoutines(false);
    }
  };

  const fetchRoutinesFromSheets = async () => {
    if (!scriptUrl || scriptUrl.includes("TU_URL_DE_GOOGLE")) return;
    try {
      const response = await fetch(`${scriptUrl}?action=getRoutines&t=${new Date().getTime()}`);
      if (response.ok) {
        const textData = await response.text();
        if (textData && textData.trim() !== "") {
          const data = JSON.parse(textData);
          setWorkoutLibrary(data);
          localStorage.setItem('nutri_workout_library_v4', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error("Error al cargar rutinas:", error);
    }
  };

  useEffect(() => {
    if (scriptUrl && !scriptUrl.includes("TU_URL_DE_GOOGLE")) {
      fetchRoutinesFromSheets();
    }
  }, [scriptUrl]);

  // --- HISTORIAL ---
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState(() => {
    const cached = localStorage.getItem('nutri_history_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyViewMode, setHistoryViewMode] = useState('pacientes'); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null); 

  const fetchHistory = async (isSilent = false) => {
    if (!scriptUrl || scriptUrl.includes("TU_URL_DE_GOOGLE")) return;
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`${scriptUrl}?action=getHistory&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Error en la conexión");
      const textData = await response.text();
      const data = JSON.parse(textData);
      if (Array.isArray(data)) {
        const reversedData = data.reverse();
        setHistoryData(reversedData);
        localStorage.setItem('nutri_history_cache', JSON.stringify(reversedData.slice(0, 30))); 
      }
    } catch (error) {
      if (!isSilent) console.error("Error de historial:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
  if (scriptUrl && !scriptUrl.includes("TU_URL_DE_GOOGLE")) {
    fetchHistory(); 
  }
}, [scriptUrl]);

useEffect(() => {
  if (showHistoryModal && historyData.length === 0) {
    fetchHistory();
  }
}, [showHistoryModal]); // Asegúrate de que no cause re-render innecesarios

  const executeDelete = async () => {
  if (!scriptUrl || scriptUrl.includes("TU_URL_DE_GOOGLE")) return;

  if (!patientToDelete) {
    console.error("No hay paciente seleccionado para eliminar.");
    return;
  }

  setIsDeleting(true);
  try {
    const { Nombre, nombre, Name, Fecha, fecha, Date, ID, id, registroId } = patientToDelete;

    const payload = {
      action: 'delete',
      nombre: Nombre || nombre || Name || 'Desconocido',
      fecha: Fecha || fecha || Date || 'Desconocido',
      registroId: ID || id || registroId || null,
      ID: ID || id || registroId || null  
    };

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });

    // Eliminar paciente del historial local  
    setHistoryData(prevData => prevData.filter(p => p.ID !== payload.ID));
    setShowDeleteConfirm(false);
    
  } catch (error) {
    console.error("Error eliminando el paciente:", error);
  } finally {
    setIsDeleting(false);
    setPatientToDelete(null); // Reiniciar el estado  
  }
};

  const openSettings = () => {
    setTempScriptUrl(scriptUrl);
    setTempSheetsUrl(sheetsUrl);
    setTempProfessionalName(professionalName);
    setTempLocation(location);
    setTempOnboardingUrl(onboardingUrl);
    setShowSettingsModal(true);
  };

  const saveSettings = () => {
    setScriptUrl(tempScriptUrl);
    setSheetsUrl(tempSheetsUrl);
    setProfessionalName(tempProfessionalName);
    setLocation(tempLocation);
    setOnboardingUrl(tempOnboardingUrl);
    localStorage.setItem('nutri_scriptUrl', tempScriptUrl);
    localStorage.setItem('nutri_sheetsUrl', tempSheetsUrl);
    localStorage.setItem('nutri_professionalName', tempProfessionalName);
    localStorage.setItem('nutri_location', tempLocation);
    localStorage.setItem('nutri_onboardingUrl', tempOnboardingUrl);
    setShowSettingsModal(false);
    setAlertMessage("Configuración guardada correctamente.");
  };

  const startCamera = async (mode = 'environment') => {
    // 1. Prevención de Crasheo si no hay soporte o falta HTTPS
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAlertMessage("Tu navegador o dispositivo no soporta la cámara, o faltan permisos de seguridad (HTTPS).");
      return;
    }

    setIsCameraOpen(true);
    setCameraFacingMode(mode);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
      streamRef.current = stream;

      // 2. Solución a la Pantalla Negra (Race Condition)
      // Forzamos un bucle ligero que espera exactamente a que React termine de dibujar el modal.
      const attachVideo = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          requestAnimationFrame(attachVideo);
        }
      };
      attachVideo();

    } catch (err) {
      console.error("Error accediendo a la cámara:", err);
      setAlertMessage("No se pudo acceder a la cámara. Asegúrate de otorgar los permisos necesarios en tu navegador o dispositivo.");
      setIsCameraOpen(false);
    }
  };

  const toggleCamera = () => {
    const newMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(newMode);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null; // Liberamos memoria de la variable
    }
    setIsCameraOpen(false);
    setCameraFacingMode('environment');
  };

  // 3. Limpieza automática: Si el componente desaparece, apagamos la cámara obligatoriamente
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const MAX_DIMENSION = 300; 
      let w = canvas.width;
      let h = canvas.height;
      if (w > h) {
        if (w > MAX_DIMENSION) {
          h *= MAX_DIMENSION / w;
          w = MAX_DIMENSION;
        }
      } else {
        if (h > MAX_DIMENSION) {
          w *= MAX_DIMENSION / h;
          h = MAX_DIMENSION;
        }
      }

      const compressedCanvas = document.createElement('canvas');
      compressedCanvas.width = w;
      compressedCanvas.height = h;
      compressedCanvas.getContext('2d').drawImage(canvas, 0, 0, w, h);

      const compressedBase64 = compressedCanvas.toDataURL('image/jpeg', 0.6);
      setPatient(prev => ({ ...prev, foto: compressedBase64 }));
      stopCamera();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setShowFullscreenWarning(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpView, setHelpView] = useState('selection');

  const [patient, setPatient] = useState({
    nombre: '', edad: 25, genero: 'Femenino', peso: 65, talla: 160, motivoConsulta: '', suplementos: '', foto: ''
  });

  const [antropo, setAntropo] = useState({
    // Pliegues Básicos
    pliegueTri: '', pliegueSub: '', pliegueSupra: '', pliegueBici: '',
    // Pliegues ISAK
    pliegueSupraespinal: '', pliegueAbdominal: '', pliegueMuslo: '', plieguePantorrilla: '',
    // Circunferencias
    circBrazo: '', circBrazoFlex: '', circCintura: '', circCadera: '', circPantorrilla: '',
    // Diámetros
    diamMuneca: '', diamHumero: '', diamFemur: ''
  });

  const [energySettings, setEnergySettings] = useState({
    formula: 'harris', af: 10, eta: 10
  });

  const [macros, setMacros] = useState({
    protPercent: 20, lipPercent: 25, hcPercent: 55
  });

  const [portions, setPortions] = useState(
    Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  const [distribution, setDistribution] = useState(
    Object.keys(SMAE).reduce((acc, key) => ({
      ...acc, [key]: { des: 0, col1: 0, com: 0, col2: 0, cen: 0 }
    }), {})
  );

  const [menuText, setMenuText] = useState('');
  const [menuText2, setMenuText2] = useState(''); 
  const [menuOptionsCount, setMenuOptionsCount] = useState(1); 
  const [notesText, setNotesText] = useState('');
  const [groceryListText, setGroceryListText] = useState('');
  const [groceryListText2, setGroceryListText2] = useState(''); // ESTADO AÑADIDO
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [isGeneratingGroceryList, setIsGeneratingGroceryList] = useState(false);
  const [aiPromptModifier, setAiPromptModifier] = useState('');

  const [isGeneratingPortions, setIsGeneratingPortions] = useState(false);
  const [aiPortionsPromptModifier, setAiPortionsPromptModifier] = useState('');
  const [portionsError, setPortionsError] = useState(false);

  const [isGeneratingDistribution, setIsGeneratingDistribution] = useState(false);
  const [aiDistributionPromptModifier, setAiDistributionPromptModifier] = useState('');
  const [distributionError, setDistributionError] = useState(false);

  const [isGeneratingSupplements, setIsGeneratingSupplements] = useState(false);

const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [expandedTool, setExpandedTool] = useState(null);
  const [extras, setExtras] = useState({
    countryCode: '+52',
    phone: '',
    recall: '',
    agendaDate: '',
    agendaTime: '', // <-- LÍNEA AÑADIDA PARA LA HORA
    pesoMeta: '', // <--- AGREGA ESTA LÍNEA AQUÍ (Punto 4)
    workoutGoal: '',
    workoutRoutine: '',
    labs: { glucosa: '', colesterol: '', trigliceridos: '', notas: '' },
    labsFeedback: '',
    finance: { monto: '', metodo: 'Efectivo', estado: 'Pagado', notas: '' },
    brands: [],
    activeRecipes: [],
    showISAK: false,
    groceryCost: '',
    groceryCost2: '' // ESTADO AÑADIDO
  });
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const [isAnalyzingLabs, setIsAnalyzingLabs] = useState(false);
  const [isScanningOCR, setIsScanningOCR] = useState(false); // NUEVO ESTADO OCR

  // --- ESTADO CUESTIONARIO CLÍNICO ---
  const [medicalHistory, setMedicalHistory] = useState(DEFAULT_MEDICAL_HISTORY);

  const bodyComp = useMemo(() => {
    // Forzamos la lectura numérica
    const tri = parseFloat(antropo.pliegueTri) || 0;
    const sub = parseFloat(antropo.pliegueSub) || 0;
    const supra = parseFloat(antropo.pliegueSupra) || 0;
    const bici = parseFloat(antropo.pliegueBici) || 0;
    const peso = parseFloat(patient.peso) || 0;

    const sumaPliegues = tri + sub + supra + bici;
    const logSuma = Math.log10(sumaPliegues || 1);
    let densidad = 1.0;
    
    if (patient.genero === 'Masculino') {
      densidad = 1.1620 - (0.0630 * logSuma);
    } else {
      densidad = 1.1549 - (0.0678 * logSuma);
    }
    
    const siriFat = Math.max(0, ((4.95 / densidad) - 4.5) * 100);
    const fatMass = (siriFat / 100) * peso;
    const leanMass = peso - fatMass;

    return { densidad, siriFat, fatMass, leanMass };
  }, [antropo, patient.genero, patient.peso]);

  // CALCULO ISAK
  const somatotypeData = useMemo(() => calculateSomatotype({...antropo, talla: patient.talla, peso: patient.peso}), [antropo, patient]);

  const energy = useMemo(() => {
    let geb = 0;
    const p = parseFloat(patient.peso);
    const t = parseFloat(patient.talla);
    const e = parseFloat(patient.edad);

    if (energySettings.formula === 'harris') {
      if (patient.genero === 'Masculino') {
        geb = 66.5 + (13.75 * p) + (5.003 * t) - (6.75 * e);
      } else {
        geb = 655.1 + (9.563 * p) + (1.850 * t) - (4.676 * e);
      }
    } else if (energySettings.formula === 'mifflin') {
      if (patient.genero === 'Masculino') {
        geb = (10 * p) + (6.25 * t) - (5 * e) + 5;
      } else {
        geb = (10 * p) + (6.25 * t) - (5 * e) - 161;
      }
    }

    const afKcal = geb * (energySettings.af / 100);
    const etaKcal = geb * (energySettings.eta / 100);
    const get = geb + afKcal + etaKcal;

    return { geb, afKcal, etaKcal, get };
  }, [patient, energySettings]);

  const targets = useMemo(() => {
    const totalKcal = energy.get;
    const protKcal = totalKcal * (macros.protPercent / 100);
    const lipKcal = totalKcal * (macros.lipPercent / 100);
    const hcKcal = totalKcal * (macros.hcPercent / 100);

    return {
      kcal: totalKcal, protG: protKcal / 4, lipG: lipKcal / 9, hcG: hcKcal / 4,
      protKcal, lipKcal, hcKcal
    };
  }, [energy.get, macros]);

  const currentDiet = useMemo(() => {
    let kcal = 0, prot = 0, lip = 0, hc = 0;
    Object.keys(portions).forEach(key => {
      const q = parseFloat(portions[key]) || 0;
      kcal += q * SMAE[key].energia;
      prot += q * SMAE[key].prot; 
      lip += q * SMAE[key].lip;
      hc += q * SMAE[key].hc;
    });
    return { kcal, prot, lip, hc };
  }, [portions]);
  
  const handleSave = async () => {
    if (!scriptUrl || scriptUrl.includes("TU_URL_DE_GOOGLE")) {
      setAlertMessage("⚠️ Falta configurar la URL de tu Google Apps Script en el panel de configuración (engranaje).");
      return false;
    }

    setIsSaving(true);
    
    // Determinamos el ID a guardar: Formato estricto EX-0000
    const idToSave = displayId;
    
    const payload = {
      ID: idToSave,             
      id: idToSave,             
      registroId: idToSave,    
      fecha: new Date().toLocaleDateString(),
      ...patient,
      ...antropo, // Respaldo por si algún día creas las columnas en Sheets
      porcentajeGrasa: bodyComp.siriFat.toFixed(2),
      getObjetivo: energy.get.toFixed(0),
      portionsJSON: JSON.stringify({
        portions,
        energySettings,
        macros,
        distribution,
        extras,
        medicalHistory,
        groceryListText2,
        antropoCompleto: antropo // <--- AQUÍ ESTÁ LA MAGIA: Guardamos todos los pliegues de forma segura
      }),
      menuText,
      menuText2,
      notesText,
      groceryListText,
      groceryListText2 
    };

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
      setCurrentRecordId(idToSave);

      const instantCacheData = {
        ...payload,
        Nombre: patient.nombre,
        Fecha: payload.fecha,
        Peso: patient.peso
      };
      
      setHistoryData(prev => {
        const filtered = prev.filter(p => String(p.ID || p.id || p.registroId) !== String(idToSave));
        const newData = [instantCacheData, ...filtered].sort((a, b) => {
           const numA = String(a.ID || a.id || a.registroId || "0").match(/\d+/) ? parseInt(String(a.ID || a.id || a.registroId).match(/\d+/)[0], 10) : 0;
           const numB = String(b.ID || b.id || b.registroId || "0").match(/\d+/) ? parseInt(String(b.ID || b.id || b.registroId).match(/\d+/)[0], 10) : 0;
           return numB - numA; 
        });
        localStorage.setItem('nutri_history_cache', JSON.stringify(newData.slice(0, 30)));
        return newData;
      });

      fetchHistory(true);
      
      return true;
    } catch (error) {
      console.error("Error al guardar:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const loadPatientForEditing = (p, isNewConsultation = false) => {
    const loadedId = isNewConsultation ? null : (p.ID || p.id || p.registroId || p.Id || null);
    setCurrentRecordId(loadedId);

    const fotoKey = Object.keys(p).find(k => k.toLowerCase().trim().includes('foto') || k.toLowerCase().trim().includes('photo'));
    let fotoCargada = fotoKey ? p[fotoKey] : '';
    
    if (typeof fotoCargada === 'string') {
      fotoCargada = fotoCargada.trim();
      if (!fotoCargada.startsWith('data:image')) {
        fotoCargada = '';
      }
    } else {
      fotoCargada = '';
    }

    setPatient({
      nombre: p.nombre || p.Nombre || p.Name || '',
      edad: parseInt(p.edad || p.Edad) || 25,
      genero: p.genero || p.Género || p.Genero || 'Femenino',
      peso: parseFloat(p.peso || p.Peso) || 65,
      talla: parseFloat(p.talla || p.Talla) || 160,
      motivoConsulta: p.motivoConsulta || p.Motivo || p['Motivo de Consulta'] || '',
      suplementos: p.suplementos || p.Suplementos || '',
      foto: fotoCargada
    });

    // 1. Cargamos lo que Sheets sí tenga en columnas individuales
    let antropoRecuperado = {
      pliegueTri: p.pliegueTri ?? p.PliegueTri ?? '',
      pliegueSub: p.pliegueSub ?? p.PliegueSub ?? '',
      pliegueSupra: p.pliegueSupra ?? p.PliegueSupra ?? '',
      pliegueBici: p.pliegueBici ?? p.PliegueBici ?? '',
      pliegueSupraespinal: p.pliegueSupraespinal ?? p.PliegueSupraespinal ?? '',
      pliegueAbdominal: p.pliegueAbdominal ?? p.PliegueAbdominal ?? '',
      pliegueMuslo: p.pliegueMuslo ?? p.PliegueMuslo ?? '',
      plieguePantorrilla: p.plieguePantorrilla ?? p.PlieguePantorrilla ?? '',
      circBrazo: p.circBrazo ?? p.CircBrazo ?? '',
      circBrazoFlex: p.circBrazoFlex ?? p.CircBrazoFlex ?? '',
      circCintura: p.circCintura ?? p.CircCintura ?? '',
      circCadera: p.circCadera ?? p.CircCadera ?? '',
      circPantorrilla: p.circPantorrilla ?? p.CircPantorrilla ?? '',
      diamMuneca: p.diamMuneca ?? p.DiamMuneca ?? '',
      diamHumero: p.diamHumero ?? p.DiamHumero ?? '',
      diamFemur: p.diamFemur ?? p.DiamFemur ?? ''
    };

    const defaultPortions = Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const defaultDistribution = Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: { des: 0, col1: 0, com: 0, col2: 0, cen: 0 } }), {});
    const defaultExtras = { countryCode: '+52', phone: '', recall: '', agendaDate: '', agendaTime: '', pesoMeta: '', workoutGoal: '', workoutRoutine: '', labs: { glucosa: '', colesterol: '', trigliceridos: '', notas: '' }, labsFeedback: '', finance: { monto: '', metodo: 'Efectivo', estado: 'Pagado', notas: '' }, brands: [], activeRecipes: [], showISAK: false, groceryCost: '', groceryCost2: '' };

    let loadedGroceryList2 = p.groceryListText2 || p.listaCompras2 || '';

    try {
      const jsonKey = Object.keys(p).find(k => {
        const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanK.includes('portionsjson') || cleanK.includes('porcionesjson');
      });
      const jsonStr = jsonKey ? p[jsonKey] : null;

      if (jsonStr) {
        const parsed = JSON.parse(jsonStr);
        if (parsed.portions) {
          setPortions({ ...defaultPortions, ...parsed.portions });
          if (parsed.energySettings) setEnergySettings(parsed.energySettings);
          if (parsed.macros) setMacros(parsed.macros);
          
          if (parsed.distribution) {
            const newDist = { ...defaultDistribution };
            Object.keys(parsed.distribution).forEach(key => {
              if (newDist[key]) {
                newDist[key] = { ...newDist[key], ...parsed.distribution[key] };
              }
            });
            setDistribution(newDist);
          } else {
            setDistribution(defaultDistribution);
          }
          
          if (parsed.extras) {
            setExtras({ 
              ...defaultExtras, 
              ...parsed.extras,
              labs: {
                ...defaultExtras.labs,
                ...(parsed.extras.labs || {})
              },
              finance: {
                ...defaultExtras.finance,
                ...(parsed.extras.finance || {})
              }
            });
          } else {
            setExtras(defaultExtras);
          }

          if (parsed.medicalHistory) {
            const mergedHistory = DEFAULT_MEDICAL_HISTORY.map(defItem => {
              const found = parsed.medicalHistory.find(savedItem => savedItem.id === defItem.id);
              return found ? found : defItem;
            });
            setMedicalHistory(mergedHistory);
          } else {
            setMedicalHistory(DEFAULT_MEDICAL_HISTORY);
          }

          if (parsed.groceryListText2) {
             loadedGroceryList2 = parsed.groceryListText2;
          }

          // 2. RECUPERACIÓN INTELIGENTE: Desempaquetamos los pliegues ISAK
          if (parsed.antropoCompleto) {
            antropoRecuperado = { ...antropoRecuperado, ...parsed.antropoCompleto };
          }

        } else {
          setPortions({ ...defaultPortions, ...parsed });
        }
      }
    } catch (e) {
      console.error("Error al decodificar los datos empaquetados", e);
    }

    // 3. Asignamos todos los pliegues finalmente al estado
    setAntropo(antropoRecuperado);

    setMenuText(p.menuText || p.menuTexto || p.MenuA || p['Menú A'] || '');
    setMenuText2(p.menuText2 || p.menuTexto2 || p.MenuB || p['Menú B'] || '');
    if (p.menuText2 || p.MenuB || p.menuTexto2) setMenuOptionsCount(2); else setMenuOptionsCount(1);
    setNotesText(p.notesText || p.notasTexto || p.Notas || '');
    setGroceryListText(p.groceryListText || p.listaCompras || ''); 
    setGroceryListText2(loadedGroceryList2);

    setShowHistoryModal(false);
    setActiveTab('historia');
    
    if (isNewConsultation) {
       setAlertMessage(`Datos de ${p.nombre || p.Nombre || ''} cargados como plantilla para una NUEVA consulta. Se asignará el expediente ${formatExpedienteId(nextRecordId)} al guardar.`);
    } else {
       setAlertMessage(`Consulta ${loadedId ? formatExpedienteId(loadedId) : '?'} cargada. Los cambios que realices se guardarán sobre esta misma consulta en tu base de datos.`);
    }
  };

  const handleDownloadPDF = () => {
    setShowPdfConfirm(true);
  };

  const executePDFDownload = () => {
    setIsGeneratingPDF(true);
    setIsPrinting(true); 

    setTimeout(() => {
      const element = document.getElementById('pdf-content');
      
      if (window.html2pdf && element) {
        const opt = {
          margin:       [10, 10, 15, 10], 
          filename:     `Expediente_${displayId}_${patient.nombre ? patient.nombre.replace(/\s+/g, '_') : 'Paciente'}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, letterRendering: true }, 
          pagebreak:    { mode: ['css', 'legacy'] },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const img = new Image();
        img.src = WATERMARK_BASE64; 

        const finishPdf = (watermarkImgData) => {
          window.html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              if (watermarkImgData) {
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const imgWidthMM = 140; 
                  const imgHeightMM = (img.height * imgWidthMM) / img.width;
                  const x = (pdfWidth - imgWidthMM) / 2;
                  const y = (pdfHeight - imgHeightMM) / 2;
                  if (typeof pdf.GState !== "undefined") {
                      pdf.setGState(new pdf.GState({opacity: 0.15}));
                  }
                  pdf.addImage(watermarkImgData, 'PNG', x, y, imgWidthMM, imgHeightMM);
                  if (typeof pdf.GState !== "undefined") {
                      pdf.setGState(new pdf.GState({opacity: 1.0}));
                  }
              }
              pdf.setFontSize(9);
              pdf.setTextColor(150, 150, 150); 
              pdf.text(
                `Hoja ${i} de ${totalPages} | Paciente: ${patient.nombre || 'Sin nombre'} (${displayId})`,
                10,
                pdf.internal.pageSize.getHeight() - 5 
              );
            }
          }).save().then(() => {
            setIsPrinting(false); 
            setIsGeneratingPDF(false);
          });
        };

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imgData = canvas.toDataURL('image/png');
          finishPdf(imgData);
        };

        img.onerror = () => {
          console.warn("No se pudo cargar la marca de agua debido a un bloqueo de seguridad. Generando sin ella.");
          finishPdf(null);
        };
      } else {
        window.print();
        setIsPrinting(false);
        setIsGeneratingPDF(false);
      }
    }, 800);
  };

  const confirmNewPatient = () => {
    setCurrentRecordId(null); 

    setPatient({ nombre: '', edad: 25, genero: 'Femenino', peso: 65, talla: 160, motivoConsulta: '', suplementos: '', foto: '' });
    setAntropo({ pliegueTri: 15, pliegueSub: 10, pliegueSupra: 18, pliegueBici: 7, circBrazo: 29, diamMuneca: 5, diamFemur: 7.5, circPantorrilla: 35, diamHumero: 6.5 });
    
    setEnergySettings({ formula: 'harris', af: 10, eta: 10 });
    setMacros({ protPercent: 20, lipPercent: 25, hcPercent: 55 });
    setPortions(Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
    setDistribution(Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: { des: 0, col1: 0, com: 0, col2: 0, cen: 0 } }), {}));
    
    setMenuText('');
    setMenuText2('');
    setMenuOptionsCount(1);
    setNotesText('');
    setGroceryListText(''); 
    setGroceryListText2(''); 
    setExtras({ countryCode: '+52', phone: '', recall: '', agendaDate: '', workoutGoal: '', workoutRoutine: '', labs: { glucosa: '', colesterol: '', trigliceridos: '', notas: '' }, labsFeedback: '', finance: { monto: '', metodo: 'Efectivo', estado: 'Pagado', notas: '' }, brands: [], activeRecipes: [], showISAK: false, groceryCost: '', groceryCost2: '' });
    setMedicalHistory(DEFAULT_MEDICAL_HISTORY);
    setAiPromptModifier(''); 
    setAiPortionsPromptModifier(''); 
    setPortionsError(false);
    setAiDistributionPromptModifier(''); 
    setDistributionError(false);
    setActiveTab('historia');
    setShowNewConfirm(false);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      setAlertMessage("Por favor escribe un nombre para la plantilla.");
      return;
    }
    const newTpl = {
      id: Date.now(),
      name: newTemplateName,
      portions,
      distribution,
      macros,
      energySettings
    };
    const updated = [...savedTemplates, newTpl];
    setSavedTemplates(updated);
    localStorage.setItem('nutri_templates', JSON.stringify(updated));
    setNewTemplateName('');
    setAlertMessage(`Plantilla "${newTemplateName}" guardada en tu Base de Datos local.`);
  };

  const handleLoadTemplate = (tpl) => {
    setPortions(tpl.portions);
    setDistribution(tpl.distribution);
    setMacros(tpl.macros);
    setEnergySettings(tpl.energySettings);
    setShowTemplatesModal(false);
    setAlertMessage(`Se ha cargado la plantilla "${tpl.name}" con éxito.`);
  };

  const handleDeleteTemplate = (id) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('nutri_templates', JSON.stringify(updated));
  };

  const saveNewRecipe = () => {
    if (!newRecipeTitle.trim() || !newRecipeContent.trim()) return;
    const newRecipe = { id: Date.now().toString(), title: newRecipeTitle, content: newRecipeContent };
    const updated = [...globalRecipes, newRecipe];
    setGlobalRecipes(updated);
    localStorage.setItem('nutri_recipes', JSON.stringify(updated));
    setNewRecipeTitle('');
    setNewRecipeContent('');
    setAlertMessage(`Receta "${newRecipe.title}" añadida a tu catálogo visual.`);
  };

  const deleteRecipe = (id) => {
    const updated = globalRecipes.filter(r => r.id !== id);
    setGlobalRecipes(updated);
    localStorage.setItem('nutri_recipes', JSON.stringify(updated));
    if (extras.activeRecipes?.includes(id)) {
      handleExtrasChange('activeRecipes', extras.activeRecipes.filter(rId => rId !== id));
    }
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));

    if (name === 'nombre') {
      if (value.trim().length > 0) {
        const uniquePatientsMap = historyData.reduce((map, p) => {
          const pName = (p.Nombre || p.nombre || p.Name || "Sin Nombre").trim();
          if (pName.toLowerCase().includes(value.toLowerCase())) {
            if (!map.has(pName.toLowerCase())) {
              map.set(pName.toLowerCase(), p);
            }
          }
          return map;
        }, new Map());
        
        setPatientSuggestions(Array.from(uniquePatientsMap.values()).slice(0, 5)); 
        setShowPatientSuggestions(true);
      } else {
        setShowPatientSuggestions(false);
      }
    }
  };

  const handleNameFocus = () => {
    if (historyData.length === 0 && !isLoadingHistory) {
      fetchHistory();
    }
    if (patient.nombre.trim().length > 0 && patientSuggestions.length > 0) {
      setShowPatientSuggestions(true);
    }
  };

  const selectPatientSuggestion = (p) => {
    loadPatientForEditing(p, true); 
    setShowPatientSuggestions(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 300; 

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setPatient(prev => ({ ...prev, foto: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPatient(prev => ({ ...prev, foto: '' }));
  };

  const handleAntropoChange = (e) => {
    const { name, value } = e.target;
    setAntropo(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleEnergyChange = (e) => {
    const { name, value } = e.target;
    setEnergySettings(prev => ({ ...prev, [name]: name === 'formula' ? value : parseFloat(value) || 0 }));
  };

  const handleMacroChange = (e) => {
    const { name, value } = e.target;
    setMacros(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handlePortionChange = (key, value) => {
    setPortions(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleDistributionChange = (key, meal, value) => {
    setDistribution(prev => ({
      ...prev,
      [key]: { ...prev[key], [meal]: parseFloat(value) || 0 }
    }));
  };

  const handleMedicalHistoryChange = (idx, field, value) => {
    const updated = [...medicalHistory];
    updated[idx][field] = value;
    setMedicalHistory(updated);
  };

  const handleExtrasChange = (field, value, isLab = false) => {
    if (isLab) {
      setExtras(prev => ({ ...prev, labs: { ...prev.labs, [field]: value } }));
    } else {
      setExtras(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUploadOCR = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsScanningOCR(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
       const base64Data = event.target.result.split(',')[1]; 
       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
       const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
       
       const promptText = `Eres un asistente médico experto en lectura de análisis clínicos. 
       Extrae: glucosa, colesterol, trigliceridos, peso. Devuelve un JSON estricto: {"glucosa": n, "colesterol": n, "trigliceridos": n, "peso": n}`;
       
       const payloadOCR = {
         contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }]
       };

       try {
         const response = await fetch(url, { 
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(payloadOCR)
         });

         const data = await response.json();
         const rawText = data.candidates[0].content.parts[0].text;
         const extracted = JSON.parse(rawText.replace(/```json|```/g, "").trim());
         
         if(extracted.glucosa) handleExtrasChange('glucosa', extracted.glucosa, true);
         if(extracted.colesterol) handleExtrasChange('colesterol', extracted.colesterol, true);
         if(extracted.trigliceridos) handleExtrasChange('trigliceridos', extracted.trigliceridos, true);
         if(extracted.peso) setPatient(prev => ({...prev, peso: extracted.peso}));
         
         setAlertMessage("¡Análisis completado con éxito!");
       } catch (err) {
         setAlertMessage("Error al procesar la imagen. Revisa tu conexión o API Key.");
       } finally {
         setIsScanningOCR(false);
       }
    };
    reader.readAsDataURL(file);
  };

// --- LÓGICA IA AVANZADA ---
  const handleGenerateWorkoutAI = async (mode) => {
    setIsGeneratingWorkout(true);
    
    // [CORRECCIÓN A] La ejecución en el entorno proporcionará la clave automáticamente.
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt = `Eres un entrenador personal y clínico experto. 
    REGLAS ESTRICTAS: 
    1) Responde ÚNICAMENTE con la rutina solicitada. 
    2) Si te piden días específicos, divide la rutina EXACTAMENTE por esos días. 
    3) Usa un formato limpio con emojis, indicando series, repeticiones y tiempo de descanso. 
    4) Evita ejercicios prohibidos si el nutriólogo los menciona. 
    5) Sé directo, sin introducciones largas.`;

    let query = "";
    if (mode === 'rapido') {
      const finalGoal = aiSelectedGoal === '(Usar motivo de consulta general)' 
        ? (patient.motivoConsulta || 'Mantenimiento y Salud General') 
        : aiSelectedGoal;
      query = `Paciente: ${patient.nombre}, edad: ${patient.edad} años, género: ${patient.genero}. Objetivo principal: ${finalGoal}.`;
    } else {
      if (!aiCustomPrompt.trim()) {
        setAlertMessage("Por favor, escribe instrucciones específicas para la rutina.");
        setIsGeneratingWorkout(false);
        return;
      }
      query = `Paciente: ${patient.nombre}, edad: ${patient.edad} años.\nInstrucciones del nutriólogo: "${aiCustomPrompt}".`;
    }

    const payload = {
      contents: [{ parts: [{ text: query }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.3 }
    };

    // Lógica de reintento exponencial (Backoff) para estabilidad profesional
    const fetchWithRetry = async (retries = 5) => {
      const delays = [1000, 2000, 4000, 8000, 16000];
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error('Error en API');
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(r => setTimeout(r, delays[i]));
        }
      }
    };

    try {
      const aiText = await fetchWithRetry();
      if (aiText) {
        setExtras(prev => ({ ...prev, workoutRoutine: aiText.trim() }));
      }
    } catch (err) {
      console.error("Error IA Rutinas:", err);
      setAlertMessage("Hubo un problema de conexión con el generador de rutinas. Intenta de nuevo en unos segundos.");
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  // --- LÓGICA DE CARPETAS Y GUARDADO ---
  const handleAddFolder = () => {
    if (Object.keys(workoutLibrary).length >= 8) return setAlertMessage('Máximo 8 carpetas permitidas.');
    let baseName = 'Nueva Carpeta';
    let name = baseName;
    let count = 1;
    while(workoutLibrary[name]) { name = `${baseName} ${count}`; count++; }
    
    setWorkoutLibrary(prev => {
      const newLib = { ...prev, [name]: [] };
      localStorage.setItem('nutri_workout_library_v4', JSON.stringify(newLib));
      return newLib;
    });
    setEditingFolder(name);
    setEditingFolderName(name);
  };

  const handleSaveFolderName = (oldName) => {
    const trimmedName = editingFolderName.trim().toUpperCase();
    if (!trimmedName || trimmedName === oldName) {
      setEditingFolder(null);
      return;
    }
    if (workoutLibrary[trimmedName] && trimmedName !== oldName) {
      setAlertMessage('Ya existe una carpeta con ese nombre.');
      return;
    }
    const newLib = {};
    for (let key in workoutLibrary) {
      if (key === oldName) newLib[trimmedName] = workoutLibrary[oldName];
      else newLib[key] = workoutLibrary[key];
    }
    setWorkoutLibrary(newLib);
    localStorage.setItem('nutri_workout_library_v4', JSON.stringify(newLib));
    if (selectedFolder === oldName) setSelectedFolder(trimmedName);
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderName) => {
    if (Object.keys(workoutLibrary).length <= 1) return setAlertMessage('Debes mantener al menos 1 carpeta.');
    if (!window.confirm(`¿Seguro que deseas eliminar la carpeta "${folderName}" y todas sus rutinas?`)) return;
    const newLib = { ...workoutLibrary };
    delete newLib[folderName];
    setWorkoutLibrary(newLib);
    localStorage.setItem('nutri_workout_library_v4', JSON.stringify(newLib));
    if (selectedFolder === folderName) setSelectedFolder(Object.keys(newLib)[0]);
  };

  const saveRoutine = () => {
    if (!newRoutineName.trim()) return setAlertMessage("Debes asignar un nombre a la plantilla.");
    if (!extras.workoutRoutine.trim()) return setAlertMessage("El editor está vacío. Escribe o genera una rutina primero.");
    const newLib = { ...workoutLibrary };
    newLib[selectedFolder].push({ id: Date.now(), name: newRoutineName, content: extras.workoutRoutine });
    setWorkoutLibrary(newLib);
    localStorage.setItem('nutri_workout_library_v4', JSON.stringify(newLib));
    setNewRoutineName('');
    setShowSaveForm(false);
    setAlertMessage(`Rutina guardada en ${selectedFolder}.`);
  };

  const deleteRoutine = (folder, id) => {
    const newLib = { ...workoutLibrary };
    newLib[folder] = newLib[folder].filter(r => r.id !== id);
    setWorkoutLibrary(newLib);
    localStorage.setItem('nutri_workout_library_v4', JSON.stringify(newLib));
  };

  const toggleExpandTemplate = (id) => {
    setExpandedTemplates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAnalyzeLabsAI = async () => {
    setIsAnalyzingLabs(true);
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `Eres un médico nutriólogo clínico. Analiza ultra-brevemente estos marcadores bioquímicos (${patient.edad} años, ${patient.genero}):
    - Glucosa: ${extras.labs.glucosa || 'No reportada'} mg/dL
    - Colesterol Total: ${extras.labs.colesterol || 'No reportado'} mg/dL
    - Triglicéridos: ${extras.labs.trigliceridos || 'No reportados'} mg/dL
    - Otras notas: ${extras.labs.notas || 'Ninguna'}

    REGLA ESTRICTA DE FORMATO: Devuelve un análisis telegráfico para un espacio muy reducido en un PDF.
    - CERO introducciones de IA.
    - MÁXIMO 3 líneas cortas.
    - Usa este estilo exacto:
      🩸 Estado: [Breve diagnóstico]
      ⚠️ Riesgo: [Nivel]
      🍽️ Acción: [Recomendación clínica muy corta]`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo analizar.";
      setExtras(prev => ({ ...prev, labsFeedback: text.trim() }));
    } catch (error) {
       setAlertMessage("Error al analizar laboratorios.");
    } finally {
       setIsAnalyzingLabs(false);
    }
  };

  const sendWhatsAppReminder = (name, phone, date, time) => {
    if (!phone || !date) {
      setAlertMessage("Por favor, ingresa el celular en la sección de WhatsApp y selecciona una fecha en la Agenda Rápida.");
      return;
    }
    
    const msg = `Hola ${name || 'paciente'}, te escribo de Nutri Health para recordarte tu próxima cita el día ${date} a las ${time || 'la hora acordada'}. ¡Te esperamos!`;
    const cleanPhone = phone.replace(/\D/g, ''); 
    const cleanCode = extras.countryCode.replace(/\D/g, ''); 
    const url = `https://wa.me/${cleanCode}${cleanPhone}?text=${encodeURIComponent(msg)}`;
    
    window.open(url, '_blank');
  };

  const handleWhatsApp = () => {
    if (!extras.phone) {
      setAlertMessage("Por favor ingresa un número de teléfono en la herramienta de WhatsApp.");
      return;
    }
    setShowWaConfirm(true);
  };

  const proceedToWhatsApp = (withPdf) => {
    setShowWaConfirm(false);
    handleSave();

    const msg = `Hola ${patient.nombre || 'paciente'}, soy ${professionalName}. Tu plan nutricional está listo y actualizado. Tu meta calórica calculada es de ${energy.get.toFixed(0)} kcal. ¡Quedo a tu disposición para cualquier duda!`;
    const cleanPhone = extras.phone.replace(/\D/g, ''); 
    const cleanCode = extras.countryCode.replace(/\D/g, ''); 
    const url = `https://wa.me/${cleanCode}${cleanPhone}?text=${encodeURIComponent(msg)}`;
    
    if (withPdf) {
      executePDFDownload();
    }
    
    window.open(url, '_blank');
  };

  const applyRecallToMenu = () => {
    if (!extras.recall) return;
    setAiPromptModifier(`Adapta estrictamente los alimentos del menú sugerido a este estilo de vida/recordatorio de 24h para generar apego: "${extras.recall}". ${aiPromptModifier}`);
    setAlertMessage("El Recordatorio de 24h se ha añadido como instrucción obligatoria para la IA del Menú. Cierra este panel lateral y ve a 'Generar Menú'.");
    setIsRightDrawerOpen(false);
    setActiveTab('menu');
  };

  const toggleTool = (tool) => {
    if (!hasPlusPlan) {
      setAlertMessage("Esta herramienta es exclusiva del Plan Plus. ¡Actualiza tu cuenta para desbloquear todo el panel de herramientas avanzadas!");
      return;
    }
    setExpandedTool(prev => prev === tool ? null : tool);
  };

  const handleGenerateSupplementsAI = async () => {
    setIsGeneratingSupplements(true);
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `Eres un nutriólogo deportivo y clínico experto. Calcula y sugiere los suplementos o ayudas ergogénicas adecuadas para el siguiente paciente, con PORCIONES Y DOSIS EXACTAS basadas en evidencia científica y aplicadas a su peso corporal actual.

    DATOS DEL PACIENTE:
    - Edad: ${patient.edad} años
    - Género: ${patient.genero}
    - Peso actual: ${patient.peso} kg
    - Motivo de consulta / Objetivos clínicos: ${patient.motivoConsulta || 'Mejora de composición corporal y salud general'}
    - Nivel de Actividad Física (AF): ${energySettings.af}% extra sobre el metabolismo basal.
    ${extras.labsFeedback ? `- Análisis Bioquímico (Laboratorios): ${extras.labsFeedback}` : ''}

    INSTRUCCIONES:
    1. Analiza el motivo de consulta, el nivel de actividad física y los laboratorios (si existen).
    2. Si el paciente requiere suplementación (ej. creatina, proteína de suero, omega 3, vitaminas), calcula la dosis EXACTA. Por ejemplo, para creatina usa la fórmula de 0.05 a 0.1 g/kg de peso al día (para este paciente de ${patient.peso} kg, haz el cálculo exacto).
    3. Especifica el momento de toma sugerido (ej. post-entreno, con alimentos, etc.).
    4. Devuelve ÚNICAMENTE el texto de los suplementos recomendados. Sé conciso y directo, sin saludos ni introducciones. 
    5. Si el paciente es sedentario y no menciona objetivos que requieran suplementación deportiva, sugiere únicamente complementos básicos para la salud general (ej. Omega 3, Vitamina D) o indica "No se recomiendan suplementos específicos actualmente, priorizar alimentación."`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "Eres un profesional de la salud escribiendo directamente en el expediente clínico. Responde solo con la posología." }] }
    };

    const fetchWithRetry = async (retries = 5) => {
       const delays = [1000, 2000, 4000, 8000, 16000];
       for (let i = 0; i < retries; i++) {
           try {
               const response = await fetch(url, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(payload)
               });
               if (!response.ok) throw new Error('API Error');
               const data = await response.json();
               return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar la sugerencia.";
           } catch (err) {
               if (i === retries - 1) throw err;
               await new Promise(r => setTimeout(r, delays[i]));
           }
       }
    };

    try {
       const aiText = await fetchWithRetry();
       setPatient(prev => ({ ...prev, suplementos: aiText.trim() }));
    } catch (error) {
       console.error("Error al generar suplementos:", error);
       setAlertMessage("Hubo un error al calcular los suplementos. Intenta nuevamente.");
    } finally {
       setIsGeneratingSupplements(false);
    }
  };

  const handleGeneratePortionsAI = async () => {
    setIsGeneratingPortions(true);
    setPortionsError(false);
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    let prompt = `Eres un experto nutriólogo. Calcula las porciones del Sistema Mexicano de Alimentos Equivalentes (SMAE) para lograr esta meta:
    - Kcal objetivo: ${targets.kcal.toFixed(0)} kcal
    - Proteínas: ${targets.protG.toFixed(1)} g
    - Lípidos: ${targets.lipG.toFixed(1)} g
    - Carbohidratos: ${targets.hcG.toFixed(1)} g

    Devuelve un objeto JSON donde las claves son EXACTAMENTE los IDs mencionados abajo y los valores son la cantidad de porciones (usa números enteros o terminados en .5).
    IDs válidos: verduras, frutas, cereales_sg, cereales_cg, leguminosas, aoa_mbg, aoa_bg, aoa_mg, aoa_ag, leche_des, leche_semi, leche_entera, leche_azucar, aceites_sp, aceites_cp, azucares_sg, azucares_cg.
    
    Asegúrate que al multiplicar las porciones por el aporte de cada grupo, la suma total se acerque lo más posible (95-105%) a los macros objetivo. Prioriza alimentos saludables habituales en ${location}.`;

    if (patient.suplementos?.trim()) {
        prompt += `\n\nSUPLEMENTACIÓN ACTUAL DEL PACIENTE: ${patient.suplementos}. Tómalo en consideración para ajustar las porciones proteicas o calóricas de ser estrictamente necesario, recordando que los equivalentes deben basarse en alimentos.`;
    }

    if (aiPortionsPromptModifier.trim() !== '') {
        prompt += `\n\nRESTRICCIONES / INSTRUCCIONES DEL PACIENTE (Cúmplelas estrictamente): ${aiPortionsPromptModifier}`;
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "Debes responder EXCLUSIVAMENTE con un JSON válido." }] },
      generationConfig: { responseMimeType: "application/json" }
    };

    const fetchWithRetry = async (retries = 5) => {
       const delays = [1000, 2000, 4000, 8000, 16000];
       for (let i = 0; i < retries; i++) {
           try {
               const response = await fetch(url, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(payload)
               });
               if (!response.ok) throw new Error('API Error');
               const data = await response.json();
               return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
           } catch (err) {
               if (i === retries - 1) throw err;
               await new Promise(r => setTimeout(r, delays[i]));
           }
       }
    };

    try {
       const aiPortions = await fetchWithRetry();
       setPortions(prev => {
         const newPortions = { ...prev };
         Object.keys(SMAE).forEach(key => {
           newPortions[key] = parseFloat(aiPortions[key]) || 0;
         });
         return newPortions;
       });
    } catch (error) {
       console.error("Error al generar porciones:", error);
       setPortionsError(true);
    } finally {
       setIsGeneratingPortions(false);
    }
  };

  const handleGenerateDistributionAI = async () => {
    const activePortions = Object.entries(portions).filter(([_, val]) => val > 0);
    if (activePortions.length === 0) {
      setAlertMessage("Primero debes calcular o asignar porciones en la pestaña 'Cuadro Dietosintético'.");
      return;
    }

    setIsGeneratingDistribution(true);
    setDistributionError(false);
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const portionsList = activePortions.map(([key, val]) => `- ${key}: ${val} equivalentes`).join('\n');

    let prompt = `Eres un experto nutriólogo clínico. Tienes la siguiente lista de equivalentes totales calculados para un paciente de ${patient.edad} años, género ${patient.genero}:\n\n${portionsList}\n
    
    Tu tarea es distribuir EXACTAMENTE esas cantidades entre 5 tiempos de comida (des, col1, com, col2, cen). 
    Regla de oro: La suma de (des + col1 + com + col2 + cen) para CADA grupo de alimento DEBE ser matemáticamente idéntica al total solicitado. Ni un gramo más, ni un gramo menos.
    Usa la lógica culinaria y cultural de ${location} (ej. adapta los tiempos de comida y su fuerza calórica a las costumbres locales). Usa valores enteros o fracciones de 0.5.`;

    if (patient.suplementos?.trim()) {
        prompt += `\n\nSUPLEMENTACIÓN ACTUAL DEL PACIENTE: ${patient.suplementos}. Trata de acomodar los equivalentes de forma que tengan lógica si la IA luego le armará comidas usando esos suplementos (ej. si toma proteína, deja espacio en colaciones o post-entreno).`;
    }

    if (aiDistributionPromptModifier.trim() !== '') {
        prompt += `\n\nRESTRICCIONES / INSTRUCCIONES DEL PACIENTE (Cúmplelas estrictamente): ${aiDistributionPromptModifier}`;
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "Devuelve EXCLUSIVAMENTE un objeto JSON. Las claves principales deben ser los IDs de los grupos de alimentos y el valor un sub-objeto con las claves fijas: des, col1, com, col2, cen. Ejemplo: {\"verduras\": {\"des\": 1, \"col1\": 0, \"com\": 1.5, \"col2\": 0, \"cen\": 0.5}}" }] },
      generationConfig: { responseMimeType: "application/json" }
    };

    const fetchWithRetry = async (retries = 5) => {
       const delays = [1000, 2000, 4000, 8000, 16000];
       for (let i = 0; i < retries; i++) {
           try {
               const response = await fetch(url, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(payload)
               });
               if (!response.ok) throw new Error('API Error');
               const data = await response.json();
               return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
           } catch (err) {
               if (i === retries - 1) throw err;
               await new Promise(r => setTimeout(r, delays[i]));
           }
       }
    };

    try {
       const aiDist = await fetchWithRetry();
       setDistribution(prev => {
         const newDist = { ...prev };
         activePortions.forEach(([key]) => {
           if (aiDist[key]) {
             newDist[key] = {
               des: parseFloat(aiDist[key].des) || 0,
               col1: parseFloat(aiDist[key].col1) || 0,
               com: parseFloat(aiDist[key].com) || 0,
               col2: parseFloat(aiDist[key].col2) || 0,
               cen: parseFloat(aiDist[key].cen) || 0
             };
           }
         });
         return newDist;
       });
    } catch (error) {
       console.error("Error al generar distribución:", error);
       setDistributionError(true);
    } finally {
       setIsGeneratingDistribution(false);
    }
  };

// ... existing code ...
  // --- LÓGICA DE REINTENTO EXPONENCIAL (BACKOFF) PARA ESTABILIDAD ---
  const fetchWithRetry = async (url, payload, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('API Saturation');
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(r => setTimeout(r, delays[i]));
      }
    }
  };

// --- 0. GENERACIÓN DE MACROS INTELIGENTE ---
  const handleGenerateMacrosAI = async () => {
    setIsGeneratingMacros(true);
    const apiKey = ""; // Tu clave de Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `Eres un nutriólogo clínico de alto nivel. Calcula la distribución IDEAL de macronutrientes en porcentajes para este paciente, basándote en sus patologías, observaciones clínicas y metas:
    
    ${buildClinicalContext()}
    
    Regla estricta: Los valores deben sumar exactamente 100.
    Responde EXCLUSIVAMENTE con un JSON válido usando estas llaves exactas: {"protPercent": 0, "lipPercent": 0, "hcPercent": 0}`;

    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      
      const aiText = await fetchWithRetry(url, payload);
      const cleanText = aiText.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanText);
      
      if (result.protPercent + result.lipPercent + result.hcPercent === 100) {
        setMacros(result);
        setAlertMessage("✅ Macros ajustados por la IA basándose en el historial, GET y observaciones del paciente.");
      } else {
        setAlertMessage("La IA generó porcentajes que no suman 100%. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al sugerir macros:", error);
      setAlertMessage("Hubo un problema al intentar calcular los macros con IA.");
    } finally {
      setIsGeneratingMacros(false);
    }
  };

  // --- 1. GENERACIÓN DE MENÚ INTELIGENTE ---
  const handleGenerateMenuAI = async () => {
    setIsGeneratingMenu(true);
    const apiKey = ""; // La ejecución inyectará la clave automáticamente en el entorno
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const buildMealSummary = (mealKey) => {
      return Object.entries(SMAE).map(([k, data]) => {
        const val = distribution[k][mealKey];
        return val > 0 ? `${val} eq de ${data.nombre}` : null;
      }).filter(Boolean).join(', ') || 'Sin porciones asignadas';
    };
    
    const isDouble = menuOptionsCount === 2;

    const systemPrompt = `Eres un experto nutriólogo clínico. 
    REGLAS ESTRICTAS: 
    1) Contexto local: Usa ingredientes, marcas y terminología habitual en ${location}. 
    2) Tono: Humano, profesional y directo. Prohibido usar introducciones de IA como "Aquí tienes tu plan". 
    3) Formato: Usa guiones y viñetas (•). 
    4) Precisión: Respeta exactamente la distribución de equivalentes del SMAE enviada.
    ${isDouble ? '5) Formato de salida: Escribe la Opción A completa, luego el separador "|||", y finalmente la Opción B.' : ''}`;

    let prompt = `Genera un plan nutricional de ${energy.get.toFixed(0)} kcal para un paciente ${patient.genero} de ${patient.edad} años.\n`;
    prompt += `Distribución requerida:\n- Desayuno: ${buildMealSummary('des')}\n- Colación 1: ${buildMealSummary('col1')}\n- Comida: ${buildMealSummary('com')}\n- Colación 2: ${buildMealSummary('col2')}\n- Cena: ${buildMealSummary('cen')}.\n`;
    
    if (patient.suplementos) prompt += `\nSuplementación a incluir: ${patient.suplementos}.`;
    if (aiPromptModifier) prompt += `\nRestricciones/Instrucciones adicionales: ${aiPromptModifier}`;

    try {
      const aiText = await fetchWithRetry(url, { 
        contents: [{ parts: [{ text: prompt }] }], 
        systemInstruction: { parts: [{ text: systemPrompt }] } 
      });

      if (aiText) {
        if (isDouble && aiText.includes('|||')) {
          const parts = aiText.split('|||');
          setMenuText(parts[0].trim());
          setMenuText2(parts[1].trim());
        } else {
          setMenuText(aiText.trim());
          setMenuText2('');
        }
      }
    } catch (error) {
      console.error("Error Menu AI:", error);
      setAlertMessage("No se pudo conectar con la IA de menús. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setIsGeneratingMenu(false);
    }
  };

  // --- 2. EXTRACCIÓN DE LISTA DE COMPRAS INTELIGENTE ---
  const handleGenerateGroceryListAI = async () => {
    if (!menuText && !menuText2) return;
    setIsGeneratingGroceryList(true);
    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const isDouble = menuOptionsCount === 2 && menuText2;
    const prompt = `Analiza los siguientes menús y genera una lista de compras consolidada organizada por pasillos del supermercado con emojis. Calcula un costo monetario aproximado para ${location}.\n\nMENÚ A: ${menuText}\n${isDouble ? 'MENÚ B: ' + menuText2 : ''}`;
    
    const systemInstruction = isDouble 
      ? `Responde exclusivamente en formato JSON con estas llaves: {"listaA": "texto...", "costoA": "monto...", "listaB": "texto...", "costoB": "monto..."}`
      : `Responde exclusivamente en formato JSON con estas llaves: {"lista": "texto...", "costo": "monto..."}`;

    try {
      const aiResponse = await fetchWithRetry(url, { 
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
      });

      // Limpieza de posibles etiquetas markdown para evitar errores de parseo
      const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanJson);

      if (isDouble) {
        setGroceryListText(result.listaA || "");
        setGroceryListText2(result.listaB || "");
        handleExtrasChange('groceryCost', result.costoA || "");
        handleExtrasChange('groceryCost2', result.costoB || "");
      } else {
        setGroceryListText(result.lista || "");
        handleExtrasChange('groceryCost', result.costo || "");
      }
    } catch (err) {
      console.error("Error Grocery AI:", err);
      setAlertMessage("Hubo un error al extraer la lista de compras. Por favor, intenta de nuevo.");
    } finally {
      setIsGeneratingGroceryList(false);
    }
  };

  // --- 3. COMPONENTE DE NAVEGACIÓN Y BOTONES ---
  const NextButton = ({ nextTab, label }) => (
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => { 
          setActiveTab(nextTab); 
          document.getElementById('main-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100 transform active:scale-95"
      >
        Siguiente: {label} <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );

  // --- 4. SISTEMA DE AUTENTICACIÓN CENTRALIZADO ---
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    // Verificación de respaldo local (Fallback)
    if (passwordInput.trim() === FALLBACK_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('nutri_auth', 'true');
      setIsAuthenticating(false);
      return;
    }

    try {
      // Intento de validación remota para sincronización de equipos
      const urlFinal = `${ADMIN_PASSWORD_URL}?id=${APP_ID}`;
      const response = await fetch(urlFinal);
      if (!response.ok) throw new Error("Error de conexión con el servidor de licencias");
      
      const data = await response.json();

      if (passwordInput.trim() === String(data.password).trim()) {
        setIsAuthenticated(true);
        localStorage.setItem('nutri_auth', 'true');
      } else {
        setAuthError('Contraseña incorrecta. Verifica tus credenciales.');
        setPasswordInput('');
      }
    } catch (error) {
      console.warn("Fallo de validación remota, usando bypass de administrador local.");
      setAuthError('Error de red. Intenta con la contraseña de emergencia.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // ==========================================
  // FUNCIONES DE RENDERIZADO DE LA INTERFAZ
  // ==========================================
  const renderHistoria = () => (
    <div className="space-y-4 animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Historia Clínica</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-emerald-600"/> Datos Generales
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-600">Nombre del Paciente</label>
                <input 
                  type="text" name="nombre" value={patient.nombre} onChange={handlePatientChange} onFocus={handleNameFocus}
                  onBlur={() => setTimeout(() => setShowPatientSuggestions(false), 200)}
                  className="mt-1 w-full px-2 py-1.5 text-sm border rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                  placeholder="Ej. Ana Pérez..." autoComplete="off"
                />
                {showPatientSuggestions && (isLoadingHistory || patientSuggestions.length > 0) && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95">
                    {patientSuggestions.map((p, idx) => (
                      <li key={idx} onMouseDown={(e) => { e.preventDefault(); selectPatientSuggestion(p); }} className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">{p.Nombre || p.nombre}</span>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold">Última: {p.Fecha || p.fecha}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Edad (años)</label>
                  <input type="number" name="edad" value={patient.edad} onChange={handlePatientChange} className="mt-1 w-full px-2 py-1.5 text-sm border rounded-md" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Género</label>
                  <select name="genero" value={patient.genero} onChange={handlePatientChange} className="mt-1 w-full px-2 py-1.5 text-sm border rounded-md">
                    <option>Femenino</option>
                    <option>Masculino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Peso Actual (kg)</label>
                  <input type="number" name="peso" value={patient.peso} onChange={handlePatientChange} className="mt-1 w-full px-2 py-1.5 text-sm border rounded-md" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Talla (cm)</label>
                  <input type="number" name="talla" value={patient.talla} onChange={handlePatientChange} className="mt-1 w-full px-2 py-1.5 text-sm border rounded-md" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-600">Peso Meta (kg)</label>
                  <input 
                    type="number" value={extras.pesoMeta || ''} onChange={(e) => handleExtrasChange('pesoMeta', e.target.value)} 
                    className="mt-1 w-full px-2 py-1.5 text-sm border-blue-200 border-2 rounded-md focus:ring-blue-500 bg-blue-50/30 font-bold text-blue-700" 
                    placeholder="Objetivo" 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1">
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center"><Activity className="w-4 h-4 mr-2 text-emerald-600"/> Motivo de Consulta</h3>
            <textarea name="motivoConsulta" value={patient.motivoConsulta} onChange={handlePatientChange} className="w-full flex-1 p-2 text-sm border rounded-md focus:ring-emerald-500 resize-none min-h-[80px]" placeholder="Antecedentes, indicadores clínicos, metas deportivas..."></textarea>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center"><Camera className="w-4 h-4 mr-2 text-emerald-600"/> Fotografía de Control</h3>
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 bg-gray-50 relative group">
            {patient.foto ? (
              <div className="relative w-full aspect-square max-w-[180px] mx-auto rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                <img src={patient.foto} alt="Paciente" className="w-full h-full object-contain p-1" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <button onClick={handleRemovePhoto} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-transform">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2 w-full px-1">
                  <button onClick={() => startCamera('environment')} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-emerald-700">Tomar Foto</button>
                  <button onClick={() => document.getElementById('fileInput').click()} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-[11px] font-bold shadow-sm hover:bg-gray-50">Cargar Archivo</button>
                </div>
              </div>
            )}
            <input id="fileInput" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
        </div>

        {/* TABLA DE CUESTIONARIO CLÍNICO PROFESIONAL */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-3">
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-emerald-600"/> Cuestionario Clínico y Antecedentes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-2.5 font-bold w-1/6">Categoría</th>
                  <th className="p-2.5 font-bold w-2/6">Condición</th>
                  <th className="p-2.5 font-bold w-16 text-center">SÍ</th>
                  <th className="p-2.5 font-bold w-16 text-center">NO</th>
                  <th className="p-2.5 font-bold w-2/6">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {medicalHistory.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-2.5 text-[11px] font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50/30">
                      {idx === 0 || medicalHistory[idx - 1].category !== item.category ? item.category : ''}
                    </td>
                    <td className="p-2.5 text-gray-800 font-medium text-xs sm:text-sm">{item.label}</td>
                    <td className="p-2.5 text-center">
                      <input type="radio" checked={item.siNo === 'SI'} onChange={() => handleMedicalHistoryChange(idx, 'siNo', 'SI')} className="accent-emerald-600 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="radio" checked={item.siNo === 'NO'} onChange={() => handleMedicalHistoryChange(idx, 'siNo', 'NO')} className="accent-red-500 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="p-2.5">
                      <input 
                        type="text" value={item.obs} onChange={(e) => handleMedicalHistoryChange(idx, 'obs', e.target.value)} 
                        className="w-full p-1.5 border border-gray-200 rounded focus:ring-emerald-500 text-xs shadow-inner outline-none" 
                        placeholder={item.siNo === 'SI' ? 'Detalla aquí...' : 'Notas...'} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <NextButton nextTab="antropo" label="Antropometría" />
    </div>
  );

  const renderAntropometria = () => {
    return (
      <div className="space-y-6 animate-in fade-in">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-emerald-600"/> Antropometría y Composición
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECCIÓN 1: PLIEGUES */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Medición de Pliegues (mm)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Tricipital</label>
                  <input type="number" name="pliegueTri" value={antropo.pliegueTri || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Subescapular</label>
                  <input type="number" name="pliegueSub" value={antropo.pliegueSub || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Suprailíaco</label>
                  <input type="number" name="pliegueSupra" value={antropo.pliegueSupra || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Bicipital</label>
                  <input type="number" name="pliegueBici" value={antropo.pliegueBici || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                {extras.showISAK && (
                  <>
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-bold text-purple-600 uppercase">Supraespinal</label>
                      <input type="number" name="pliegueSupraespinal" value={antropo.pliegueSupraespinal || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border border-purple-200 bg-purple-50/50 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-bold text-purple-600 uppercase">Abdominal</label>
                      <input type="number" name="pliegueAbdominal" value={antropo.pliegueAbdominal || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border border-purple-200 bg-purple-50/50 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SECCIÓN 2: CIRCUNFERENCIAS Y DIÁMETROS */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Circunferencias y Diámetros</h3>
                <button 
                  onClick={() => handleExtrasChange('showISAK', !extras.showISAK)} 
                  className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${extras.showISAK ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}
                >
                  {extras.showISAK ? 'MÓDULO ISAK ACTIVO' : 'ACTIVAR MÓDULO ISAK'}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cintura (cm)</label>
                  <input type="number" name="circCintura" value={antropo.circCintura || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Brazo Relaj.</label>
                  <input type="number" name="circBrazo" value={antropo.circBrazo || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">D. Muñeca</label>
                  <input type="number" name="diamMuneca" value={antropo.diamMuneca || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">D. Fémur</label>
                  <input type="number" name="diamFemur" value={antropo.diamFemur || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                {extras.showISAK && (
                  <>
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-bold text-purple-600 uppercase">Brazo Flex.</label>
                      <input type="number" name="circBrazoFlex" value={antropo.circBrazoFlex || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border border-purple-200 bg-purple-50/50 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-bold text-purple-600 uppercase">C. Pantorrilla</label>
                      <input type="number" name="circPantorrilla" value={antropo.circPantorrilla || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border border-purple-200 bg-purple-50/50 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-bold text-purple-600 uppercase">D. Húmero</label>
                      <input type="number" name="diamHumero" value={antropo.diamHumero || ''} onChange={handleAntropoChange} className="mt-1 w-full px-3 py-2 border border-purple-200 bg-purple-50/50 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: RESULTADOS */}
          <div className="space-y-4">
            <div className="bg-emerald-600 p-5 rounded-3xl shadow-lg text-white">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80 text-center">Resultados Siri</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase">Grasa Corporal</span>
                  <span className="text-xl font-black">{bodyComp.siriFat.toFixed(1)}%</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase">Masa Magra</span>
                  <span className="text-xl font-black">{bodyComp.leanMass.toFixed(1)}kg</span>
                </div>
              </div>
            </div>

            {/* CARD DE SOMATOTIPO (Solo si ISAK está activo) */}
            {extras.showISAK && (
              <div className="bg-purple-600 p-5 rounded-3xl shadow-lg text-white animate-in zoom-in-95">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80 text-center">Somatotipo</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/10 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-bold uppercase mb-1">Endo</span>
                    <span className="text-lg font-black">{somatotypeData.endomorphy.toFixed(1)}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-bold uppercase mb-1">Meso</span>
                    <span className="text-lg font-black">{somatotypeData.mesomorphy.toFixed(1)}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-bold uppercase mb-1">Ecto</span>
                    <span className="text-lg font-black">{somatotypeData.ectomorphy.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <NextButton nextTab="get" label="Cálculo de Energía" />
            </div>
          </div>
        </div>
      </div>
    );
  };

{/* RENDER GET CORREGIDO */}
const renderGET = () => (
    <div className="space-y-4 animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Cálculo de Gasto Energético (GET)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Ajustes de Ecuación</h3>
          <div className="space-y-4">
            
            {/* SELECTOR DE FÓRMULA (RECUPERADO) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Fórmula Predictiva</label>
              <div className="flex space-x-6 text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="formula" 
                    value="harris" 
                    checked={energySettings.formula === 'harris'} 
                    onChange={handleEnergyChange} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className={`font-medium ${energySettings.formula === 'harris' ? 'text-emerald-700' : 'text-gray-500'}`}>Harris-Benedict</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="formula" 
                    value="mifflin" 
                    checked={energySettings.formula === 'mifflin'} 
                    onChange={handleEnergyChange} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className={`font-medium ${energySettings.formula === 'mifflin' ? 'text-emerald-700' : 'text-gray-500'}`}>Mifflin-St Jeor</span>
                </label>
              </div>
            </div>

            {/* FACTOR DE ACTIVIDAD */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Factor de Actividad Física (AF %)</label>
                <span className="font-black text-emerald-600 text-sm">{energySettings.af || 0}%</span>
              </div>
              <input 
                type="range" 
                name="af" 
                min="0" 
                max="100" 
                value={energySettings.af || 0} 
                onChange={handleEnergyChange} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
            </div>

            {/* ETA */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Efecto Termogénico (ETA %)</label>
                <span className="font-black text-emerald-600 text-sm">{energySettings.eta || 0}%</span>
              </div>
              <input 
                type="range" 
                name="eta" 
                min="0" 
                max="20" 
                value={energySettings.eta || 0} 
                onChange={handleEnergyChange} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
            </div>
          </div>
        </div>
        
        {/* PANEL DERECHO: RESUMEN CALÓRICO (Estilo Captura) */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Calculator className="w-32 h-32" />
          </div>
          
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest relative z-10 border-b border-slate-800 pb-2">Resumen Calórico Objetivo</h3>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-medium">Metabolismo Basal (GEB)</span>
              <span className="font-black text-lg">{energy.geb.toFixed(0)} <small className="text-[10px] text-slate-500">kcal</small></span>
            </div>
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-medium">Actividad (+{energySettings.af}%)</span>
              <span className="font-bold text-blue-400">+{energy.afKcal.toFixed(0)} <small className="text-[10px] opacity-70">kcal</small></span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-medium">ETA (+{energySettings.eta}%)</span>
              <span className="font-bold text-orange-400">+{energy.etaKcal.toFixed(0)} <small className="text-[10px] opacity-70">kcal</small></span>
            </div>

            <div className="flex justify-between items-end pt-4">
              <div>
                <span className="text-emerald-400 font-black text-xs uppercase tracking-tighter block">Meta Diaria</span>
                <span className="text-emerald-400 font-black text-4xl leading-none">
                  {energy.get.toFixed(0)}
                </span>
              </div>
              <span className="text-emerald-400/50 font-bold text-xl pb-1 ml-1">kcal</span>
            </div>
          </div>
        </div>

      </div>
      <NextButton nextTab="cuadro" label="Cuadro Dietosintético" />
    </div>
  );

  const renderCuadroDietosintetico = () => {
    const sumPercents = macros.protPercent + macros.lipPercent + macros.hcPercent;
    
    return (
      <div className="space-y-4 animate-in fade-in">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Cuadro Dietosintético y Equivalentes</h2>
        
        {/* 👇 1. ASISTENTE DE CUADRE (SOLO VISIBLE SI SHOWGUIDES ES TRUE) */}
        {showGuides && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="hidden md:flex w-10 h-10 bg-indigo-100 rounded-full items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-indigo-700" />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-indigo-800 mb-1 block">
                Asistente de Cuadre Automático
              </label>
              <input
                type="text"
                value={aiPortionsPromptModifier}
                onChange={(e) => setAiPortionsPromptModifier(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isGeneratingPortions && handleGeneratePortionsAI()}
                placeholder="Ej. Paciente vegetariano estricto, sin lácteos..."
                className="w-full px-2 py-1.5 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner"
              />
            </div>
            <button 
              onClick={handleGeneratePortionsAI}
              disabled={isGeneratingPortions}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-all text-sm font-bold mt-2 md:mt-0"
            >
              {isGeneratingPortions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Cuadrar
            </button>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <h3 className="text-base font-semibold text-gray-700 mr-3">Distribución de Macros</h3>
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${sumPercents === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                Total: {sumPercents}%
              </span>
            </div>
            
            {/* 👇 2. BOTONES DE IA Y PRESETS (SOLO VISIBLE SI SHOWGUIDES ES TRUE) */}
            {showGuides && (
              <div className="flex flex-wrap gap-2 items-center">
                <button 
                  onClick={handleGenerateMacrosAI}
                  disabled={isGeneratingMacros}
                  className="px-3 py-1.5 text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center disabled:opacity-70"
                  title="Calcula los macros ideales usando la Historia Clínica, Observaciones y GET"
                >
                  {isGeneratingMacros ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1.5" />}
                  {isGeneratingMacros ? "Analizando perfil..." : "Sugerir con IA"}
                </button>

                <div className="h-5 w-px bg-gray-200 hidden md:block mx-1"></div>

                <button onClick={() => setMacros({ protPercent: 20, lipPercent: 25, hcPercent: 55 })} className="px-2 py-1 text-[10px] font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shadow-sm active:scale-95">20/25/55</button>
                <button onClick={() => setMacros({ protPercent: 25, lipPercent: 35, hcPercent: 40 })} className="px-2 py-1 text-[10px] font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shadow-sm active:scale-95">Low-Carb</button>
              </div>
            )}
          </div>

          {/* INPUTS DE MACROS (Siempre visibles para trabajo manual) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <label className="block text-xs font-bold text-blue-800 mb-1.5">Proteínas</label>
              <div className="flex items-center space-x-1">
                <input type="number" name="protPercent" value={macros.protPercent} onChange={handleMacroChange} className="w-16 px-2 py-1 text-center text-sm font-black border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                <span className="text-xs font-bold text-blue-700">%</span>
              </div>
              <div className="mt-2 text-[11px] text-blue-800 font-bold bg-blue-100/50 inline-block px-2 py-0.5 rounded-md">{targets.protG.toFixed(1)}g</div>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <label className="block text-xs font-bold text-amber-800 mb-1.5">Lípidos</label>
              <div className="flex items-center space-x-1">
                <input type="number" name="lipPercent" value={macros.lipPercent} onChange={handleMacroChange} className="w-16 px-2 py-1 text-center text-sm font-black border border-gray-300 rounded focus:ring-2 focus:ring-amber-500" />
                <span className="text-xs font-bold text-amber-700">%</span>
              </div>
              <div className="mt-2 text-[11px] text-amber-800 font-bold bg-amber-100/50 inline-block px-2 py-0.5 rounded-md">{targets.lipG.toFixed(1)}g</div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
              <label className="block text-xs font-bold text-purple-800 mb-1.5">Carbohidratos</label>
              <div className="flex items-center space-x-1">
                <input type="number" name="hcPercent" value={macros.hcPercent} onChange={handleMacroChange} className="w-16 px-2 py-1 text-center text-sm font-black border border-gray-300 rounded focus:ring-2 focus:ring-purple-500" />
                <span className="text-xs font-bold text-purple-700">%</span>
              </div>
              <div className="mt-2 text-[11px] text-purple-800 font-bold bg-purple-100/50 inline-block px-2 py-0.5 rounded-md">{targets.hcG.toFixed(1)}g</div>
            </div>
          </div>
        </div>

        {/* TABLA DE EQUIVALENTES (Siempre visible) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-2">Grupo de Alimento</th>
                  <th className="px-2 py-2 w-20 text-center">Porciones</th>
                  <th className="px-2 py-2 text-right">Kcal</th>
                  <th className="px-2 py-2 text-right">Prot</th>
                  <th className="px-2 py-2 text-right">Lip</th>
                  <th className="px-2 py-2 text-right">HC</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(SMAE).map(([key, data]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-1 font-medium text-gray-800">{data.nombre}</td>
                    <td className="px-2 py-1">
                      <input type="number" min="0" step="0.5" value={portions[key] || ''} onChange={(e) => handlePortionChange(key, e.target.value)} className="w-full p-1 border text-center rounded" />
                    </td>
                    <td className="px-2 py-1 text-right text-gray-500">{((portions[key] || 0) * data.energia).toFixed(0)}</td>
                    <td className="px-2 py-1 text-right">{((portions[key] || 0) * data.prot).toFixed(1)}</td>
                    <td className="px-2 py-1 text-right">{((portions[key] || 0) * data.lip).toFixed(1)}</td>
                    <td className="px-2 py-1 text-right">{((portions[key] || 0) * data.hc).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <NextButton nextTab="distribucion" label="Distribución de Menú" />
      </div>
    );
  };

  const renderDistribucion = () => {
    return (
      <div className="space-y-4 animate-in fade-in">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Distribución de Equivalentes por Tiempo de Comida</h2>
        
        {/* 👇 ASISTENTE DE ACOMODO (SOLO VISIBLE SI SHOWGUIDES ES TRUE) */}
        {showGuides && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="hidden md:flex w-10 h-10 bg-amber-100 rounded-full items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-amber-800 mb-1 block">
                Asistente de Acomodo de Menú
              </label>
              <input
                type="text"
                value={aiDistributionPromptModifier}
                onChange={(e) => setAiDistributionPromptModifier(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isGeneratingDistribution && handleGenerateDistributionAI()}
                placeholder="Ej. Cena muy ligera, pan en la mañana..."
                className="w-full px-2 py-1.5 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-500 text-sm shadow-inner"
              />
            </div>
            <button 
              onClick={handleGenerateDistributionAI}
              disabled={isGeneratingDistribution}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 shadow-sm transition-all text-sm font-bold mt-2 md:mt-0"
            >
              {isGeneratingDistribution ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Distribuir
            </button>
          </div>
        )}

        {/* TABLA DE DISTRIBUCIÓN (Siempre visible para llenado manual) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-1.5">Grupo</th>
                  <th className="px-2 py-1.5 text-center bg-gray-100">Total</th>
                  <th className="px-1 py-1.5 text-center">Desayuno</th>
                  <th className="px-1 py-1.5 text-center">Col 1</th>
                  <th className="px-1 py-1.5 text-center">Comida</th>
                  <th className="px-1 py-1.5 text-center">Col 2</th>
                  <th className="px-1 py-1.5 text-center">Cena</th>
                  <th className="px-2 py-1.5 text-center bg-gray-100">Resto</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(SMAE).map(([key, data]) => {
                  const targetPortion = portions[key] || 0;
                  if (targetPortion === 0) return null;

                  const sumDist = (distribution[key].des || 0) + (distribution[key].col1 || 0) + 
                                  (distribution[key].com || 0) + (distribution[key].col2 || 0) + 
                                  (distribution[key].cen || 0);
                  const remaining = targetPortion - sumDist;

                  return (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="px-2 py-1 font-medium text-gray-800">{data.nombre}</td>
                      <td className="px-2 py-1 text-center font-bold bg-gray-50">{targetPortion}</td>
                      <td className="px-1 py-0.5">
                        <input type="number" min="0" step="0.5" value={distribution[key].des || ''} onChange={(e) => handleDistributionChange(key, 'des', e.target.value)} className="w-12 p-0.5 border text-center mx-auto block rounded focus:ring-emerald-500" />
                      </td>
                      <td className="px-1 py-0.5">
                        <input type="number" min="0" step="0.5" value={distribution[key].col1 || ''} onChange={(e) => handleDistributionChange(key, 'col1', e.target.value)} className="w-12 p-0.5 border text-center mx-auto block rounded focus:ring-emerald-500" />
                      </td>
                      <td className="px-1 py-0.5">
                        <input type="number" min="0" step="0.5" value={distribution[key].com || ''} onChange={(e) => handleDistributionChange(key, 'com', e.target.value)} className="w-12 p-0.5 border text-center mx-auto block rounded focus:ring-emerald-500" />
                      </td>
                      <td className="px-1 py-0.5">
                        <input type="number" min="0" step="0.5" value={distribution[key].col2 || ''} onChange={(e) => handleDistributionChange(key, 'col2', e.target.value)} className="w-12 p-0.5 border text-center mx-auto block rounded focus:ring-emerald-500" />
                      </td>
                      <td className="px-1 py-0.5">
                        <input type="number" min="0" step="0.5" value={distribution[key].cen || ''} onChange={(e) => handleDistributionChange(key, 'cen', e.target.value)} className="w-12 p-0.5 border text-center mx-auto block rounded focus:ring-emerald-500" />
                      </td>
                      <td className={`px-2 py-1 text-center font-bold bg-gray-50 ${remaining === 0 ? 'text-emerald-600' : remaining < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                        {remaining !== 0 ? (remaining > 0 ? `Falta ${remaining}` : `Sobra ${Math.abs(remaining)}`) : 'OK'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <NextButton nextTab="menu" label="Menú y Notas" />
      </div>
    );
  };

  const renderMenuYNotas = () => {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">Menú Sugerido y Notas</h2>
        </div>

        {/* 1. CALCULADORA DE SUPLEMENTOS */}
        {showGuides && (
          <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-3">
              <div>
                <h3 className="text-base font-bold text-blue-800 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-blue-600" fill="currentColor"/> Calculadora de Suplementos
                </h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                    Peso Base: {patient.peso} kg
                  </span>
                </div>
              </div>
              <button
                onClick={handleGenerateSupplementsAI}
                disabled={isGeneratingSupplements}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm w-full md:w-auto shrink-0"
              >
                {isGeneratingSupplements ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Calcular Dosis (IA)
              </button>
            </div>
            <textarea 
              name="suplementos" 
              value={patient.suplementos || ''} 
              onChange={handlePatientChange} 
              className="w-full flex-1 p-2 text-sm border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[60px] bg-white shadow-inner font-medium text-gray-800" 
              placeholder="Sugerencias de suplementación..."
            ></textarea>
          </div>
        )}

        {/* 2. PANEL DE CONTROL DE LA IA */}
        {showGuides && (
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col shadow-sm gap-3">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
              <div className="hidden md:flex w-10 h-10 bg-emerald-200 rounded-full items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              
              <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-emerald-800">¿Opciones?</label>
                    <div className="flex gap-2">
                      <button onClick={() => setMenuOptionsCount(1)} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors border ${menuOptionsCount === 1 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-emerald-700 border-emerald-200'}`}>1 Opción</button>
                      <button onClick={() => setMenuOptionsCount(2)} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors border ${menuOptionsCount === 2 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-emerald-700 border-emerald-200'}`}>2 Opciones</button>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ETIQUETAS RÁPIDAS (PUNTO A) */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <button
                    onClick={() => {
                      const ctx = buildClinicalContext();
                      setAiPromptModifier(prev => prev ? `${prev}\n\n${ctx}` : ctx);
                    }}
                    className="px-2 py-1 bg-indigo-100 border border-indigo-300 text-indigo-800 hover:bg-indigo-200 rounded-md text-[10px] font-black shadow-sm flex items-center gap-1"
                  >
                    <UserCircle2 className="w-3 h-3" /> Importar Perfil
                  </button>

                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => addQuickPrompt(qp.text)}
                      className="px-2 py-1 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-md text-[10px] font-bold shadow-sm"
                    >
                      <span>{qp.icon}</span> {qp.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={aiPromptModifier}
                  onChange={(e) => setAiPromptModifier(e.target.value)}
                  placeholder="Instrucciones para la IA..."
                  className="w-full px-3 py-2 border border-emerald-200 rounded-md text-sm shadow-inner min-h-[80px] resize-none"
                />
              </div>

              <button 
                onClick={handleGenerateMenuAI}
                disabled={isGeneratingMenu}
                className="w-full md:w-auto md:h-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold disabled:opacity-70 self-stretch"
              >
                {isGeneratingMenu ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isGeneratingMenu ? "Generando..." : "Generar Menú"}
              </button>
            </div>
          </div>
        )}

        {/* 3. LAYOUT DE MENÚS (PUNTO B) */}
        <div className={`grid gap-3 sm:gap-4 ${menuOptionsCount === 2 || menuText2 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col min-h-[250px] lg:h-[300px]">
            <div className="flex justify-between items-center mb-2 border-b border-emerald-100 pb-2">
              <h3 className="text-base font-bold text-emerald-800 flex items-center">
                <Utensils className="w-4 h-4 mr-2" /> {menuOptionsCount === 2 ? 'Opción A' : 'Plan Detallado'}
              </h3>
              {showGuides && (
                <button 
                  onClick={() => { setLibType('menus'); setActiveLibFolder('KETO'); setShowLibModal(true); }}
                  className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-black border border-emerald-200 shadow-sm"
                >
                  <FolderOpen className="w-3 h-3 mr-1" /> Mis Menús
                </button>
              )}
            </div>
            <textarea
              value={menuText}
              onChange={(e) => setMenuText(e.target.value)}
              className="w-full flex-1 p-2 border border-emerald-200 rounded-md text-sm font-medium text-gray-900 leading-relaxed shadow-inner resize-none"
            ></textarea>
          </div>

          {(menuOptionsCount === 2 || menuText2) && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-teal-100 flex flex-col min-h-[250px] lg:h-[300px]">
              <h3 className="text-base font-bold text-teal-800 mb-2 flex items-center">
                <Utensils className="w-4 h-4 mr-2" /> Opción B
              </h3>
              <textarea
                value={menuText2}
                onChange={(e) => setMenuText2(e.target.value)}
                className="w-full flex-1 p-2 border border-teal-200 rounded-md text-sm font-medium text-gray-900 leading-relaxed shadow-inner resize-none"
              ></textarea>
            </div>
          )}
        </div>

        {/* 4. RECOMENDACIONES GENERALES */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col min-h-[100px] lg:h-[150px]">
          <div className="flex justify-between items-center mb-2 border-b border-blue-100 pb-2">
            <h3 className="text-base font-bold text-blue-800 flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Recomendaciones Generales
            </h3>
            {showGuides && (
              <button 
                onClick={() => { setLibType('notas'); setActiveLibFolder('DIGESTIÓN'); setShowLibModal(true); }}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-black border border-blue-200 shadow-sm"
              >
                <BookOpen className="w-3 h-3 mr-1" /> Mis Notas
              </button>
            )}
          </div>
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            className="w-full flex-1 p-2 border border-blue-200 rounded-md text-sm font-medium text-gray-900 leading-relaxed shadow-inner resize-none"
            placeholder="Ej. Tomar 2 litros de agua al día..."
          ></textarea>
        </div>

        {/* 5. LISTA DE COMPRAS */}
        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col gap-3 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-bold text-orange-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 mr-2" /> Lista de Compras
            </h3>
            {showGuides && (
              <button
                onClick={() => {
                  if (!hasPlusPlan) { setAlertMessage("Requiere Plan Plus."); return; }
                  handleGenerateGroceryListAI();
                }}
                disabled={isGeneratingGroceryList || (!menuText && !menuText2)}
                className="flex items-center px-3 py-1.5 rounded-md text-xs font-bold bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200"
              >
                {isGeneratingGroceryList ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1.5" />}
                Extraer del Menú
              </button>
            )}
          </div>
          <div className={`grid gap-3 sm:gap-4 ${(menuOptionsCount === 2 && menuText2) ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 flex flex-col min-h-[150px]">
              <textarea
                value={groceryListText}
                onChange={(e) => setGroceryListText(e.target.value)}
                className="w-full flex-1 p-2 border border-orange-100 rounded-md text-sm font-medium text-gray-900 shadow-inner resize-none"
                placeholder="Ingredientes..."
              ></textarea>
            </div>
            {(menuOptionsCount === 2 && menuText2) && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 flex flex-col min-h-[150px]">
                <textarea
                  value={groceryListText2}
                  onChange={(e) => setGroceryListText2(e.target.value)}
                  className="w-full flex-1 p-2 border border-orange-100 rounded-md text-sm font-medium text-gray-900 shadow-inner resize-none"
                  placeholder="Ingredientes Opción B..."
                ></textarea>
              </div>
            )}
          </div>
        </div>

        {/* 6. BOTONES FINALES (GUARDAR/PDF) */}
        <div className="mt-4 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-3 border-t pt-4">
          <button onClick={() => window.open(sheetsUrl, '_blank')} className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-bold border border-gray-300 shadow-sm"><ExternalLink className="w-4 h-4 mr-2" /> Abrir Tabla</button>
          <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="flex items-center justify-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold border border-emerald-300 shadow-sm">{isGeneratingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Descargar PDF</button>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm">{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Guardar Paciente</button>
        </div>
      </div>
    );
  };

  // ==========================================
  // PANTALLAS PRINCIPALES (PDF, LOGIN, APP)
  // ==========================================

  if (isPrinting) {
    const tallaM = patient.talla / 100;
    const imc = (patient.peso / (tallaM * tallaM)).toFixed(1);
    const getImcClass = (val) => {
      if (val < 18.5) return "Bajo Peso";
      if (val < 25) return "Normal";
      if (val < 30) return "Sobrepeso";
      return "Obesidad";
    };
    const imcClass = getImcClass(imc);

    // Lógica de validación de contenido (Elasticidad)
    const tieneCita = extras.agendaDate && extras.agendaDate.trim() !== "";
    const tieneSuplementos = patient.suplementos && patient.suplementos.trim() !== "";
    const tieneAlertas = medicalHistory.filter(i => i.siNo === 'SI').length > 0;
    const tieneMenuA = menuText && menuText.trim().length > 0;
    const tieneMenuB = menuText2 && menuText2.trim().length > 0;
    const tieneNotas = notesText && notesText.trim().length > 0;
    const tieneSuper = groceryListText && groceryListText.trim().length > 0;
    const tieneRutina = extras.workoutRoutine && extras.workoutRoutine.trim().length > 0;
    const tieneLabs = extras.labsFeedback || extras.labs?.glucosa || extras.labs?.colesterol || extras.labs?.trigliceridos;

    return (
      <div id="pdf-content" className="p-10 max-w-5xl mx-auto bg-white text-black font-sans relative border-[12px] border-emerald-50">
        <div className="relative z-10 space-y-6">
          
          {/* CABECERA */}
          <div className="flex items-center justify-between border-b-4 border-emerald-600 pb-6">
            <div>
              <h1 className="text-3xl font-black text-emerald-800 tracking-tighter uppercase">{professionalName}</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Asesoría Nutricional y Deportiva Especializada</p>
            </div>
            <div className="text-right">
              <p className="font-black text-2xl text-slate-800 uppercase tracking-tight">{patient.nombre || 'Expediente'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Consulta: {new Date().toLocaleDateString()}</p>
              {tieneCita && (
                <p className="text-[10px] text-purple-600 font-black mt-1 uppercase bg-purple-50 px-2 py-0.5 rounded-lg inline-block">
                  PRÓXIMA CITA: {extras.agendaDate} {extras.agendaTime ? `@ ${extras.agendaTime}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* 1. DATOS GENERALES Y CLÍNICOS */}
          <section className="break-inside-avoid h-auto">
            <h2 className="text-[11px] font-black text-white bg-slate-800 px-3 py-1 inline-block uppercase tracking-widest mb-3">1. Datos Generales y Antecedentes</h2>
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="border-l-2 border-emerald-500 pl-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase block">Edad</span>
                <span className="text-xs font-black">{patient.edad} años</span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase block">Género</span>
                <span className="text-xs font-black">{patient.genero}</span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase block">Peso</span>
                <span className="text-xs font-black">{patient.peso} kg</span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase block">Talla</span>
                <span className="text-xs font-black">{patient.talla} cm</span>
              </div>
              <div className="border-l-2 border-blue-500 pl-2">
                <span className="text-[8px] font-bold text-blue-400 uppercase block">Peso Meta</span>
                <span className="text-xs font-black text-blue-700">{extras.pesoMeta || '--'} kg</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.motivoConsulta && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 h-auto font-medium">
                  <p className="font-bold text-emerald-800 mb-1 uppercase text-[9px]">Notas Clínicas:</p>
                  <p className="text-[11px] text-gray-700 leading-relaxed italic">"{patient.motivoConsulta}"</p>
                </div>
              )}
              {tieneSuplementos && (
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 h-auto">
                  <p className="font-bold text-blue-800 mb-1 uppercase text-[9px] flex items-center"><Zap size={12} className="mr-1" /> Plan de Suplementación:</p>
                  <div className="text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">{patient.suplementos}</div>
                </div>
              )}
            </div>
          </section>

          {/* 2. COMPOSICIÓN E ISAK */}
          <section className="break-inside-avoid h-auto">
            <h2 className="text-[11px] font-black text-white bg-slate-800 px-3 py-1 inline-block uppercase tracking-widest mb-3">2. Composición e Indicadores ISAK</h2>
            <div className="grid grid-cols-3 gap-4 h-auto">
              <div className="bg-emerald-600 p-4 rounded-3xl text-white flex flex-col justify-center items-center shadow-md">
                <span className="text-[9px] font-bold opacity-80 uppercase block">Grasa Corporal</span>
                <p className="text-4xl font-black">{bodyComp?.siriFat?.toFixed(1) || 0}%</p>
                <p className="text-[9px] mt-1 font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">Masa Magra: {bodyComp?.leanMass?.toFixed(1) || 0}kg</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200 flex flex-col justify-center items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">IMC (Estado)</span>
                <p className="text-xl font-black text-slate-800">{imc} <small className="text-[10px]">kg/m²</small></p>
                
                {/* REEMPLAZO BLINDADO: Filtro inteligente para atletas */}
                <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1 text-center">
                  {(parseFloat(imc) >= 25 && parseFloat(imc) < 30 && (parseFloat(bodyComp?.siriFat) <= 15 || parseFloat(somatotypeData?.mesomorphy) >= 5.0)) 
                    ? "ATLÉTICO (ALTA MASA MAGRA)" 
                    : imcClass}
                </p>

              </div>
              <div className="bg-purple-600 p-4 rounded-3xl text-white flex flex-col justify-center items-center shadow-md">
                <span className="text-[9px] font-bold opacity-80 uppercase block">Somatotipo</span>
                <div className="flex space-x-3 text-center">
                  <div><p className="text-[7px] font-bold">ENDO</p><p className="text-lg font-black">{somatotypeData?.endomorphy?.toFixed(1) || 0}</p></div>
                  <div><p className="text-[7px] font-bold">MESO</p><p className="text-lg font-black">{somatotypeData?.mesomorphy?.toFixed(1) || 0}</p></div>
                  <div><p className="text-[7px] font-bold">ECTO</p><p className="text-lg font-black">{somatotypeData?.ectomorphy?.toFixed(1) || 0}</p></div>
                </div>
              </div>
            </div>

            {/* TABLA DETALLADA DE MEDIDAS (NUEVO) */}
            <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200 p-4">
              <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Registro de Medidas Antropométricas</h3>
              <div className="grid grid-cols-3 gap-4 text-[9px]">
                {/* Pliegues */}
                <div>
                  <p className="font-bold text-emerald-700 mb-1">PLIEGUES (mm)</p>
                  <ul className="text-slate-600 space-y-0.5">
                    {antropo?.pliegueTri ? <li>Tricipital: <b>{antropo.pliegueTri}</b></li> : null}
                    {antropo?.pliegueSub ? <li>Subescapular: <b>{antropo.pliegueSub}</b></li> : null}
                    {antropo?.pliegueSupra ? <li>Suprailíaco: <b>{antropo.pliegueSupra}</b></li> : null}
                    {antropo?.pliegueBici ? <li>Bicipital: <b>{antropo.pliegueBici}</b></li> : null}
                    {antropo?.pliegueSupraespinal ? <li>Supraespinal: <b>{antropo.pliegueSupraespinal}</b></li> : null}
                    {antropo?.pliegueAbdominal ? <li>Abdominal: <b>{antropo.pliegueAbdominal}</b></li> : null}
                    {antropo?.pliegueMuslo ? <li>Muslo: <b>{antropo.pliegueMuslo}</b></li> : null}
                    {antropo?.plieguePantorrilla ? <li>Pantorrilla: <b>{antropo.plieguePantorrilla}</b></li> : null}
                  </ul>
                </div>
                {/* Circunferencias */}
                <div>
                  <p className="font-bold text-blue-700 mb-1">CIRCUNFERENCIAS (cm)</p>
                  <ul className="text-slate-600 space-y-0.5">
                    {antropo?.circCintura ? <li>Cintura: <b>{antropo.circCintura}</b></li> : null}
                    {antropo?.circCadera ? <li>Cadera: <b>{antropo.circCadera}</b></li> : null}
                    {antropo?.circBrazo ? <li>Brazo Relajado: <b>{antropo.circBrazo}</b></li> : null}
                    {antropo?.circBrazoFlex ? <li>Brazo Flexionado: <b>{antropo.circBrazoFlex}</b></li> : null}
                    {antropo?.circPantorrilla ? <li>Pantorrilla: <b>{antropo.circPantorrilla}</b></li> : null}
                  </ul>
                </div>
                {/* Diámetros */}
                <div>
                  <p className="font-bold text-purple-700 mb-1">DIÁMETROS (cm)</p>
                  <ul className="text-slate-600 space-y-0.5">
                    {antropo?.diamMuneca ? <li>Muñeca: <b>{antropo.diamMuneca}</b></li> : null}
                    {antropo?.diamHumero ? <li>Húmero: <b>{antropo.diamHumero}</b></li> : null}
                    {antropo?.diamFemur ? <li>Fémur: <b>{antropo.diamFemur}</b></li> : null}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 3. ALIMENTACIÓN (Elasticidad Total) */}
          {(tieneMenuA || tieneMenuB || tieneNotas) && (
            <section className="h-auto">
              <h2 className="text-[11px] font-black text-white bg-slate-800 px-3 py-1 inline-block uppercase tracking-widest mb-3">3. Guía de Alimentación Diaria</h2>
              <div className="space-y-4">
                {tieneMenuA && (
                  <div className="p-6 bg-white border-2 border-emerald-100 rounded-[2.5rem] shadow-sm relative h-auto">
                    <div className="absolute top-0 right-10 p-2 bg-emerald-500 text-white font-black text-[9px] rounded-b-xl uppercase tracking-widest">Opción Principal</div>
                    <div className="text-[12px] leading-relaxed text-slate-800 whitespace-pre-wrap font-medium">{menuText}</div>
                  </div>
                )}
                {tieneMenuB && (
                  <div className="p-6 bg-white border-2 border-teal-100 rounded-[2.5rem] shadow-sm relative h-auto">
                    <div className="absolute top-0 right-10 p-2 bg-teal-500 text-white font-black text-[9px] rounded-b-xl uppercase tracking-widest">Opción Sugerida</div>
                    <div className="text-[12px] leading-relaxed text-slate-800 whitespace-pre-wrap font-medium">{menuText2}</div>
                  </div>
                )}
                {tieneNotas && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 h-auto">
                    <p className="text-[9px] font-black text-amber-700 mb-1 uppercase tracking-widest">Notas Especiales:</p>
                    <div className="text-[11px] text-gray-700 whitespace-pre-wrap font-medium italic">{notesText}</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. PLUS: LABORATORIOS Y COMPRAS */}
          {(tieneLabs || tieneSuper) && (
            <section className="h-auto break-inside-avoid">
              <h2 className="text-[11px] font-black text-white bg-slate-800 px-3 py-1 inline-block uppercase tracking-widest mb-3">4. Laboratorios y Complementos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tieneLabs && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-3xl">
                    <p className="font-black text-red-700 mb-2 uppercase text-[9px] flex items-center"><TestTube size={14} className="mr-2" /> Marcadores en Sangre</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white p-2 rounded-xl text-center border border-red-50 shadow-sm"><p className="text-[7px] font-bold text-gray-400 uppercase">Glucosa</p><p className="text-xs font-black text-red-600">{extras.labs?.glucosa || '--'} <small className="text-[7px]">mg/dL</small></p></div>
                      <div className="bg-white p-2 rounded-xl text-center border border-red-50 shadow-sm"><p className="text-[7px] font-bold text-gray-400 uppercase">Colest.</p><p className="text-xs font-black text-red-600">{extras.labs?.colesterol || '--'} <small className="text-[7px]">mg/dL</small></p></div>
                      <div className="bg-white p-2 rounded-xl text-center border border-red-50 shadow-sm"><p className="text-[7px] font-bold text-gray-400 uppercase">Triglic.</p><p className="text-xs font-black text-red-600">{extras.labs?.trigliceridos || '--'} <small className="text-[7px]">mg/dL</small></p></div>
                    </div>
                    {extras.labsFeedback && <p className="text-[10px] text-gray-800 font-bold bg-white/50 p-2 rounded-xl italic leading-tight">{extras.labsFeedback}</p>}
                  </div>
                )}
                {tieneSuper && (
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 h-auto">
                    <p className="font-black text-slate-800 mb-3 uppercase text-[9px] border-b pb-1">Lista de Súper Inteligente:</p>
                    <div className="text-[10px] text-slate-600 whitespace-pre-wrap leading-tight font-medium">{groceryListText}</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 5. ENTRENAMIENTO */}
          {tieneRutina && (
            <section className="h-auto">
              <h2 className="text-[11px] font-black text-white bg-slate-800 px-3 py-1 inline-block uppercase tracking-widest mb-3">5. Programación de Entrenamiento</h2>
              <div className="p-6 bg-slate-900 text-white rounded-[2rem] border border-slate-800 shadow-xl h-auto">
                <p className="font-black text-emerald-400 mb-3 uppercase text-[9px] flex items-center tracking-widest"><Dumbbell size={14} className="mr-2" /> Plan Sugerido:</p>
                <div className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono font-medium">{extras.workoutRoutine}</div>
              </div>
            </section>
          )}

          {/* FIRMA Y PIE DE PÁGINA */}
          <div className="pt-10 text-center border-t border-dashed border-gray-300 break-inside-avoid">
             <div className="flex justify-between items-end">
               <div className="text-left">
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{professionalName}</p>
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Nutriólogo Clínico • {location}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black text-emerald-600 tracking-tighter">NUTRI HEALTH V2.0 PRO</p>
                 <p className="text-[8px] text-gray-300 font-bold uppercase">Expediente Clínico Certificado</p>
               </div>
             </div>
          </div>

        </div> 
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginNutriHealth 
        isDarkMode={false}
        onComplete={async (userData, setLoginError, setIsLoginLoading) => {
          setIsLoginLoading(true);
          
          // 1. Verificación de Respaldo Local (Tu contraseña de emergencia)
          if (userData.password.trim() === FALLBACK_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('nutri_auth', 'true');
            setIsLoginLoading(false);
            return;
          }

          // 2. Verificación Remota con tu Servidor
          try {
            const urlFinal = `${ADMIN_PASSWORD_URL}?id=${APP_ID}`;
            const response = await fetch(urlFinal);
            if (!response.ok) throw new Error("Error de conexión");
            
            const data = await response.json();

            if (userData.password.trim() === String(data.password).trim()) {
              setIsAuthenticated(true);
              localStorage.setItem('nutri_auth', 'true');
            } else {
              setLoginError('Contraseña incorrecta. Verifica tus credenciales.');
            }
          } catch (error) {
            setLoginError('Error de red. Intenta con la contraseña de emergencia.');
          } finally {
            setIsLoginLoading(false);
          }
        }}
      />
    );
  }

  return (
    <MuroDePago accesoReal={accesoPermitido}>
      <div className={`flex bg-gray-50 font-sans text-gray-900 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-[99999] w-screen h-screen m-0 p-0' : 'h-screen w-full relative'}`}>
      
      {alertMessage && (
        <div className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center text-amber-600 mb-4">
              <ShieldQuestion className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Aviso</h3>
            </div>
            <p className="text-gray-700 mb-6 font-medium leading-relaxed">{alertMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertMessage('')}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`bg-emerald-800 text-white w-64 flex flex-col transition-transform duration-300 ease-in-out z-20 absolute lg:relative lg:translate-x-0 h-full ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 text-center border-b border-emerald-700/50">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-800">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-wider">NUTRI <span className="text-emerald-300">HEALTH</span></h1>
          <p className="text-emerald-200 text-[10px] mt-1">Expediente Clínico</p>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${isActive ? 'bg-emerald-700 text-white font-medium shadow-inner' : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'}`}
              >
                <Icon className="w-4 h-4 mr-3" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </button>
            )
          })}
        </nav>
        
        <div className="p-3 border-t border-emerald-700/50 space-y-2 overflow-y-auto max-h-64">
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { setShowHelpModal(true); setHelpView('selection'); setIsMobileMenuOpen(false); }} title="Ayuda y Guías" className="flex flex-col items-center justify-center p-2 bg-emerald-800 hover:bg-emerald-700 border border-emerald-600/50 rounded-lg transition-colors text-[10px] font-medium text-emerald-100">
              <ShieldQuestion className="w-4 h-4 mb-1 text-emerald-300" fill="rgba(16, 185, 129, 0.2)" /> Ayuda
            </button>
            <button onClick={() => window.open(sheetsUrl, '_blank')} title="Base de Datos" className="flex flex-col items-center justify-center p-2 bg-teal-800 hover:bg-teal-700 border border-teal-600/50 rounded-lg transition-colors text-[10px] font-medium text-teal-100">
              <Database className="w-4 h-4 mb-1 text-teal-300" /> BD
            </button>
            <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} title="Descargar PDF" className="flex flex-col items-center justify-center p-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:bg-emerald-50 rounded-lg transition-colors text-[10px] font-bold">
              {isGeneratingPDF ? <Loader2 className="w-4 h-4 mb-1 animate-spin" /> : <Download className="w-4 h-4 mb-1" />} PDF
            </button>
          </div>

          <button onClick={() => setShowNewConfirm(true)} className="w-full flex items-center justify-center px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors text-sm font-medium">
            <PlusCircle className="w-3 h-3 mr-2" /> Nuevo Paciente
          </button>
          <button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 rounded-lg transition-colors text-sm font-medium">
            {isSaving ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />} {isSaving ? "Guardando..." : "Guardar"}
          </button>

          <button onClick={() => { localStorage.removeItem('nutri_auth'); setIsAuthenticated(false); }} className="w-full flex items-center justify-center px-3 py-1.5 mt-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-[11px] font-bold border border-red-100">
            <Lock className="w-3 h-3 mr-1.5" /> Bloquear Sistema
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {showSaveMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-100 border border-emerald-400 text-emerald-800 px-6 py-4 rounded-xl shadow-lg flex items-center animate-in fade-in slide-in-from-top-5">
          <CheckCircle className="w-6 h-6 mr-3 text-emerald-600" />
          <span className="font-medium text-lg">¡Guardado exitosamente!</span>
        </div>
      )}

      {showFullscreenWarning && (
        <div className="fixed top-6 right-6 z-[99999] bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl shadow-lg flex items-center animate-in fade-in slide-in-from-top-5 max-w-sm">
          <Maximize className="w-6 h-6 mr-3 text-blue-600 shrink-0" />
          <span className="font-medium text-xs">
            <strong>Modo expandido.</strong><br/>
            Maximiza tu navegador manualmente (cuadro superior derecho) para cubrir toda la pantalla.
          </span>
        </div>
      )}

      {/* MODAL FINANZAS Y COBRANZA */}
      {showFinanceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600"/> Finanzas y Cobranza
              </h3>
              <button onClick={() => setShowFinanceModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-4">Registra el pago de esta consulta para {patient.nombre || 'el paciente actual'}.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Monto (MXN)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    value={extras.finance?.monto || ''} 
                    onChange={(e) => handleExtrasChange('finance', { ...extras.finance, monto: e.target.value })}
                    className="w-full pl-7 p-2 border border-gray-300 rounded-lg focus:ring-green-500 text-sm shadow-inner" 
                    placeholder="Ej. 600" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Método</label>
                  <select 
                    value={extras.finance?.metodo || 'Efectivo'} 
                    onChange={(e) => handleExtrasChange('finance', { ...extras.finance, metodo: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 text-xs shadow-inner"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estado</label>
                  <select 
                    value={extras.finance?.estado || 'Pagado'} 
                    onChange={(e) => handleExtrasChange('finance', { ...extras.finance, estado: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 text-xs shadow-inner"
                  >
                    <option value="Pagado">✅ Pagado</option>
                    <option value="Pendiente">⏳ Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notas / Concepto</label>
                <textarea 
                  value={extras.finance?.notas || ''} 
                  onChange={(e) => handleExtrasChange('finance', { ...extras.finance, notas: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 text-xs shadow-inner resize-none h-16" 
                  placeholder="Ej. Pago correspondiente al mes de marzo..." 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
              <button onClick={() => setShowFinanceModal(false)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold flex justify-center items-center shadow-sm transition-colors">
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BASE DE DATOS DE PLANTILLAS */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b pb-2 shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center"><Database className="w-5 h-5 mr-2 text-indigo-600"/> Base de Datos de Plantillas</h3>
              <button onClick={() => setShowTemplatesModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100 shrink-0">
              <label className="block text-xs font-bold text-indigo-800 mb-1">Guardar cuadro y distribución actual</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newTemplateName} 
                  onChange={e => setNewTemplateName(e.target.value)} 
                  placeholder="Ej. Dieta 1500 kcal Baja en Carbos" 
                  className="flex-1 p-2 border border-indigo-200 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                />
                <button 
                  onClick={handleSaveTemplate} 
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Tus Plantillas Guardadas</h4>
              {savedTemplates.length === 0 ? (
                <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-lg">No tienes plantillas guardadas en este dispositivo.</div>
              ) : (
                <div className="space-y-2">
                  {savedTemplates.map(tpl => (
                    <div key={tpl.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-bold text-gray-800 truncate">{tpl.name}</p>
                        <p className="text-[10px] text-gray-500">{tpl.macros.protPercent}% Prot | {tpl.macros.lipPercent}% Lip | {tpl.macros.hcPercent}% HC</p>
                      </div>
                      <div className="flex space-x-1 shrink-0">
                        <button onClick={() => handleLoadTemplate(tpl)} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold hover:bg-indigo-200 transition-colors shadow-sm">Cargar</button>
                        <button onClick={() => handleDeleteTemplate(tpl.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100 transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t flex justify-end shrink-0">
              <button onClick={() => setShowTemplatesModal(false)} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURACIÓN */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center"><Settings className="w-5 h-5 mr-2 text-emerald-600"/> Configuración del Sistema</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-gray-600 mb-4">Configura aquí los enlaces a tu base de datos y personaliza tu entorno. Estos datos se guardarán localmente en tu dispositivo.</p>
            
            <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto pr-2">
              
              {/* INTERRUPTOR GLOBAL DE GUÍAS (MODO EXPERTO) */}
<div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center mb-2">
  <div>
    <h4 className="text-sm font-bold text-emerald-800">Modo Asistido (Botones de Guía)</h4>
    <p className="text-[10px] text-gray-600 mt-0.5">Activa para ver asistentes de IA y plantillas. Desactiva para una vista limpia.</p>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      className="sr-only peer"
      checked={showGuides}
      onChange={() => {
        const newValue = !showGuides;
        setShowGuides(newValue);
        localStorage.setItem('nutri_show_guides', newValue);
      }}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
  </label>
</div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Profesional (Para el PDF)</label>
                <input type="text" value={tempProfessionalName} onChange={(e) => setTempProfessionalName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 text-sm shadow-inner uppercase" placeholder="Ej.  EDUARDO LOHER" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
                  Ubicación (Contexto IA para ingredientes y moneda)
                </label>
                <input 
                  type="text" 
                  list="locations-list"
                  value={tempLocation} 
                  onChange={(e) => setTempLocation(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 text-sm shadow-inner" 
                  placeholder="Ej. Zapopan, Jalisco, México" 
                />
                <datalist id="locations-list">
                  <option value="Guadalajara, Jalisco, México" />
                  <option value="Ciudad de México, CDMX, México" />
                  <option value="Monterrey, Nuevo León, México" />
                  <option value="Tijuana, Baja California, México" />
                  <option value="Querétaro, Querétaro, México" />
                  <option value="Mérida, Yucatán, México" />
                  <option value="Bogotá, Colombia" />
                  <option value="Buenos Aires, Argentina" />
                  <option value="Santiago, Chile" />
                  <option value="Lima, Perú" />
                  <option value="Madrid, España" />
                </datalist>
                <p className="text-[10px] text-gray-500 mt-1">Puedes escribir la ciudad, estado o país libremente, o seleccionar de la lista.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL de Google Apps Script (Web App)</label>
                <input type="text" value={tempScriptUrl} onChange={(e) => setTempScriptUrl(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 text-sm shadow-inner" placeholder="https://script.google.com/macros/s/.../exec" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL de Google Sheets (Tu Tabla)</label>
                <input type="text" value={tempSheetsUrl} onChange={(e) => setTempSheetsUrl(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 text-sm shadow-inner" placeholder="https://docs.google.com/spreadsheets/d/.../edit" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL Formulario Pre-Consulta (Ej. Google Forms)</label>
                <input type="text" value={tempOnboardingUrl} onChange={(e) => setTempOnboardingUrl(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 text-sm shadow-inner" placeholder="https://forms.gle/..." />
              </div>
            </div>

            <div className="flex space-x-2 justify-end pt-3 border-t">
              <button onClick={() => setShowSettingsModal(false)} className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Cancelar</button>
              <button onClick={saveSettings} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center"><Save className="w-4 h-4 mr-2"/> Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE HISTORIAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in px-2 sm:px-4">
          <div className="bg-white rounded-xl p-4 max-w-5xl w-full shadow-xl max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b pb-2 shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <UserSearch className="w-5 h-5 mr-2 text-blue-600"/> 
                Historial de Pacientes
                <button onClick={() => fetchHistory(false)} className="ml-3 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 flex items-center border border-blue-200">
                   {isLoadingHistory ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : "↻ Actualizar"}
                </button>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            {/* DASHBOARD INYECTADO (Fase 5) */}
            <BusinessDashboard historyData={historyData} />
            
            {/* Buscador y Pestañas unificados en una sola fila para ahorrar espacio vertical */}
            <div className="flex flex-col md:flex-row gap-2 mb-3 shrink-0">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, fecha o ID..." 
                  className="w-full pl-9 p-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 text-sm shadow-inner"
                />
              </div>

              <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto shrink-0">
                <button
                  onClick={() => setHistoryViewMode('pacientes')}
                  className={`flex-1 md:px-4 py-1 text-xs font-bold rounded-md transition-colors flex items-center justify-center ${historyViewMode === 'pacientes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <User className="w-3 h-3 mr-1.5"/> Únicos
                </button>
                <button
                  onClick={() => setHistoryViewMode('historial')}
                  className={`flex-1 md:px-4 py-1 text-xs font-bold rounded-md transition-colors flex items-center justify-center ${historyViewMode === 'historial' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <CalendarDays className="w-3 h-3 mr-1.5"/> Todo
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
               {isLoadingHistory ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                    <p className="text-sm font-medium">Descargando registros...</p>
                 </div>
               ) : historyData.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(historyViewMode === 'pacientes' 
                      ? Array.from(historyData.reduce((map, p) => {
                          const name = (p.Nombre || p.nombre || p.Name || "Sin Nombre").trim().toLowerCase();
                          if (!map.has(name)) map.set(name, p);
                          return map;
                        }, new Map()).values())
                      : historyData
                    ).filter(h => 
                      Object.values(h).some(val => 
                        String(val).toLowerCase().includes(historySearchTerm.toLowerCase())
                      )
                    ).map((paciente, idx) => {
                       const fotoKey = Object.keys(paciente).find(k => k.toLowerCase().trim().includes('foto') || k.toLowerCase().trim().includes('photo'));
                       const avatar = fotoKey && typeof paciente[fotoKey] === 'string' && paciente[fotoKey].startsWith('data:image') ? paciente[fotoKey] : null;

                       return (
                         <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-all relative group">
                            <div className="flex justify-between items-start mb-2 border-b border-gray-100 pb-2">
                               <div className="flex-1 pr-2 flex items-center gap-2">
                                  {avatar ? (
                                     <img src={avatar} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" alt="Avatar" />
                                  ) : (
                                     <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                       <User className="w-4 h-4 text-gray-400" />
                                     </div>
                                  )}
                                  <div>
                                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                                      {paciente.Nombre || paciente.nombre || paciente.Name || "Sin Nombre"}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 flex items-center mt-0.5">
                                      <Activity className="w-3 h-3 mr-1 text-gray-400"/> {paciente.Fecha || paciente.fecha || paciente.Date || "-"}
                                    </p>
                                  </div>
                               </div>
                               <div className="text-right flex flex-col items-end shrink-0 space-y-1">
                                  <span className="inline-block bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                                    {paciente.Peso || paciente.peso || "-"} kg
                                  </span>
                                  {(paciente.ID || paciente.id || paciente.registroId) && (
                                    <span className="text-[9px] text-gray-400 font-mono mt-0.5 font-bold flex items-center" title="Número de Expediente (ID)">
                                      <FileText className="w-2.5 h-2.5 mr-0.5 text-gray-400"/> {formatExpedienteId(paciente.ID || paciente.id || paciente.registroId)}
                                    </span>
                                  )}
                               </div>
                            </div>
                            <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 mb-6">
                              <span className="font-semibold text-gray-700">Motivo:</span> {paciente.Motivo || paciente.motivoConsulta || paciente['Motivo de Consulta'] || "No especificado"}
                            </p>
                            
                            <div className="absolute bottom-2 right-3 flex space-x-2 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setPatientToDelete(paciente); setShowDeleteConfirm(true); }}
                                className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-[10px] font-bold flex items-center shadow-sm"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => loadPatientForEditing(paciente)}
                                className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[10px] font-bold flex items-center shadow-sm"
                              >
                                <Edit className="w-3 h-3 mr-1" /> Editar
                              </button>
                            </div>
                         </div>
                       )
                    })}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <Database className="w-12 h-12 text-gray-300 mb-3" />
                    <h4 className="text-gray-700 font-bold mb-1 text-sm">Historial Vacío</h4>
                 </div>
               )}
            </div>

            <div className="flex justify-end pt-3 border-t mt-3 shrink-0 space-x-2">
              <button 
                onClick={() => window.open(sheetsUrl, '_blank')}
                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium flex items-center"
              >
                <ExternalLink className="w-3 h-3 mr-1.5 text-gray-500" /> Sheets
              </button>
              <button onClick={() => setShowHistoryModal(false)} className="px-4 py-1.5 bg-gray-800 text-white hover:bg-gray-700 rounded-lg text-xs font-medium">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO PACIENTE ACTUALIZADO (GUARDA/DESCARTA) */}
      {showNewConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">¿Crear nueva consulta?</h3>
            <p className="text-sm text-gray-600 mb-5">Elige si deseas guardar el progreso de este expediente en tu base de datos antes de limpiar la pantalla para una nueva consulta (Se te asignará un nuevo ID).</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={async () => {
                  setShowNewConfirm(false);
                  const saved = await handleSave();
                  if (saved) confirmNewPatient();
                }} 
                className="w-full px-3 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-bold flex items-center justify-center shadow-sm transition-colors"
              >
                <Save className="w-4 h-4 mr-2" /> Guardar actual y limpiar
              </button>
              <button 
                onClick={confirmNewPatient} 
                className="w-full px-3 py-2.5 border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-bold transition-colors"
              >
                Descartar actual y limpiar
              </button>
              <button onClick={() => setShowNewConfirm(false)} className="w-full px-3 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors mt-1">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" /> ¿Eliminar registro?
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Estás a punto de borrar la consulta de <strong>{patientToDelete?.Nombre || patientToDelete?.nombre}</strong> del {patientToDelete?.Fecha || patientToDelete?.fecha}.
              {(patientToDelete?.ID || patientToDelete?.id || patientToDelete?.registroId) && (
                <span className="block mt-3 text-xs font-mono bg-red-50 text-red-800 p-2 rounded border border-red-200 text-center font-bold tracking-widest">
                  {formatExpedienteId(patientToDelete.ID || patientToDelete.id || patientToDelete.registroId)}
                </span>
              )}
              <br/>Esta acción no se puede deshacer en la base de datos.
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setShowDeleteConfirm(false); setPatientToDelete(null); }} 
                className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete} 
                className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex justify-center items-center transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR PDF Y GUARDAR */}
      {showPdfConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">¿Guardar paciente?</h3>
            <p className="text-sm text-gray-600 mb-5">¿Deseas guardar la información en tu base de datos antes de generar el PDF?</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={async () => {
                  setShowPdfConfirm(false);
                  await handleSave();
                  executePDFDownload();
                }} 
                className="w-full px-3 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-bold flex justify-center items-center transition-colors shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" /> Guardar y Descargar PDF
              </button>
              <button 
                onClick={() => {
                  setShowPdfConfirm(false);
                  executePDFDownload();
                }} 
                className="w-full px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-bold flex justify-center items-center transition-colors"
              >
                <Download className="w-4 h-4 mr-2" /> Solo Descargar PDF
              </button>
              <button 
                onClick={() => setShowPdfConfirm(false)} 
                className="w-full px-3 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors mt-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR WHATSAPP */}
      {showWaConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-[#25D366] mb-2 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" /> Enviar por WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              ¿Deseas generar y descargar el PDF de este plan para enviarlo a tu paciente?
            </p>
            <p className="text-[10px] text-gray-500 mb-5 leading-tight">
              Nota: Por políticas de WhatsApp, los archivos no se adjuntan automáticamente a los mensajes. El sistema descargará el PDF en tu equipo para que tú lo adjuntes manualmente en el chat.
            </p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => proceedToWhatsApp(true)} 
                className="w-full px-3 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebd5a] text-sm font-bold flex justify-center items-center transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" /> Descargar PDF y Abrir Chat
              </button>
              <button 
                onClick={() => proceedToWhatsApp(false)} 
                className="w-full px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-bold flex justify-center items-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Solo Abrir Chat
              </button>
              <button 
                onClick={() => setShowWaConfirm(false)} 
                className="w-full px-3 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors mt-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ENTRENAMIENTO Y RUTINAS IA */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-6xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100">
            
            {/* Header Modal */}
            <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md"><Dumbbell size={20} /></div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950 flex items-center tracking-tight">
                    Entrenamiento y Rutinas
                  </h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase">Gestión de plantillas por carpetas</p>
                </div>
              </div>
              
              {/* 👇 AQUÍ INTEGRAMOS EL BOTÓN JUNTO AL DE CERRAR 👇 */}
              <div className="flex items-center gap-2">
                <button 
      onClick={() => syncRoutinesToSheets()} 
      disabled={isSyncingRoutines}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-all text-xs font-bold flex items-center shadow-sm disabled:opacity-50"
                  title="Sincroniza tus carpetas a Google Sheets para usarlas en otros dispositivos"
                >
                  {isSyncingRoutines ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Database size={16} className="mr-1.5" />}
                  {isSyncingRoutines ? "Guardando..." : "Guardar en la Nube"}
                </button>

                {/* Tu botón de cerrar original intacto */}
                <button onClick={() => setShowWorkoutModal(false)} className="p-2 ml-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>
              {/* 👆 FIN DE LA INTEGRACIÓN 👆 */}
              
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* PANEL IZQUIERDO: EXCLUSIVO PARA GENERADOR IA */}
              <aside className="w-72 bg-emerald-50/30 border-r border-emerald-100 flex flex-col overflow-y-auto shrink-0 p-6">
                 <div className="mb-6">
                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={16} /> Generador IA</h4>
                    
                    {/* Pestañas (Tabs) */}
                    <div className="flex bg-emerald-100/50 p-1 rounded-xl mb-4">
                       <button onClick={() => setAiMode('rapido')} className={`flex-1 text-[10px] font-black py-2 rounded-lg transition-all ${aiMode === 'rapido' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-500 hover:text-emerald-700'}`}>Objetivo Rápido</button>
                       <button onClick={() => setAiMode('avanzado')} className={`flex-1 text-[10px] font-black py-2 rounded-lg transition-all ${aiMode === 'avanzado' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-500 hover:text-emerald-700'}`}>Personalizado</button>
                    </div>

                    {/* Controles de la IA */}
                    {aiMode === 'rapido' ? (
                      <div className="space-y-4">
                        <select 
                          value={aiSelectedGoal} 
                          onChange={e => setAiSelectedGoal(e.target.value)}
                          className="w-full text-xs font-bold text-gray-700 bg-white border border-emerald-200 p-3 rounded-xl outline-none focus:border-emerald-500 shadow-sm"
                        >
                          <option value="(Usar motivo de consulta general)">(Usar motivo de consulta general)</option>
                          <option value="Perder grasa / Adelgazar">🔥 Perder grasa / Adelgazar</option>
                          <option value="Definición muscular">🔪 Definición muscular</option>
                          <option value="Hipertrofia / Ganar masa muscular">💪 Hipertrofia / Ganar masa</option>
                          <option value="Recomposición corporal">⚖️ Recomposición corporal</option>
                          <option value="Fuerza máxima">🏋️ Fuerza máxima</option>
                          <option value="Mantenimiento / Salud general">🛡️ Mantenimiento / Salud general</option>
                        </select>
                        <button 
                          onClick={() => handleGenerateWorkoutAI('rapido')}
                          disabled={isGeneratingWorkout}
                          className="w-full py-3 bg-emerald-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors disabled:opacity-70"
                        >
                          {isGeneratingWorkout ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Crear Plan con IA
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea 
                          value={aiCustomPrompt}
                          onChange={e => setAiCustomPrompt(e.target.value)}
                          placeholder="Ej: Entrena 4 días a la semana. Evitar sentadillas..."
                          className="w-full h-32 text-xs font-medium text-gray-700 bg-white border border-emerald-200 p-3 rounded-xl outline-none focus:border-emerald-500 resize-none shadow-sm leading-relaxed"
                        />
                        <button 
                          onClick={() => handleGenerateWorkoutAI('avanzado')}
                          disabled={isGeneratingWorkout}
                          className="w-full py-3 bg-emerald-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors disabled:opacity-70"
                        >
                          {isGeneratingWorkout ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generar Especial
                        </button>
                      </div>
                    )}
                 </div>
              </aside>

              {/* PANEL DERECHO: EDITOR, CARPETAS Y PLANTILLAS */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                 <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
                    
                    {/* CAMPO GRANDE PARA TEXTO LIBRE / IA */}
                    <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-sm relative focus-within:border-emerald-400 transition-colors flex flex-col min-h-[250px] shrink-0">
                       {isGeneratingWorkout && (
                         <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem] z-10">
                            <p className="text-sm font-black text-emerald-600 animate-pulse flex items-center gap-2"><Loader2 size={18} className="animate-spin"/> Redactando rutina con IA...</p>
                         </div>
                       )}
                       <div className="flex items-center gap-2 mb-3">
                          <Edit className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-sm font-black text-emerald-950">Editor de Rutina</h4>
                       </div>
                       <textarea 
                         value={extras.workoutRoutine}
                         onChange={e => setExtras({...extras, workoutRoutine: e.target.value})}
                         placeholder="Usa la IA del panel izquierdo o escribe la rutina aquí libremente..."
                         className="w-full flex-1 bg-transparent border-none outline-none resize-none text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap"
                       />
                    </div>

                    {/* GESTOR DE CARPETAS Y PLANTILLAS */}
                    <div className="bg-emerald-50/20 border border-emerald-50 p-5 rounded-[2rem] shrink-0">
                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                          <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2 flex items-center gap-2">
                             Carpetas ({Object.keys(workoutLibrary).length}/8)
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(workoutLibrary).length < 8 && (
                              <button onClick={handleAddFolder} className="text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-black">
                                NUEVA CARPETA
                              </button>
                            )}
                            <button onClick={() => setShowSaveForm(!showSaveForm)} className="text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-black">
                               NUEVA PLANTILLA
                            </button>
                          </div>
                       </div>
                       
                       {/* FORMULARIO DE GUARDAR PLANTILLA */}
                       {showSaveForm && (
                         <div className="mb-4 flex flex-col lg:flex-row gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-md">
                            <input 
                              type="text" 
                              placeholder="Nombre de la rutina..." 
                              value={newRoutineName}
                              onChange={(e) => setNewRoutineName(e.target.value)}
                              className="flex-1 border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:border-emerald-500"
                            />
                            <select 
                              value={selectedFolder}
                              onChange={(e) => setSelectedFolder(e.target.value)}
                              className="border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:border-emerald-500"
                            >
                              {Object.keys(workoutLibrary).map(folder => (
                                <option key={folder} value={folder}>{folder}</option>
                              ))}
                            </select>
                            <button onClick={saveRoutine} className="px-6 bg-emerald-600 text-white rounded-lg text-xs font-black py-2 hover:bg-emerald-500 transition-colors">Guardar Texto Actual</button>
                         </div>
                       )}

                       {/* GRID HORIZONTAL DE CARPETAS */}
                       <div className="flex overflow-x-auto gap-3 mb-5 pb-2">
                          {Object.keys(workoutLibrary).map(folder => (
                             <div key={folder} className="flex flex-col gap-1 min-w-[120px]">
                               {editingFolder === folder ? (
                                 <input 
                                   autoFocus
                                   value={editingFolderName}
                                   onChange={e => setEditingFolderName(e.target.value)}
                                   onBlur={() => handleSaveFolderName(folder)}
                                   onKeyDown={e => e.key === 'Enter' && handleSaveFolderName(folder)}
                                   className="text-xs font-black text-center p-2 border-2 border-emerald-500 rounded-xl outline-none"
                                 />
                               ) : (
                                 <button 
                                   onClick={() => setSelectedFolder(folder)}
                                   onDoubleClick={() => { setEditingFolder(folder); setEditingFolderName(folder); }}
                                   className={`p-3 rounded-xl border text-xs font-black transition-all whitespace-nowrap ${selectedFolder === folder ? 'bg-emerald-600 text-white shadow-md border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}
                                 >
                                   {folder}
                                 </button>
                               )}
                               {selectedFolder === folder && (
                                 <button onClick={() => handleDeleteFolder(folder)} className="text-[9px] font-bold text-red-400 hover:text-red-600 text-center">Eliminar</button>
                               )}
                             </div>
                          ))}
                       </div>

                       {/* PLANTILLAS DENTRO DE LA CARPETA SELECCIONADA */}
                       <div className="bg-white rounded-2xl border border-gray-100 p-5">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-3">
                             Contenido de: <span className="text-emerald-950">{selectedFolder}</span>
                          </h5>
                          {workoutLibrary[selectedFolder]?.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No hay plantillas guardadas en esta carpeta.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {workoutLibrary[selectedFolder]?.map(routine => (
                                 <div key={routine.id} className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                      <h6 className="text-sm font-black text-gray-700 truncate pr-2">{routine.name}</h6>
                                      <button onClick={() => deleteRoutine(selectedFolder, routine.id)} className="text-red-400 hover:text-red-600"><X size={16}/></button>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                      <button onClick={() => toggleExpandTemplate(routine.id)} className="flex-1 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                        {expandedTemplates[routine.id] ? 'Ocultar' : 'Ver Texto'}
                                      </button>
                                      <button onClick={() => setExtras({...extras, workoutRoutine: routine.content})} className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black hover:bg-emerald-100 transition-colors">
                                        Cargar al Editor
                                      </button>
                                    </div>
                                    {expandedTemplates[routine.id] && (
                                      <div className="mt-2 p-2 bg-white border border-gray-100 rounded-lg text-xs font-medium text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                                        {routine.content}
                                      </div>
                                    )}
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Footer Fijo Modal */}
            <div className="flex justify-end p-5 border-t border-gray-100 shrink-0 bg-white">
              <button 
                onClick={() => setShowWorkoutModal(false)} 
                className="px-6 py-2.5 bg-emerald-950 text-white rounded-lg hover:bg-emerald-900 text-sm font-bold shadow-sm transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Aceptar y Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL UNIFICADO DE LIBRERÍAS (MENÚS Y NOTAS) */}
      {showLibModal && (() => {
        const isMenu = libType === 'menus';
        const currentLibrary = isMenu ? menuLibrary : notesLibrary;
        const setLibrary = isMenu ? setMenuLibrary : setNotesLibrary;
        const storageKey = isMenu ? 'nutri_menu_library' : 'nutri_notes_library';
        const themeColor = isMenu ? 'emerald' : 'blue';
        const Icon = isMenu ? Utensils : FileText;
        const targetText = isMenu ? menuText : notesText;

        const handleSaveToLib = () => {
          if (!newLibItemName.trim()) return setAlertMessage("Dale un nombre a la plantilla.");
          if (!targetText.trim()) return setAlertMessage("El cuadro de texto está vacío. Escribe algo primero.");
          
          const newLib = { ...currentLibrary };
          if (!newLib[activeLibFolder]) newLib[activeLibFolder] = [];
          
          newLib[activeLibFolder].push({ id: Date.now(), name: newLibItemName, content: targetText });
          setLibrary(newLib);
          localStorage.setItem(storageKey, JSON.stringify(newLib));
          setNewLibItemName('');
          setShowLibSaveForm(false);
          setAlertMessage(`Guardado en la carpeta ${activeLibFolder}.`);
        };

        const handleDeleteFromLib = (folder, id) => {
          const newLib = { ...currentLibrary };
          newLib[folder] = newLib[folder].filter(item => item.id !== id);
          setLibrary(newLib);
          localStorage.setItem(storageKey, JSON.stringify(newLib));
        };

        const loadContent = (content) => {
          if (isMenu) {
            setMenuText(content);
          } else {
            setNotesText(prev => prev ? `${prev}\n\n${content}` : content);
          }
          setShowLibModal(false);
          setAlertMessage("Contenido cargado al editor.");
        };

        return (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col overflow-hidden">
              
              <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 bg-${themeColor}-50`}>
                <div className="flex items-center gap-3">
                  <div className={`bg-${themeColor}-600 p-2 rounded-xl text-white shadow-md`}><Icon size={20} /></div>
                  <div>
                    <h3 className={`text-xl font-black text-${themeColor}-950 tracking-tight`}>
                      Librería de {isMenu ? 'Menús' : 'Notas Clínicas'}
                    </h3>
                    <p className={`text-[10px] text-${themeColor}-600 font-bold uppercase`}>Carpetas de acceso rápido</p>
                  </div>
                </div>
                <button onClick={() => setShowLibModal(false)} className="p-2 hover:bg-white text-gray-400 hover:text-red-500 rounded-xl transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden bg-white p-6">
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {Object.keys(currentLibrary).map(folder => (
                      <button 
                        key={folder} onClick={() => setActiveLibFolder(folder)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeLibFolder === folder ? `bg-${themeColor}-600 text-white shadow-md` : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                      >
                        {folder}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowLibSaveForm(!showLibSaveForm)} className={`ml-4 shrink-0 text-${themeColor}-700 hover:bg-${themeColor}-50 px-3 py-2 rounded-lg transition-colors text-[10px] font-black border border-${themeColor}-200`}>
                    + GUARDAR TEXTO ACTUAL
                  </button>
                </div>

                {showLibSaveForm && (
                  <div className={`mb-6 flex gap-3 bg-${themeColor}-50 p-4 rounded-xl border border-${themeColor}-100 shadow-sm animate-in slide-in-from-top-2`}>
                    <input type="text" placeholder={`Nombre ${isMenu ? 'del menú' : 'de la nota'}...`} value={newLibItemName} onChange={(e) => setNewLibItemName(e.target.value)} className={`flex-1 border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:border-${themeColor}-500`} />
                    <button onClick={handleSaveToLib} className={`px-6 bg-${themeColor}-600 text-white rounded-lg text-xs font-black hover:bg-${themeColor}-500 transition-colors`}>Guardar</button>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  {currentLibrary[activeLibFolder]?.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-bold">Carpeta vacía</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentLibrary[activeLibFolder]?.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start">
                            <h6 className="text-sm font-black text-gray-800 truncate pr-2">{item.name}</h6>
                            <button onClick={() => handleDeleteFromLib(activeLibFolder, item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium whitespace-pre-wrap line-clamp-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            {item.content}
                          </div>
                          <button onClick={() => loadContent(item.content)} className={`w-full py-2 mt-auto bg-${themeColor}-50 text-${themeColor}-700 rounded-lg text-[10px] font-black hover:bg-${themeColor}-100 transition-colors border border-${themeColor}-100`}>
                            {isMenu ? 'Reemplazar en el Editor' : 'Añadir al Editor'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE CÁMARA */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center border border-gray-800">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto max-h-[70vh] object-contain bg-gray-900"
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="absolute top-4 right-4">
              <button onClick={stopCamera} className="bg-black/50 text-white p-2 rounded-full hover:bg-red-500 backdrop-blur-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 w-full flex justify-between items-center bg-gray-900 border-t border-gray-800">
              <div className="w-10 h-10"></div>
              
              <button 
                onClick={capturePhoto}
                className="w-14 h-14 bg-white rounded-full border-4 border-gray-900 outline outline-4 outline-white hover:scale-105 active:scale-95 transition-transform"
              >
              </button>

              <button 
                onClick={toggleCamera} 
                className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-gray-400 mt-4 text-xs font-medium flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Enfoca al paciente y presiona el botón blanco
          </p>
        </div>
      )}

      {/* MODAL VINCULAR / ABRIR CALENDARIO */}
      {/* 👇 PEGA EL MODAL DEL CALENDARIO AQUÍ 👇 */}
      {showMiniCalendar && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center animate-in fade-in px-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center border-b pb-3 mb-3 shrink-0">
              <h3 className="text-lg font-black text-gray-800 flex items-center tracking-tight">
                <CalendarDays className="w-5 h-5 mr-2 text-purple-600" />
                Citas Programadas
              </h3>
              <button onClick={() => setShowMiniCalendar(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LISTA DE CITAS EXTRAÍDA DEL HISTORIAL */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
              {(() => {
                const citas = [];
                historyData.forEach(p => {
                  try {
                    const jsonKey = Object.keys(p).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes('portionsjson'));
                    if (jsonKey && p[jsonKey]) {
                      const parsed = JSON.parse(p[jsonKey]);
                      if (parsed.extras && parsed.extras.agendaDate) {
                        citas.push({
                          nombre: p.Nombre || p.nombre || p.Name || 'Paciente',
                          fecha: parsed.extras.agendaDate,
                          hora: parsed.extras.agendaTime || 'Por definir',
                          id: p.ID || p.id || p.registroId
                        });
                      }
                    }
                  } catch(e) {}
                });
                
                citas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

                if (citas.length === 0) {
                  return (
                    <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <CalendarDays className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-bold text-gray-600">No hay citas registradas</p>
                      <p className="text-xs mt-1 px-4">Cuando uses la "Agenda Rápida" al guardar un paciente, aparecerá aquí automáticamente.</p>
                    </div>
                  );
                }

                return citas.map((cita, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center hover:border-purple-300 transition-colors shadow-sm">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{cita.nombre}</p>
                      <p className="text-xs text-purple-600 font-bold flex items-center mt-0.5">
                        <Clock className="w-3 h-3 mr-1" /> {cita.fecha} • {cita.hora}
                      </p>
                    </div>
                    <span className="text-[10px] bg-purple-50 px-2 py-1 rounded-md border border-purple-100 text-purple-800 font-black shadow-inner">
                      {formatExpedienteId(cita.id)}
                    </span>
                  </div>
                ));
              })()}
            </div>

            {/* SECCIÓN GOOGLE CALENDAR */}
            <div className="border-t border-gray-100 pt-4 shrink-0 bg-white">
              <p className="text-[11px] text-gray-500 mb-3 text-center leading-tight font-medium">
                ¿Necesitas agregar eventos personales, vacaciones o ver la vista mensual completa?
              </p>
              <button 
                onClick={() => window.open('https://calendar.google.com/calendar/', '_blank')} 
                className="w-full py-2.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl text-sm font-black hover:bg-purple-100 transition-colors flex items-center justify-center shadow-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Abrir Google Calendar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 👆 FIN DEL MODAL 👆 */}

      {/* MODAL DE AYUDA V2.8 PRO - MANUAL MAESTRO INTEGRAL */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center animate-in fade-in px-4 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-0 max-w-6xl w-full shadow-2xl max-h-[94vh] flex flex-col overflow-hidden border border-emerald-100">
            
            {/* Header Pro */}
            <div className="flex justify-between items-center border-b border-emerald-100 p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
              <div className="flex items-center">
                <div className="bg-emerald-500/20 p-2 rounded-xl mr-4">
                  <ShieldQuestion className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase text-white">Manual Maestro Nutri Health V2.8</h3>
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.3em]">Software de Gestión Nutricional de Alto Rendimiento</p>
                </div>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo del Manual */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              
              {helpView !== 'selection' && (
                <button onClick={() => setHelpView('selection')} className="mb-6 text-emerald-700 text-xs font-black hover:bg-emerald-50 px-4 py-2 rounded-xl flex items-center transition-all border border-emerald-100 shadow-sm bg-white active:scale-95">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> VOLVER AL ÍNDICE DEL MANUAL
                </button>
              )}

              {/* --- ÍNDICE PRINCIPAL --- */}
              {helpView === 'selection' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
                  <button onClick={() => setHelpView('quick')} className="group p-8 border-2 border-emerald-50 bg-emerald-50/20 rounded-[2rem] hover:border-emerald-500 hover:bg-white transition-all shadow-sm text-left">
                    <Zap className="w-12 h-12 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">1. Fundamentos y Vocación</h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Guía esencial para el inicio de la consulta y la empatía con el paciente.</p>
                  </button>

                  <button onClick={() => setHelpView('detailed')} className="group p-8 border-2 border-blue-50 bg-blue-50/20 rounded-[2rem] hover:border-blue-500 hover:bg-white transition-all shadow-sm text-left">
                    <BookOpen className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">2. Guía Clínica Detallada</h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Estructura técnica, algoritmos de cálculo y lógica profunda de toda la App.</p>
                  </button>

                  <button onClick={() => setHelpView('plus')} className="group p-8 border-2 border-amber-50 bg-amber-50/20 rounded-[2rem] hover:border-amber-500 hover:bg-white transition-all shadow-sm text-left">
                    <Sparkles className="w-12 h-12 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">3. Herramientas Plus (PRO)</h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Manual completo: OCR, WhatsApp, Rutinas en la Nube y Súper Inteligente.</p>
                  </button>

                  <button onClick={() => setHelpView('sheets')} className="group p-8 border-2 border-purple-50 bg-purple-50/20 rounded-[2rem] hover:border-purple-500 hover:bg-white transition-all shadow-sm text-left">
                    <Database className="w-12 h-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">4. Motor Técnico (Server)</h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Instrucciones de despliegue, Sheets y código Apps Script para el backend.</p>
                  </button>
                </div>
              )}

              {/* --- 1. FUNDAMENTOS CLÍNICOS PARA EL PRINCIPIANTE --- */}
              {helpView === 'quick' && (
                <div className="space-y-8 animate-in slide-in-from-right-8">
                  <header>
                    <h4 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter">Bases del Sistema para la Nueva Vocación</h4>
                    <p className="text-sm text-gray-500 font-medium italic">"El software no reemplaza al nutriólogo, lo potencia".</p>
                  </header>

                  <div className="space-y-6">
                    <div className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">01</div>
                      <div>
                        <h5 className="font-black text-gray-800 uppercase text-sm mb-2">Paso 1: Entrevista y Empatía (Historia Clínica)</h5>
                        <p className="text-xs text-gray-600 leading-relaxed">Ingresa el nombre del paciente. El campo <strong>Motivo de Consulta</strong> es la clave de todo el plan; aquí debes anotar si el paciente quiere ganar músculo, si tiene colitis, o si simplemente quiere mejorar su salud. <strong>Tip de Éxito:</strong> Toma la fotografía de control. Ver el cambio físico en la siguiente consulta es la mayor motivación para el paciente.</p>
                      </div>
                    </div>

                    <div className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">02</div>
                      <div>
                        <h5 className="font-black text-gray-800 uppercase text-sm mb-2">Paso 2: Evaluación del Cuerpo (Antropometría)</h5>
                        <p className="text-xs text-gray-600 leading-relaxed">Ingresa Peso y Talla. Luego usa los pliegues (Tricipital, Subescapular, etc.). El sistema usará la <strong>Fórmula Siri</strong> para darte el % de grasa real. Esto es mucho más profesional que solo usar el IMC, ya que separa el peso del músculo de la grasa.</p>
                      </div>
                    </div>

                    <div className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">03</div>
                      <div>
                        <h5 className="font-black text-gray-800 uppercase text-sm mb-2">Paso 3: Estrategia Calórica (Gasto de Energía)</h5>
                        <p className="text-xs text-gray-600 leading-relaxed">Si tu paciente tiene mucho sobrepeso, usa la fórmula <strong>Mifflin</strong>. Si es una persona activa o atleta, usa <strong>Harris-Benedict</strong>. Ajusta el % de actividad física (AF) con el control deslizante; sé conservador si el paciente es sedentario para asegurar resultados.</p>
                      </div>
                    </div>

                    <div className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">04</div>
                      <div>
                        <h5 className="font-black text-gray-800 uppercase text-sm mb-2">Paso 4: El Cuadro Dietosintético</h5>
                        <p className="text-xs text-gray-600 leading-relaxed">Asigna el % de Macros (Ej: 20% Prot, 25% Lip, 55% HC). Al terminar, presiona <strong>Cuadrar</strong>. El software calculará por ti cuántas porciones de fruta, carne o cereales debe comer al día para cumplir esa meta exacta. ¡Te ahorra 20 minutos de cálculos manuales!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. GUÍA CLÍNICA DETALLADA (3X MÁS EXTENSA) --- */}
              {helpView === 'detailed' && (
                <div className="space-y-8 animate-in slide-in-from-right-8">
                  <header>
                    <h4 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Guía Clínica: Lógica, Estructura y Función</h4>
                    <p className="text-sm text-gray-500">Análisis profundo de la arquitectura nutricional del software.</p>
                  </header>

                  <div className="grid grid-cols-1 gap-6">
                    {/* TABS 1 Y 2 */}
                    <div className="p-6 bg-white border-l-4 border-blue-500 rounded-2xl shadow-sm">
                      <h5 className="font-black text-blue-800 uppercase text-sm mb-3">Pestaña 1 y 2: Identificación y Composición</h5>
                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        El sistema utiliza la **Densidad Corporal** basada en la suma de pliegues cutáneos. Para la población general, aplicamos el algoritmo de **Durnin-Womersley** (Logaritmo de 4 pliegues) para obtener la densidad y posteriormente la **Ecuación de Siri** para el % de grasa. 
                      </p>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-blue-700 uppercase mb-2">Módulo ISAK y Somatotipo:</p>
                        <p className="text-[10px] text-gray-500">Al activar ISAK, el software ejecuta la fórmula de **Heath-Carter**. Calcula la Endomorfia (adiposidad), Mesomorfia (robustez músculo-esquelética) y Ectomorfia (linealidad), proyectando el punto exacto en la somatocarta para nutrición deportiva avanzada.</p>
                      </div>
                    </div>

                    {/* TAB 3 */}
                    <div className="p-6 bg-white border-l-4 border-emerald-500 rounded-2xl shadow-sm">
                      <h5 className="font-black text-emerald-800 uppercase text-sm mb-3">Pestaña 3: Algoritmos de Gasto Energético (GET)</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        El **GEB (Gasto Energético Basal)** es el 60-70% de la energía total. 
                      </p>
                      <ul className="text-[10px] text-gray-500 mt-2 space-y-2 list-disc ml-4">
                        <li><strong>Mifflin-St Jeor:</strong> Es el estándar de oro actual para pacientes con sobrepeso u obesidad clínica.</li>
                        <li><strong>Harris-Benedict:</strong> Recomendado para atletas por su tendencia a la sobreestimación calórica, lo que previene el catabolismo.</li>
                        <li><strong>AF y ETA:</strong> El factor de actividad se suma porcentualmente. El ETA (Efecto Termogénico) se ajusta según la carga proteica de la dieta.</li>
                      </ul>
                    </div>

                    {/* TABS 4 Y 5 */}
                    <div className="p-6 bg-white border-l-4 border-purple-500 rounded-2xl shadow-sm">
                      <h5 className="font-black text-purple-800 uppercase text-sm mb-3">Pestaña 4 y 5: Cuadro Dietosintético y SMAE</h5>
                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        La lógica se basa en el **Sistema Mexicano de Alimentos Equivalentes (SMAE)**. Cada grupo tiene un aporte fijo de macros ($4, 9, 4$ kcal por gramo de P, L, HC). 
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-purple-700 uppercase">Ajuste de Porciones:</p>
                          <p className="text-[10px] text-gray-500 italic">El botón "Cuadrar" utiliza un motor lógico que busca minimizar el error entre los macros objetivo y los reales, manteniendo el porcentaje de adecuación entre el 95% y 105%.</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-purple-700 uppercase">Distribución de Tiempos:</p>
                          <p className="text-[10px] text-gray-500 italic">La App permite repartir los equivalentes en hasta 5 tiempos. La lógica recomienda cargar el 30% en comida, 25% en desayuno/cena y 10% en colaciones.</p>
                        </div>
                      </div>
                    </div>

                    {/* SUBTEMA: CEREBRO IA */}
                    <div className="p-8 bg-blue-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden">
                      <Sparkles className="absolute right-6 top-6 w-12 h-12 opacity-20 rotate-12" />
                      <h5 className="font-black uppercase text-lg mb-4 text-blue-300">Subtema: El Cerebro IA (Contexto Clínico)</h5>
                      <p className="text-xs opacity-90 leading-relaxed mb-6">
                        El corazón de la V2.8 es la inyección de contexto. Al generar el menú, el software no solo envía "calorías", envía un **Perfil Clínico Integrado**:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          {t: "Patologías", d: "Diabetes, HTA, Alergias."},
                          {t: "Subjetivo", d: "Motivo y metas."},
                          {t: "Suplementos", d: "Dosis y porciones."},
                          {t: "Recall 24h", d: "Hábitos y gustos."}
                        ].map((box, i) => (
                          <div key={i} className="bg-white/10 p-3 rounded-2xl border border-white/10">
                            <p className="font-black text-[10px] text-blue-200 uppercase mb-1">{box.t}</p>
                            <p className="text-[9px] opacity-70 leading-tight">{box.d}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-[11px] font-bold text-blue-200 border-t border-white/10 pt-4">
                        Lógica de Menú: La IA traduce los equivalentes del SMAE en platillos reales basándose en tu ubicación. Si el cuadro pide 2 eq de cereal y 1 de AOA, la IA sugerirá "2 tortillas con 40g de pollo".
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 3. TODAS LAS HERRAMIENTAS PLUS (DETALLADO 100%) --- */}
              {helpView === 'plus' && (
                <div className="space-y-8 animate-in slide-in-from-right-8">
                  <header>
                    <h4 className="text-2xl font-black text-amber-900 uppercase tracking-tighter text-amber-600">Enciclopedia de Herramientas Plus</h4>
                    <p className="text-sm text-gray-500">Dominio total del panel lateral de automatización.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white border-2 border-red-100 rounded-3xl">
                      <h6 className="font-black text-red-700 uppercase text-xs mb-2 flex items-center"><Scan size={18} className="mr-2"/> OCR Vision IA (Labs)</h6>
                      <p className="text-[10px] text-gray-600">Sube fotos de estudios de sangre. La IA extrae Glucosa, Colesterol y Triglicéridos. Presiona <strong>"Diagnóstico IA"</strong> para generar un análisis de riesgo interpretado para el paciente.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-emerald-100 rounded-3xl">
                      <h6 className="font-black text-emerald-700 uppercase text-xs mb-2 flex items-center"><Dumbbell size={18} className="mr-2"/> Rutinas Cloud Sync</h6>
                      <p className="text-[10px] text-gray-600">Crea carpetas (Ej: Tren Superior). El botón <strong>"Guardar en la Nube"</strong> sincroniza tus plantillas con tu Sheets para que aparezcan en todos tus dispositivos.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-green-100 rounded-3xl">
                      <h6 className="font-black text-green-700 uppercase text-xs mb-2 flex items-center"><MessageCircle size={18} className="mr-2"/> WhatsApp Integrado</h6>
                      <p className="text-[10px] text-gray-600">Envía recordatorios de citas o el plan completo. El sistema descarga el PDF y abre el chat del paciente automáticamente para que solo tengas que adjuntar.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-orange-100 rounded-3xl">
                      <h6 className="font-black text-orange-700 uppercase text-xs mb-2 flex items-center"><ShoppingCart size={18} className="mr-2"/> Súper Inteligente</h6>
                      <p className="text-[10px] text-gray-600">Extrae ingredientes de los Menús A y B. Organiza por pasillos del súper y estima el <strong>Costo Total</strong> de la despensa semanal según tu ciudad.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-pink-100 rounded-3xl">
                      <h6 className="font-black text-pink-700 uppercase text-xs mb-2 flex items-center"><Tag size={18} className="mr-2"/> Inyector de Marcas</h6>
                      <p className="text-[10px] text-gray-600">Selecciona marcas específicas (Ej: Salmas, Susalia). La IA recibirá estas marcas como **restricción obligatoria** al redactar los ingredientes del menú.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-rose-100 rounded-3xl">
                      <h6 className="font-black text-rose-700 uppercase text-xs mb-2 flex items-center"><Bookmark size={18} className="mr-2"/> Recetario Privado</h6>
                      <p className="text-[10px] text-gray-600">Guarda tus recetas estrella. Actívalas antes de generar la dieta para que la IA las incluya como la base del plan de ese día.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-slate-100 rounded-3xl">
                      <h6 className="font-black text-slate-700 uppercase text-xs mb-2 flex items-center"><Clock size={18} className="mr-2"/> R24H (Recall 24h)</h6>
                      <p className="text-[10px] text-gray-600">Ingresa los hábitos reales del paciente. Al presionar <strong>"Forzar Menú"</strong>, la IA ajusta los equivalentes SMAE a los horarios y gustos registrados.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-emerald-50 rounded-3xl shadow-inner">
                      <h6 className="font-black text-emerald-800 uppercase text-xs mb-2 flex items-center"><DollarSign size={18} className="mr-2"/> Cobranza y Finanzas</h6>
                      <p className="text-[10px] text-gray-600">Registra montos, métodos y estados de pago. Se conecta con el dashboard del historial para ver tus ingresos totales del mes.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-purple-100 rounded-3xl">
                      <h6 className="font-black text-purple-700 uppercase text-xs mb-2 flex items-center"><CalendarDays size={18} className="mr-2"/> Agenda y Calendario</h6>
                      <p className="text-[10px] text-gray-600">Gestiona citas próximas. El sistema lee el historial y te muestra una lista cronológica de tus pacientes agendados.</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-blue-50 rounded-3xl">
                      <h6 className="font-black text-blue-700 uppercase text-xs mb-2 flex items-center"><UserSearch size={18} className="mr-2"/> Buscador Predictivo</h6>
                      <p className="text-[10px] text-gray-600">Al escribir en 'Nombre', el sistema sugiere pacientes previos. Al seleccionar uno, carga toda su historia clínica e ISAK al instante.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 4. CONFIGURACIÓN DEL SERVIDOR (AL FINAL) --- */}
              {helpView === 'sheets' && (
                <div className="space-y-8 animate-in slide-in-from-right-8">
                  <header>
                    <h4 className="text-2xl font-black text-purple-900 uppercase tracking-tighter text-purple-600">Base de Datos y Motor del Servidor</h4>
                    <p className="text-sm text-gray-500">Configuración técnica de Google Sheets y despliegue del código backend.</p>
                  </header>

                  <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
                    <h5 className="font-black text-purple-800 text-xs uppercase mb-3 tracking-widest">Estructura de la Hoja de Google</h5>
                    <p className="text-[11px] mb-4 text-gray-600">Crea una pestaña llamada <strong>Pacientes</strong> con estos encabezados en la <strong>Fila 1</strong>:</p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-[9px] font-mono">
                      {["ID","Fecha","Nombre","Edad","Genero","Peso","Talla","Motivo","Suplementos","Foto","portionsJSON"].map(h => (
                        <div key={h} className="p-2 bg-slate-50 border rounded text-center font-bold text-gray-500 shadow-inner">{h}</div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl relative border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-black text-emerald-400 text-xs uppercase tracking-widest">Código Servidor (Apps Script)</h5>
                      <span className="text-[8px] text-slate-500 font-bold uppercase italic">Copia y pega en: Extensiones &gt; Apps Script</span>
                    </div>
                    <pre className="text-[10px] font-mono text-emerald-100/70 leading-relaxed overflow-x-auto h-80 p-6 rounded-2xl bg-black/40 border border-white/5 thin-scrollbar">
{`/**
 * NUTRI HEALTH V2.8 PRO - SERVER ENGINE
 */
const SPREADSHEET_ID = 'TU_ID_DE_SHEETS_AQUÍ';

function doPost(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Pacientes");
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'delete') {
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data.ID) { sheet.deleteRow(i + 1); return ContentService.createTextOutput("Eliminado"); }
    }
  }

  if (data.action === 'saveRoutines') {
    const configSheet = ss.getSheetByName("Config") || ss.insertSheet("Config");
    configSheet.getRange("A1:B1").setValues([["Clave", "Valor"]]);
    configSheet.getRange("A2:B2").setValues([["workout_library", data.routinesJSON]]);
    return ContentService.createTextOutput("Sincronizado");
  }

  const values = sheet.getDataRange().getValues();
  const idToFind = data.ID;
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) { if (values[i][0] == idToFind) { rowIndex = i + 1; break; } }

  const rowData = [data.ID, data.fecha, data.nombre, data.edad, data.genero, data.peso, data.talla, data.motivoConsulta, data.suplementos, data.foto, data.portionsJSON];
  if (rowIndex !== -1) { sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]); } 
  else { sheet.appendRow(rowData); }
  return ContentService.createTextOutput("Exito");
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const action = e.parameter.action;
  if (action === 'getHistory') {
    const sheet = ss.getSheetByName("Pacientes");
    const rows = sheet.getDataRange().getValues();
    const headers = rows.shift();
    const json = rows.map(row => {
      let obj = {}; headers.forEach((h, i) => obj[h] = row[i]); return obj;
    });
    return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getRoutines') {
    const configSheet = ss.getSheetByName("Config");
    if (!configSheet) return ContentService.createTextOutput("");
    const values = configSheet.getDataRange().getValues();
    const row = values.find(r => r[0] === "workout_library");
    return ContentService.createTextOutput(row ? row[1] : "");
  }
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal Unificado */}
            <div className="bg-emerald-50 p-5 border-t border-emerald-100 flex justify-between items-center shrink-0">
              <div className="flex items-center text-emerald-800 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={14} className="mr-2" /> COCONUT AGENCY &copy; 2026 Nutri Health V2.8 PRO
              </div>
              <button onClick={() => setShowHelpModal(false)} className="px-8 py-2.5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95">
                Cerrar Manual de Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-gray-50/50">
        
        {/* HEADER MOBILE */}
        <header className="bg-white shadow-sm px-4 py-2.5 flex items-center justify-between lg:hidden shrink-0 z-10 relative border-b border-gray-100">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-500 hover:text-emerald-600 p-1">
              <Menu className="w-5 h-5" />
            </button>
            <span className="ml-2 font-bold text-gray-800 text-base flex items-center">
              Nutri Health 
              <span className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono">{displayId}</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setIsRightDrawerOpen(!isRightDrawerOpen)} className={`p-1.5 rounded-md border border-gray-100 transition-colors ${isRightDrawerOpen ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:text-emerald-600 bg-gray-50'}`} title="Plus de Consulta">
              {isRightDrawerOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
            
            {/* BOTÓN MINI CALENDARIO (MÓVIL) */}
            <button 
              onClick={() => {
                if (!hasPlusPlan) {
                  setAlertMessage("El Mini Calendario es una función exclusiva del Plan Plus. ¡Actualiza tu cuenta para visualizar y gestionar todas tus citas programadas!");
                  return;
                }
                setShowMiniCalendar(true);
              }} 
              className={`p-1.5 rounded-md border transition-colors relative ${hasPlusPlan ? 'bg-gray-50 text-gray-500 hover:text-purple-600 border-gray-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
              title={hasPlusPlan ? "Citas y Calendario" : "Función bloqueada (Plan Plus)"}
            >
              {hasPlusPlan ? <CalendarDays className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white"></span>
              </span>
            </button>

            <button onClick={() => setShowFinanceModal(true)} className="text-gray-500 hover:text-green-600 p-1.5 bg-gray-50 rounded-md border border-gray-100" title="Finanzas">
              <DollarSign className="w-4 h-4" />
            </button>
            <button onClick={openSettings} className="text-gray-500 hover:text-emerald-600 p-1.5 bg-gray-50 rounded-md border border-gray-100">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => setShowHistoryModal(true)} className="text-gray-500 hover:text-blue-600 p-1.5 bg-gray-50 rounded-md border border-gray-100">
              <UserSearch className="w-4 h-4" />
            </button>
            <button onClick={toggleFullScreen} className="text-gray-500 hover:text-emerald-600 p-1.5 bg-gray-50 rounded-md border border-gray-100">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* TOP BAR / PATIENT SUMMARY (ESCRITORIO) */}
        <div className="bg-white shadow-sm border-b px-6 py-2.5 hidden lg:flex items-center justify-between shrink-0 z-10 relative">
          <div className="flex items-center space-x-5 text-xs">
            <span className="font-semibold text-gray-800 flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5 text-emerald-600"/> 
              {patient.nombre || 'Paciente Nuevo'}
            </span>
            <span className="bg-emerald-50 text-emerald-700 font-mono px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold flex items-center tracking-widest">
              <FileText className="w-3 h-3 mr-1" /> {displayId}
            </span>
            <span className="text-gray-500">Edad: {patient.edad}</span>
            <span className="text-gray-500">Peso: {patient.peso} kg</span>
            <span className="text-gray-500">GET: <strong className="text-emerald-600">{energy.get.toFixed(0)} kcal</strong></span>
          </div>
          <div className="flex items-center space-x-3">
            
            <button onClick={() => setIsRightDrawerOpen(!isRightDrawerOpen)} className={`flex items-center justify-center p-1.5 rounded-md border border-gray-200 transition-colors ${isRightDrawerOpen ? 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-inner' : 'text-gray-500 hover:text-emerald-600 bg-gray-50'}`} title="Plus de Consulta">
              {isRightDrawerOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>

            {/* BOTÓN MINI CALENDARIO (ESCRITORIO) */}
            <button 
              onClick={() => {
                if (!hasPlusPlan) {
                  setAlertMessage("El Mini Calendario es una función exclusiva del Plan Plus. ¡Actualiza tu cuenta para visualizar y gestionar todas tus citas programadas!");
                  return;
                }
                setShowMiniCalendar(true);
              }} 
              className={`flex items-center justify-center p-1.5 rounded-md border transition-colors relative ${hasPlusPlan ? 'bg-gray-50 text-gray-500 hover:text-purple-600 border-gray-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
              title={hasPlusPlan ? "Citas y Calendario" : "Función bloqueada (Plan Plus)"}
            >
              {hasPlusPlan ? <CalendarDays className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white"></span>
              </span>
            </button>

            <button onClick={() => setShowFinanceModal(true)} className="flex items-center justify-center p-1.5 text-gray-500 hover:text-green-600 bg-gray-50 rounded-md border border-gray-200" title="Finanzas">
              <DollarSign className="w-4 h-4" />
            </button>
            <button onClick={openSettings} className="flex items-center justify-center p-1.5 text-gray-500 hover:text-emerald-600 bg-gray-50 rounded-md border border-gray-200" title="Ajustes">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => setShowHistoryModal(true)} className="flex items-center justify-center p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 rounded-md border border-gray-200" title="Historial">
              <UserSearch className="w-4 h-4" />
            </button>
            <button onClick={toggleFullScreen} className="flex items-center justify-center p-1.5 text-gray-500 hover:text-emerald-600 bg-gray-50 rounded-md border border-gray-200">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div id="main-scroll-area" className="flex-1 overflow-auto p-2 sm:p-4 lg:p-4 scroll-smooth w-full">
          <div className="max-w-6xl mx-auto w-full transition-all duration-300">
            {activeTab === 'historia' && renderHistoria()}
            {activeTab === 'antropo' && renderAntropometria()}
            {activeTab === 'get' && renderGET()}
            {activeTab === 'cuadro' && renderCuadroDietosintetico()}
            {activeTab === 'distribucion' && renderDistribucion()}
            {activeTab === 'menu' && renderMenuYNotas()}
          </div>
        </div>
      </main>

      {/* OVERLAY SIDEBAR DERECHO (MOBILE) */}
      {isRightDrawerOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsRightDrawerOpen(false)}></div>
      )}

      {/* SIDEBAR DERECHO (HERRAMIENTAS EXTRA INYECTADAS) */}
      <aside className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${isRightDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
          <div className="flex items-center text-gray-800 font-black tracking-wide text-sm">
            <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
            PLUS DE CONSULTA
          </div>
          <button onClick={() => setIsRightDrawerOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded shadow-sm border border-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50/50">
          
          {/* TOOL 1: GRÁFICAS */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('graficas')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <LineChart className="w-4 h-4 mr-2 text-blue-500"/> Evolución
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'graficas' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'graficas' && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-xs">
                {historyData.filter(h => (h.Nombre || h.nombre || h.Name)?.toLowerCase() === patient.nombre?.toLowerCase() && patient.nombre).length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-gray-500 mb-2">Pesos históricos registrados:</p>
                    {historyData.filter(h => (h.Nombre || h.nombre || h.Name)?.toLowerCase() === patient.nombre?.toLowerCase()).map((h, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-2 border border-gray-200 rounded-lg shadow-sm hover:border-blue-300">
                        <span className="font-medium text-gray-600 flex items-center"><CalendarDays className="w-3 h-3 mr-1.5 text-gray-400"/> {h.Fecha || h.fecha}</span>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{h.Peso || h.peso} kg</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-gray-400 border border-dashed border-gray-300 rounded-lg bg-white">
                    <LineChart className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    Sin historial de pesajes.<br/>Guarda a este paciente primero.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TOOL 2: LABS Y OCR */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('labs')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <TestTube className="w-4 h-4 mr-2 text-red-500"/> Labs y OCR
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'labs' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'labs' && (
              <div className="p-3 border-t border-gray-100 bg-red-50/30 text-xs space-y-2">
                <div className="mb-3 flex gap-2">
                   <label className="flex-1 py-2 bg-red-100 text-red-700 rounded-md font-bold text-center cursor-pointer hover:bg-red-200 transition-colors text-xs flex justify-center items-center shadow-sm">
                     {isScanningOCR ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Scan className="w-3 h-3 mr-1.5" />}
                     {isScanningOCR ? 'Escaneando...' : 'Subir PDF/Foto'}
                     <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUploadOCR} disabled={isScanningOCR}/>
                   </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500">Glucosa (mg/dL)</label>
                    <input type="number" placeholder="Ej. 95" value={extras.labs.glucosa} onChange={(e) => handleExtrasChange('glucosa', e.target.value, true)} className="mt-1 p-2 border rounded shadow-inner w-full bg-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500">Colest. (mg/dL)</label>
                    <input type="number" placeholder="Ej. 180" value={extras.labs.colesterol} onChange={(e) => handleExtrasChange('colesterol', e.target.value, true)} className="mt-1 p-2 border rounded shadow-inner w-full bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500">Triglicéridos (mg/dL)</label>
                  <input type="number" placeholder="Ej. 120" value={extras.labs.trigliceridos} onChange={(e) => handleExtrasChange('trigliceridos', e.target.value, true)} className="mt-1 p-2 border rounded shadow-inner w-full bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500">Otras notas</label>
                  <textarea placeholder="Valores adicionales..." value={extras.labs.notas} onChange={(e) => handleExtrasChange('notas', e.target.value, true)} className="mt-1 p-2 border rounded shadow-inner w-full resize-none h-16 bg-white"></textarea>
                </div>
                <button onClick={handleAnalyzeLabsAI} disabled={isAnalyzingLabs} className="w-full py-2 bg-red-600 text-white font-bold rounded border hover:bg-red-700 flex justify-center items-center transition-colors shadow-sm mt-2">
                  {isAnalyzingLabs ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Sparkles className="w-3 h-3 mr-1.5" />} Diagnóstico IA
                </button>
                {extras.labsFeedback && (
                  <div className="mt-3 p-3 bg-white border border-red-100 rounded-lg text-gray-800 shadow-sm leading-relaxed border-l-2 border-l-red-500">
                    <p className="font-bold text-red-800 mb-1 text-[10px] uppercase tracking-wider">Resultado Clínico:</p>
                    {extras.labsFeedback}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TOOL 3: AGENDA RÁPIDA */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('agenda')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-purple-500"/> Agenda Rápida
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'agenda' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'agenda' && (
              <div className="p-3 border-t border-gray-100 bg-purple-50/30 text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Próxima Cita</label>
                    <input
                      type="date"
                      value={extras.agendaDate || ''}
                      onChange={(e) => handleExtrasChange('agendaDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded shadow-inner text-xs focus:ring-purple-500 focus:border-purple-500 bg-white mt-1 font-medium text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Hora</label>
                    <input
                      type="time"
                      value={extras.agendaTime || ''}
                      onChange={(e) => handleExtrasChange('agendaTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded shadow-inner text-xs focus:ring-purple-500 focus:border-purple-500 bg-white mt-1 font-medium text-gray-700"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight text-center">Esta fecha se imprimirá en el PDF y se usará para el recordatorio.</p>
              </div>
            )}
          </div>

          {/* TOOL 4: WHATSAPP */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('wa')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-green-500"/> WhatsApp
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'wa' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'wa' && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-xs space-y-2">
                <label className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Número de Celular</label>
                <div className="flex space-x-2">
                  <select
                    value={extras.countryCode}
                    onChange={(e) => handleExtrasChange('countryCode', e.target.value)}
                    className="p-2 border border-gray-300 rounded shadow-inner text-sm font-bold text-gray-700 w-28 shrink-0 bg-white focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+1">🇺🇸/🇨🇦 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+593">🇪🇨 +593</option>
                    <option value="+502">🇬🇹 +502</option>
                  </select>
                  <input 
                    type="tel" 
                    placeholder="Número (Ej. 331...)" 
                    value={extras.phone} 
                    onChange={(e) => handleExtrasChange('phone', e.target.value)} 
                    className="p-2 border border-gray-300 rounded shadow-inner w-full text-sm font-bold tracking-widest text-gray-700 focus:ring-green-500 focus:border-green-500 bg-white" 
                  />
                </div>
                <button 
                  onClick={() => sendWhatsAppReminder(patient.nombre, extras.phone, extras.agendaDate, extras.agendaTime)} 
                  className="w-full py-2 bg-[#25D366] text-white font-bold rounded hover:bg-[#1ebd5a] flex justify-center items-center shadow-sm transition-colors mt-2"
                >
                  <CalendarDays className="w-4 h-4 mr-2"/> Enviar Recordatorio
                </button>
                <button onClick={handleWhatsApp} className="w-full py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded font-bold flex justify-center items-center shadow-sm transition-colors mt-2">
                  <FileText className="w-4 h-4 mr-2"/> Enviar Plan / PDF
                </button>
              </div>
            )}
          </div>

          {/* TOOL 5: 24H RECALL */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('recall')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-amber-500"/> Recall 24H
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'recall' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'recall' && (
              <div className="p-3 border-t border-gray-100 bg-amber-50/30 text-xs space-y-2">
                <label className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Estilo de vida alimenticio</label>
                <textarea placeholder="¿Qué comió ayer? Gustos y horarios..." value={extras.recall} onChange={(e) => handleExtrasChange('recall', e.target.value)} className="p-2 border rounded shadow-inner w-full resize-none h-24 bg-white"></textarea>
                <button onClick={applyRecallToMenu} className="w-full py-2 bg-amber-500 text-white font-bold rounded hover:bg-amber-600 flex justify-center items-center transition-colors shadow-sm">
                  <Utensils className="w-3 h-3 mr-1.5" /> Forzar Menú a este estilo
                </button>
              </div>
            )}
          </div>

          {/* TOOL 6: ENTRENAMIENTO */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => { 
                if (!hasPlusPlan) {
                  setAlertMessage("El módulo de Entrenamiento con IA es exclusivo del Plan Plus.");
                  return;
                }
                setIsRightDrawerOpen(false); 
                setShowWorkoutModal(true); 
              }} 
              className="w-full p-3 flex justify-between items-center hover:bg-slate-50 transition-colors group"
            >
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <Dumbbell className="w-4 h-4 mr-2 text-emerald-950"/> Entrenamiento
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : <Maximize className="w-4 h-4 text-gray-400 group-hover:text-emerald-950 transition-colors" />}
            </button>
          </div>

          {/* TOOL 7: FORMULARIO PRE-CONSULTA */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('onboarding')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-500"/> Pre-Consulta
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'onboarding' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'onboarding' && (
              <div className="p-3 border-t border-gray-100 bg-indigo-50/30 text-xs space-y-2">
                <p className="text-[10px] text-gray-600 mb-2 leading-tight text-center">Envía un formulario para antecedentes.</p>
                {!onboardingUrl ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-yellow-800 text-center">
                    <p className="mb-2 text-[10px] font-medium">Aún no has configurado tu enlace de Google Forms.</p>
                    <button onClick={openSettings} className="px-3 py-1.5 bg-yellow-600 text-white rounded font-bold shadow-sm transition-colors hover:bg-yellow-700">Configurar Link</button>
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-2">
                      <select value={extras.countryCode} onChange={(e) => handleExtrasChange('countryCode', e.target.value)} className="p-2 border border-gray-300 rounded shadow-inner text-sm font-bold text-gray-700 w-28 shrink-0 bg-white">
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+1">🇺🇸/🇨🇦 +1</option>
                      </select>
                      <input type="tel" placeholder="Celular" value={extras.phone} onChange={(e) => handleExtrasChange('phone', e.target.value)} className="p-2 border border-gray-300 rounded shadow-inner w-full text-sm font-bold tracking-widest text-gray-700 bg-white" />
                    </div>
                    <button 
                      onClick={() => {
                        if (!extras.phone) { setAlertMessage("Ingresa el número celular."); return; }
                        const msg = `Hola ${patient.nombre || ''}, para optimizar tiempo, por favor llena este formulario: ${onboardingUrl}`;
                        const cleanPhone = extras.phone.replace(/\D/g, ''); 
                        const cleanCode = extras.countryCode.replace(/\D/g, ''); 
                        window.open(`https://wa.me/${cleanCode}${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-full py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 flex justify-center items-center transition-colors shadow-sm mt-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Enviar Formulario
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* TOOL 8: MARCAS COMERCIALES */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('brands')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-pink-500"/> Marcas Comerciales
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'brands' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'brands' && (
              <div className="p-3 border-t border-gray-100 bg-pink-50/30 text-xs space-y-2">
                <p className="text-[10px] text-gray-600 mb-2 leading-tight text-center">Selecciona marcas específicas para la IA.</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_BRANDS.map(brand => {
                    const isSelected = extras.brands?.includes(brand);
                    return (
                      <button
                        key={brand}
                        onClick={() => {
                          const newBrands = isSelected ? extras.brands.filter(b => b !== brand) : [...(extras.brands || []), brand];
                          handleExtrasChange('brands', newBrands);
                        }}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold border transition-colors ${isSelected ? 'bg-pink-100 text-pink-700 border-pink-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        {isSelected && "✓ "} {brand}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Escribir otra marca y dar Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const val = e.target.value.trim();
                        if (!extras.brands?.includes(val)) handleExtrasChange('brands', [...(extras.brands || []), val]);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded shadow-inner text-xs focus:ring-pink-500 focus:border-pink-500 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TOOL 9: RECETARIO INTERACTIVO */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggleTool('recipes')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm text-gray-700 flex items-center">
                <Bookmark className="w-4 h-4 mr-2 text-rose-500"/> Mi Recetario
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
              </span>
              {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : (expandedTool === 'recipes' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
            </button>
            {expandedTool === 'recipes' && (
              <div className="p-3 border-t border-gray-100 bg-rose-50/30 text-xs space-y-3">
                <p className="text-[10px] text-gray-600 leading-tight text-center">Guarda tus recetas favoritas y obliga a la IA a usarlas.</p>
                {globalRecipes.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {globalRecipes.map(recipe => {
                      const isSelected = extras.activeRecipes?.includes(recipe.id);
                      return (
                        <div key={recipe.id} className={`p-2 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-rose-100 border-rose-300' : 'bg-white border-gray-200 hover:border-rose-200'}`}
                             onClick={() => {
                               const newActive = isSelected ? extras.activeRecipes.filter(id => id !== recipe.id) : [...(extras.activeRecipes || []), recipe.id];
                               handleExtrasChange('activeRecipes', newActive);
                             }}
                        >
                          <div className="flex items-center overflow-hidden pr-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 shrink-0 ${isSelected ? 'bg-rose-500 border-rose-600 text-white' : 'border-gray-300 bg-white'}`}>
                              {isSelected && <CheckCircle className="w-3 h-3" />}
                            </div>
                            <span className="font-bold text-gray-800 text-[11px] truncate">{recipe.title}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="w-3 h-3"/></button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm mt-2">
                  <input type="text" value={newRecipeTitle} onChange={(e) => setNewRecipeTitle(e.target.value)} placeholder="Título (Ej. Pancakes)" className="w-full p-1.5 text-[11px] font-bold border-b border-gray-100 mb-1 focus:outline-none" />
                  <textarea value={newRecipeContent} onChange={(e) => setNewRecipeContent(e.target.value)} placeholder="Ingredientes y preparación..." className="w-full p-1.5 text-[10px] resize-none h-16 focus:outline-none"></textarea>
                  <button onClick={saveNewRecipe} disabled={!newRecipeTitle.trim() || !newRecipeContent.trim()} className="w-full mt-1 py-1.5 bg-rose-600 text-white font-bold rounded hover:bg-rose-700 disabled:bg-rose-300 transition-colors text-[10px]">
                    + Guardar en Catálogo
                  </button>
                </div>
              </div>
            )}
          </div>

        </div> {/* CIERRE 1: Div del listado de herramientas */}
      </aside> {/* CIERRE 2: Aside del Panel Derecho */}

    </div> {/* CIERRE 3: Div gigante del Layout Principal */}
  </MuroDePago> /* CIERRE 4: Muro de pago */
  ); 
} /* CIERRE 5: Llave que cierra la función MainApp */

// --- COMPONENTE RAÍZ ---
export default function App() {
  const [sessionEmail, setSessionEmail] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  return (
    <>
      {!isLogged ? (
        <LoginNutriHealth onComplete={(userData) => {
          setSessionEmail(userData.email);
          setIsLogged(true);
        }} />
      ) : (
        <MainApp externoEmail={sessionEmail} />
      )}
    </>
  );
}