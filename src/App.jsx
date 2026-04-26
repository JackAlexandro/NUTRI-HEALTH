import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  User, Key, CheckCircle, Mail, Activity, Calculator, PieChart, Utensils, Save, Menu, ChevronRight, ChevronLeft,
  UserCircle2, ArrowRight, PlusCircle, ShieldQuestion, X, Zap, BookOpen, Loader2, Printer, Download, FileText, Maximize, Minimize, Lock,
  Database, ExternalLink, Settings, UserSearch, Search, Edit, Camera, Trash2, Upload, RefreshCcw, RefreshCw, Eye, MapPin, LineChart,
  TestTube, MessageCircle, Clock, CalendarDays, Calendar, Dumbbell, ChevronDown, ChevronUp, DollarSign, ShoppingCart, Hash, BarChart, ShoppingBag,
  Scan, Tag, Bookmark, FolderOpen, PanelRightOpen, PanelRightClose, Sparkles
} from 'lucide-react';

// 1. Asegúrate de que el import esté presente
import { GoogleGenerativeAI } from "@google/generative-ai";

import { useTranslation } from 'react-i18next';

// 1. Asegúrate de que esta línea esté completa y escrita así:
import { createClient } from '@supabase/supabase-js';

// 2. CONFIGURACIÓN DE TUS CREDENCIALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 3. CREACIÓN DEL CLIENTE (Aquí es donde te marcaba el error)
export const supabase = createClient(supabaseUrl, supabaseKey);

// 👇 CEREBRO DE IA ADAPTABLE PRO (EDICIÓN LANZAMIENTO) 👇
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const modelIA = {
  generateContent: async (request) => {
    // 1. Extraemos el texto de la solicitud
    let systemInstruction = "";
    let userPrompt = "";

    if (typeof request === 'string') {
      userPrompt = request;
    } else {
      systemInstruction = request.systemInstruction?.parts?.[0]?.text || "";
      userPrompt = request.contents?.[0]?.parts?.[0]?.text || "";
    }
    
    const fullPrompt = systemInstruction 
      ? `[CONTEXTO CLÍNICO ESTRICTO]: ${systemInstruction}\n\n[SOLICITUD DEL NUTRIÓLOGO]: ${userPrompt}` 
      : userPrompt;

    // 2. Conexión DIRECTA a Google usando el modelo vigente
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    try {
      console.log("🤖 Conectando directo al Motor Gemini 2.5 Flash...");
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error desconocido en la API de Google");
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // 3. Devolvemos el objeto con la misma estructura que espera React para no romper tus funciones
      return {
        response: {
          text: () => aiText
        }
      };

    } catch (error) {
      console.error("💀 Fallo total de IA (Fetch):", error.message);
      
      // PLAN B INTEGRADO: Intento de rescate con el modelo Pro genérico
      try {
        console.log("🔄 Intentando rescate con Gemini Pro Genérico...");
        const backupUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;
        const backupResponse = await fetch(backupUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        });
        
        if (!backupResponse.ok) throw new Error("Fallo en Plan B");
        const backupData = await backupResponse.json();
        const backupText = backupData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        return {
          response: {
            text: () => backupText
          }
        };
      } catch (innerError) {
        console.error("💀 Fallo crítico final:", innerError.message);
        throw innerError;
      }
    }
  }
};

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
const DEFAULT_SCRIPT_URL = "";
const DEFAULT_SHEETS_URL = "";

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

// --- ETIQUETAS RÁPIDAS PARA LA IA ---
const QUICK_PROMPTS = [
  { icon: '🚫', label: 'Sin Lácteos', text: 'Dieta libre de lácteos y derivados.' },
  { icon: '🌱', label: 'Vegano', text: 'Dieta estrictamente vegana, sin productos de origen animal.' },
  { icon: '💰', label: 'Económico', text: 'Priorizar ingredientes económicos y fáciles de conseguir.' },
  { icon: '⏱️', label: 'Rápido', text: 'Comidas rápidas de preparar (menos de 15 minutos).' },
  { icon: '🌾', label: 'Sin Gluten', text: 'Dieta libre de gluten, apta para celíacos.' }
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
        <h4 className="text-xs font-medium opacity-90 flex items-center"><BarChart className="w-3.5 h-3.5 mr-1.5" /> Ingresos del Mes</h4>
        <p className="text-xl font-black mt-1">${monthlyRevenue.toFixed(2)} MXN</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-3 rounded-lg text-white shadow-sm">
        <h4 className="text-xs font-medium opacity-90 flex items-center"><Activity className="w-3.5 h-3.5 mr-1.5" /> Pacientes Activos</h4>
        <p className="text-xl font-black mt-1">{activePatientsCount}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-pink-700 p-3 rounded-lg text-white shadow-sm">
        <h4 className="text-xs font-medium opacity-90 flex items-center"><ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Retos Activos</h4>
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
          <a href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=f79c4a0f10094a1599596b6881167b68" target="_blank" className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 py-3 rounded-2xl font-bold hover:bg-gray-100 transition shadow-sm">
            Plan Estándar ($399 MXN)
          </a>
          <a href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=2d6a32fbd9fb4af180556bec8af93e60" target="_blank" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
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

// --- NUEVO COMPONENTE DE LOGIN CON RECUPERACIÓN DE CONTRASEÑA ---
const LoginNutriHealth = ({ onComplete, isDarkMode, initialUser }) => {
  const { t, i18n } = useTranslation();
  const cambiarIdioma = (lng) => i18n.changeLanguage(lng);

  // Agregamos el modo 'reset' para cuando el usuario ya viene del correo
  const [authMode, setAuthMode] = useState('login');
  const [userData, setUserData] = useState(initialUser || { name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ESCUCHADOR MÁGICO: Detecta si el usuario viene de un correo de recuperación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuthMode('reset'); // Cambia la pantalla automáticamente al detectar el enlace
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        });
        if (loginError) throw loginError;
        onComplete(data.user);

      } else if (authMode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: { data: { full_name: userData.name || 'Nutriólogo' } }
        });
        if (signUpError) throw signUpError;
        if (data.user) setSuccessMsg("¡Cuenta creada! Revisa tu correo.");

      } else if (authMode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.email, {
          redirectTo: window.location.origin, // Esto es vital para que regrese aquí
        });
        if (resetError) throw resetError;
        setSuccessMsg("¡Enlace enviado! Revisa tu bandeja de entrada.");

      } else if (authMode === 'reset') {
        // --- 🔐 AQUÍ ES DONDE SE CAMBIA LA CONTRASEÑA REALMENTE ---
        if (userData.password !== userData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        const { error: updateError } = await supabase.auth.updateUser({
          password: userData.password
        });
        if (updateError) throw updateError;
        setSuccessMsg("¡Contraseña actualizada! Ya puedes iniciar sesión.");
        setAuthMode('login');
      }
    } catch (err) {
      // Mensajes amigables
      let msg = err.message;
      if (msg.includes("Invalid login")) msg = "Correo o contraseña incorrectos";
      if (msg.includes("User already registered")) msg = "Este correo ya tiene una cuenta";
      if (msg.includes("Password should be")) msg = "La contraseña debe tener al menos 6 caracteres";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-emerald-900/95 overflow-hidden">
      <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-10 relative z-10">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">
            NUTRI <span className="text-emerald-500">HEALTH</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
            {authMode === 'reset' ? 'Nueva Contraseña' : authMode === 'forgot' ? 'Recuperar' : authMode === 'register' ? 'Crear Cuenta' : 'Acceso Clínico'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input de Nombre (Solo visible en registro) */}
          {authMode === 'register' && (
            <input
              type="text"
              placeholder="Tu Nombre Profesional"
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 text-center"
              value={userData.name}
              onChange={e => setUserData({ ...userData, name: e.target.value })}
            />
          )}

          {authMode !== 'reset' && (
            <input
              type="email"
              placeholder={authMode === 'forgot' ? "Escribe tu correo..." : "Tu correo registrado"}
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 text-center"
              value={userData.email}
              onChange={e => setUserData({ ...userData, email: e.target.value })}
            />
          )}

          {authMode !== 'forgot' && (
            <input
              type="password"
              placeholder={authMode === 'reset' ? "Nueva Contraseña" : "Contraseña"}
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 text-center"
              value={userData.password}
              onChange={e => setUserData({ ...userData, password: e.target.value })}
            />
          )}

          {authMode === 'reset' && (
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 text-center"
              value={userData.confirmPassword}
              onChange={e => setUserData({ ...userData, confirmPassword: e.target.value })}
            />
          )}

          {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase">{error}</p>}
          {successMsg && <p className="text-emerald-600 text-[10px] font-bold text-center bg-emerald-50 p-2 rounded-lg">{successMsg}</p>}

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl shadow-lg hover:bg-emerald-700 transition-all">
            {isLoading ? '...' : authMode === 'reset' ? 'GUARDAR CAMBIOS' : authMode === 'forgot' ? 'ENVIAR ENLACE' : authMode === 'register' ? 'REGISTRARME' : 'CONTINUAR'}
          </button>
        </form>

        {/* 👇 EL FOOTER INTELIGENTE 👇 */}
        <div className="mt-6 text-center border-t border-gray-100 pt-4 flex flex-col gap-3">
          {authMode === 'login' ? (
            <>
              <button type="button" onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMsg(''); }} className="text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
              <div className="text-xs font-medium text-gray-400">
                ¿No tienes cuenta? <button type="button" onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }} className="font-bold text-emerald-500 uppercase tracking-wide">Regístrate</button>
              </div>
            </>
          ) : (
            <button type="button" onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }} className="text-[10px] font-black text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">
              ← Volver al inicio
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

function MainApp({ externoEmail, userId }) { // 👈 Asegúrate que diga userId aquí
  const { t, i18n } = useTranslation();
  const cambiarIdioma = (lng) => i18n.changeLanguage(lng);

  // --- VARIABLES FALTANTES DE RECETAS Y PLANTILLAS ---
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [newRecipeContent, setNewRecipeContent] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');


  // Control de suscripción real desde Supabase
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);
  const [planActual, setPlanActual] = useState(null);


  // --- 1. ACCESO, SEGURIDAD Y SaaS (SUPABASE + LLAVE MAESTRA) ---
  const [accesoPermitido, setAccesoPermitido] = useState(null); // 👈 Empezamos en null para que muestre "Verificando..."
  const [usuarioEmail, setUsuarioEmail] = useState(externoEmail || "");
  const [hasPlusPlan, setHasPlusPlan] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 👈 Si MainApp se montó, es porque ya está autenticado
  // 👇 1. NUEVOS ESTADOS PARA EL BOTÓN "S" 👇
  const [diasTrialRestantes, setDiasTrialRestantes] = useState(0);
  const [mostrarInfoTrial, setMostrarInfoTrial] = useState(false);
  // 👇 ESTADO PARA LA ANIMACIÓN DE PAGO 👇
  const [isRedirectingToPay, setIsRedirectingToPay] = useState(false);

  // --- 2. HISTORIAL Y BUSCADOR INTELIGENTE ---
  const [historyData, setHistoryData] = useState(() => JSON.parse(localStorage.getItem('nutri_history_cache')) || []);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyViewMode, setHistoryViewMode] = useState('pacientes');
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // --- 3. CORAZÓN CLÍNICO (PACIENTE, ANTROPOMETRÍA E ISAK) ---
  const [patient, setPatient] = useState({
    nombre: '', edad: 25, genero: 'Femenino', peso: 65, talla: 160, motivoConsulta: '', suplementos: '', foto: ''
  });
  const [antropo, setAntropo] = useState({
    pliegueTri: '', pliegueSub: '', pliegueSupra: '', pliegueBici: '',
    pliegueSupraespinal: '', pliegueAbdominal: '', pliegueMuslo: '', plieguePantorrilla: '',
    circBrazo: '', circBrazoFlex: '', circCintura: '', circCadera: '', circPantorrilla: '',
    diamMuneca: '', diamHumero: '', diamFemur: ''
  });
  const [energySettings, setEnergySettings] = useState({ formula: 'harris', af: 10, eta: 10 });
  const [macros, setMacros] = useState({ protPercent: 20, lipPercent: 25, hcPercent: 55 });
  const [portions, setPortions] = useState(Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
  const [distribution, setDistribution] = useState(Object.keys(SMAE).reduce((acc, key) => ({ ...acc, [key]: { des: 0, col1: 0, com: 0, col2: 0, cen: 0 } }), {}));
  const [medicalHistory, setMedicalHistory] = useState(DEFAULT_MEDICAL_HISTORY);

  // --- 4. LIBRERÍAS, RECETARIOS Y MENÚS ---
  const [menuText, setMenuText] = useState('');
  const [menuText2, setMenuText2] = useState('');
  const [notesText, setNotesText] = useState('');
  const [groceryListText, setGroceryListText] = useState('');
  const [groceryListText2, setGroceryListText2] = useState('');
  const [menuOptionsCount, setMenuOptionsCount] = useState(1);
  const [menuLibrary, setMenuLibrary] = useState(() => JSON.parse(localStorage.getItem('nutri_menu_library')) || { 'KETO': [], 'VEGAN': [], 'GENERAL': [] });
  const [notesLibrary, setNotesLibrary] = useState(() => JSON.parse(localStorage.getItem('nutri_notes_library')) || { 'DIGESTIÓN': [], 'DEPORTE': [], 'GENERAL': [] });
  const [globalRecipes, setGlobalRecipes] = useState(() => JSON.parse(localStorage.getItem('nutri_recipes')) || []);
  const [savedTemplates, setSavedTemplates] = useState(() => JSON.parse(localStorage.getItem('nutri_templates')) || []);

  // --- 5. MÓDULO DE ENTRENAMIENTO PLUS (CLOUD SYNC) ---
  const [workoutLibrary, setWorkoutLibrary] = useState(() => JSON.parse(localStorage.getItem('nutri_workout_library_v4')) || { 'PIERNA': [], 'BRAZO': [], 'ESPALDA': [], 'PECHO': [], 'GENERAL': [] });
  const [selectedFolder, setSelectedFolder] = useState('PIERNA');
  const [newRoutineName, setNewRoutineName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [expandedTemplates, setExpandedTemplates] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  // --- 6. HERRAMIENTAS PLUS (OCR, FINANZAS, AGENDA, MARCAS) ---
  const [extras, setExtras] = useState({
    countryCode: '+52', phone: '', recall: '', agendaDate: '', agendaTime: '', pesoMeta: '', workoutGoal: '', workoutRoutine: '',
    labs: { glucosa: '', colesterol: '', trigliceridos: '', notas: '' }, labsFeedback: '',
    finance: { monto: '', metodo: 'Efectivo', estado: 'Pagado', notas: '' }, brands: [], activeRecipes: [], showISAK: false, groceryCost: '', groceryCost2: ''
  });

  // --- 7. ESTADOS DE CARGA Y PROCESOS ---
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [isGeneratingGroceryList, setIsGeneratingGroceryList] = useState(false);
  const [isGeneratingSupplements, setIsGeneratingSupplements] = useState(false);
  const [isGeneratingPortions, setIsGeneratingPortions] = useState(false);
  const [isGeneratingDistribution, setIsGeneratingDistribution] = useState(false);
  const [isGeneratingMacros, setIsGeneratingMacros] = useState(false);
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const [isAnalyzingLabs, setIsAnalyzingLabs] = useState(false);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [isSyncingRoutines, setIsSyncingRoutines] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // --- 8. MODALES, NAVEGACIÓN Y CONFIGURACIÓN ---
  const [activeTab, setActiveTab] = useState('historia');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [expandedTool, setExpandedTool] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showLibModal, setShowLibModal] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPdfConfirm, setShowPdfConfirm] = useState(false);
  const [showWaConfirm, setShowWaConfirm] = useState(false);
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpView, setHelpView] = useState('selection');
  const [showGuides, setShowGuides] = useState(() => localStorage.getItem('nutri_show_guides') !== 'false');
  const [alertMessage, setAlertMessage] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [portionsError, setPortionsError] = useState(false);
  const [distributionError, setDistributionError] = useState(false);

  // --- 9. CONFIGURACIÓN DEL SERVIDOR Y MULTIMEDIA ---
  const [scriptUrl, setScriptUrl] = useState(() => localStorage.getItem('nutri_scriptUrl') || DEFAULT_SCRIPT_URL);
  const [sheetsUrl, setSheetsUrl] = useState(() => localStorage.getItem('nutri_sheetsUrl') || DEFAULT_SHEETS_URL);
  const [professionalName, setProfessionalName] = useState(() => localStorage.getItem('nutri_professionalName') || 'EL NUTRIÓLOGO');
  const [location, setLocation] = useState(() => localStorage.getItem('nutri_location') || 'Jalisco, México');
  const [onboardingUrl, setOnboardingUrl] = useState(() => localStorage.getItem('nutri_onboardingUrl') || '');

  // Estados temporales para Settings
  const [tempScriptUrl, setTempScriptUrl] = useState('');
  const [tempSheetsUrl, setTempSheetsUrl] = useState('');
  const [tempProfessionalName, setTempProfessionalName] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempOnboardingUrl, setTempOnboardingUrl] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // --- 10. LÓGICA DE SUSCRIPCIÓN SaaS (ACTUALIZADA Y SEGURA) ---
  const verificarAcceso = async (emailDelUsuario) => {
    if (!emailDelUsuario) {
      console.warn("⚠️ No se recibió email para verificar.");
      setAccesoPermitido(false);
      return;
    }

    const correoLimpio = emailDelUsuario.trim().toLowerCase();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase() || "";

    // 🌟 2. VERIFICACIÓN DE ADMINISTRADOR
    if (correoLimpio === adminEmail) {
      console.log("🔓 Acceso de Administrador Autorizado.");
      setAccesoPermitido(true);
      setHasPlusPlan(true);
      setSuscripcionActiva(true);
      setPlanActual("ADMIN NUTRI HEALTH");
      setDiasTrialRestantes('PRO');
      return;
    }

    try {
      console.log("📡 Consultando suscripción en Supabase para:", correoLimpio);

      // 💳 3. VERIFICAR PAGO EN SUPABASE
      const { data, error } = await supabase
        .from('suscripciones')
        .select('estado_pago, plan_actual')
        .eq('correo_nutriologo', correoLimpio)
        .or('estado_pago.eq.approved,estado_pago.eq.authorized')
        .order('id', { ascending: false }) // 👈 NUEVO: Ordena del más nuevo al más viejo
        .limit(1)                          // 👈 NUEVO: Toma solo el primero
        .maybeSingle();

      // 👇 ESTE LOG ES TU MEJOR AMIGO AHORITA 👇
      console.log("🔍 RESULTADO REAL DE SUPABASE:", { data, error });

      if (error) {
        console.error("❌ Error en consulta Supabase:", error);
        throw error;
      }

      if (data) {
        console.log("✅ Suscripción activa encontrada:", data.plan_actual);

        setSuscripcionActiva(true);
        setPlanActual(data.plan_actual);
        setAccesoPermitido(true);
        setHasPlusPlan(true);
        setDiasTrialRestantes('PRO');
      } else {
        // Si data es null, la consola dirá que no encontró nada
        console.log("⏳ No se encontró pago en la BD, aplicando lógica de Trial.");
        setSuscripcionActiva(false);
        setPlanActual(null);

        // --- AQUÍ SIGUE TU LÓGICA DE TRIAL (14 DÍAS) ---

        // ⏳ 4. LÓGICA DE TRIAL DE 14 DÍAS
        const regKey = `fecha_registro_${correoLimpio}`;
        let inicio = localStorage.getItem(regKey);

        if (!inicio) {
          inicio = new Date().toISOString();
          localStorage.setItem(regKey, inicio);
        }

        const diasTranscurridos = Math.floor((new Date() - new Date(inicio)) / 86400000);
        const esValidoTrial = (14 - diasTranscurridos) > 0;
        const diasRestantes = Math.max(0, 14 - diasTranscurridos);

        setDiasTrialRestantes(diasRestantes);
        console.log(`📅 Días usados: ${diasTranscurridos}. ¿Trial válido?: ${esValidoTrial}`);

        setAccesoPermitido(esValidoTrial);
        setHasPlusPlan(esValidoTrial);
      }
    } catch (err) {
      console.error("❌ Error crítico validando acceso:", err);
      setAccesoPermitido(false);
    }
  };

  // --- 🔥 ARRANQUE AUTOMÁTICO CON SENSORES ---
  useEffect(() => {
    // Esto se verá SÍ O SÍ en la consola apenas cargue la app
    console.log("📡 INTENTO DE ARRANQUE:", {
      autenticado: isAuthenticated,
      email: usuarioEmail,
      id: userId
    });

    if (isAuthenticated && usuarioEmail && userId) {
      console.log("✅ CONDICIONES CUMPLIDAS. Entrando...");
      verificarAcceso(usuarioEmail);
      fetchHistory();
    } else {
      console.warn("❌ BLOQUEADO: Falta información para iniciar.");
      // Si quieres forzar la entrada mientras arreglamos el ID:
      // verificarAcceso(usuarioEmail || "admin@test.com"); 
    }
  }, [isAuthenticated, usuarioEmail, userId]);

  // --- 11. FUNCIONES DE APOYO (IDs, CALENDARIO, SYNC) ---
  const formatExpedienteId = (id) => `EX-${String(id || 0).match(/\d+/)?.[0]?.padStart(4, '0') || '0000'}`;
  const nextRecordId = historyData.length > 0 ? (parseInt(String(historyData[0].ID || historyData[0].id || 0).match(/\d+/)?.[0] || 0) + 1) : 1;
  const displayId = currentRecordId ? formatExpedienteId(currentRecordId) : formatExpedienteId(nextRecordId);

  // Sincronización de Rutinas Cloud
  const syncRoutinesToSheets = async (dataToSave) => {
    if (!scriptUrl || scriptUrl.includes("TU_URL_DE_GOOGLE")) return;
    const lib = (dataToSave && dataToSave.PIERNA) ? dataToSave : workoutLibrary;
    setIsSyncingRoutines(true);
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'saveRoutines', routinesJSON: JSON.stringify(lib) })
      });
    } catch (e) { console.error(e); } finally { setIsSyncingRoutines(false); }
  };

  // --- 12. FUNCIONES DE INTERFAZ (SETTINGS, CÁMARA Y MÁS) ---

  // Abrir configuración cargando los datos actuales en los "temporales"
  const openSettings = () => {
    setTempScriptUrl(scriptUrl);
    setTempSheetsUrl(sheetsUrl);
    setTempProfessionalName(professionalName);
    setTempLocation(location);
    setTempOnboardingUrl(onboardingUrl);
    setShowSettingsModal(true);
  };

  // --- 12. ESTADOS DE IA Y PROMPTS (PARA DIETOSINTÉTICO Y MENÚS) ---
  const [aiMode, setAiMode] = useState('rapido');
  const [aiSelectedGoal, setAiSelectedGoal] = useState('(Usar motivo de consulta general)');
  const [aiPromptModifier, setAiPromptModifier] = useState('');
  const [aiPortionsPromptModifier, setAiPortionsPromptModifier] = useState('');
  const [aiDistributionPromptModifier, setAiDistributionPromptModifier] = useState('');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  // --- FUNCIÓN PARA AGREGAR PROMPTS RÁPIDOS AL EDITOR DE IA ---
  const addQuickPrompt = (textToAdd) => {
    setAiPromptModifier(prev => prev ? `${prev}\n- ${textToAdd}` : `- ${textToAdd}`);
  };

  // Estados para la biblioteca de IA
  const [newLibItemName, setNewLibItemName] = useState('');
  const [libType, setLibType] = useState('menus');
  const [activeLibFolder, setActiveLibFolder] = useState('GENERAL');
  const [showLibSaveForm, setShowLibSaveForm] = useState(false);

  // Guardar configuración y cerrar modal
  const saveSettings = () => {
    setScriptUrl(tempScriptUrl);
    setSheetsUrl(tempSheetsUrl);
    setProfessionalName(tempProfessionalName);
    setLocation(tempLocation);
    setOnboardingUrl(tempOnboardingUrl);

    // Persistencia en LocalStorage
    localStorage.setItem('nutri_scriptUrl', tempScriptUrl);
    localStorage.setItem('nutri_sheetsUrl', tempSheetsUrl);
    localStorage.setItem('nutri_professionalName', tempProfessionalName);
    localStorage.setItem('nutri_location', tempLocation);
    localStorage.setItem('nutri_onboardingUrl', tempOnboardingUrl);

    setShowSettingsModal(false);
    setAlertMessage("Configuración guardada correctamente.");
  };

  // Función para pantalla completa
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
      setShowFullscreenWarning(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setShowFullscreenWarning(false);
    }
  };

  // --- 13. LÓGICA DE CÁMARA ---
  const startCamera = async (mode = 'environment') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAlertMessage("Cámara no soportada o sin HTTPS.");
      return;
    }
    setIsCameraOpen(true);
    setCameraFacingMode(mode);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
      streamRef.current = stream;
      const attach = () => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        else requestAnimationFrame(attach);
      };
      attach();
    } catch (err) {
      setAlertMessage("Error al acceder a la cámara.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsCameraOpen(false);
  };

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
  const somatotypeData = useMemo(() => calculateSomatotype({ ...antropo, talla: patient.talla, peso: patient.peso }), [antropo, patient]);

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

  // --- 💾 FUNCIÓN DE GUARDADO (FIX: HISTORIAL CRONOLÓGICO) ---
  const handleSave = async () => {
    setIsSaving(true);
    const idPaciente = displayId;

    // CLAVE: Generamos el UID para agrupar el expediente único
    const pacienteUID = patient.nombre.trim().toLowerCase().replace(/\s+/g, '_');

    const payload = {
      ID: idPaciente,
      id: idPaciente,
      registroId: idPaciente,
      fecha: new Date().toLocaleDateString(),
      ...patient,
      ...antropo,
      porcentajeGrasa: bodyComp.siriFat.toFixed(2),
      getObjetivo: energy.get.toFixed(0),
      portionsJSON: JSON.stringify({
        portions,
        energySettings,
        macros,
        distribution,
        extras,
        medicalHistory,
        antropoCompleto: antropo
      }),
      menuText,
      notesText,
      groceryListText
    };

    try {
      if (currentRecordId) {
        // 📝 EDITAR: Corregir consulta existente
        const { error } = await supabase
          .from('pacientes')
          .update({
            nombre: patient.nombre,
            fecha: payload.fecha,
            datos: payload,
            paciente_uid: pacienteUID // <--- AGREGADO
          })
          .eq('id', currentRecordId);
        if (error) throw error;
      } else {
        // 🆕 INSERTAR: Nueva consulta
        const { data, error } = await supabase
          .from('pacientes')
          .insert([{
            registro_id: idPaciente,
            paciente_uid: pacienteUID, // <--- AGREGADO PARA EXPEDIENTE ÚNICO
            nombre: patient.nombre,
            fecha: payload.fecha,
            datos: payload,
            nutriologo_id: userId
          }])
          .select();
        if (error) throw error;
        if (data && data[0]) setCurrentRecordId(data[0].id);
      }

      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
      fetchHistory(true);
      return true;

    } catch (error) {
      console.error("Error al guardar:", error);
      setAlertMessage("❌ Error de privacidad: No se pudo guardar en tu base de datos.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!patientToDelete) return;

    try {
      // Borramos de Supabase usando el ID único de la fila
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', patientToDelete.dbId || patientToDelete.id);

      if (error) throw error;

      // Actualizamos la lista local para que desaparezca de la pantalla de inmediato
      setHistoryData(prev => prev.filter(p => (p.dbId || p.id) !== (patientToDelete.dbId || patientToDelete.id)));

      setAlertMessage("✅ Registro eliminado de tu nube privada.");
      setShowDeleteConfirm(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error("Error al borrar:", error);
      setAlertMessage("❌ Error: No se pudo eliminar el registro.");
    }
  };

  // --- 📜 CARGA DE HISTORIAL HÍBRIDO (CORREGIDO PARA HISTORIAL) ---
  const fetchHistory = async (silent = false) => {
    if (!userId) return;

    if (!silent) setIsLoadingHistory(true);
    try {
      // 1. Traer de Supabase (Pedimos el 'id' único de la fila y los 'datos')
      const { data: supabaseData } = await supabase
        .from('pacientes')
        .select('id, datos')
        .eq('nutriologo_id', userId)
        .order('id', { ascending: false });

      // 2. Traer de Google Sheets
      let sheetsData = [];
      if (scriptUrl && scriptUrl.trim() !== "" && !scriptUrl.includes("TU_URL")) {
        try {
          const response = await fetch(`${scriptUrl}?action=getHistory`);
          if (response.ok) sheetsData = await response.json();
        } catch (e) {
          console.warn("No se pudo obtener historial de Sheets.");
        }
      }

      // 3. Procesar datos de Supabase para que incluyan su ID real de DB
      const sbParsed = supabaseData ? supabaseData.map(item => ({
        ...item.datos,
        dbId: item.id // <--- CLAVE: Guardamos el ID único de la fila
      })) : [];

      // 4. Fusionar (Usando el dbId único para que no se borren citas del mismo día)
      const combined = [...sbParsed, ...sheetsData];
      const uniqueData = Array.from(new Map(combined.map(item => [
        // 👇 CAMBIO CLAVE: Usamos el ID de la fila de la DB como llave
        item.dbId || `${item.ID || item.id}_${item.fecha}_${item.registroId}`,
        item
      ])).values());

      // 5. Ordenar por fecha o ID de mayor a menor
      const sorted = uniqueData.sort((a, b) => {
        const numA = parseInt(String(a.ID || 0).match(/\d+/)) || 0;
        const numB = parseInt(String(b.ID || 0).match(/\d+/)) || 0;
        return numB - numA;
      });

      setHistoryData(sorted);
      localStorage.setItem('nutri_history_cache', JSON.stringify(sorted.slice(0, 30)));
    } catch (e) {
      console.error("Error historial:", e);
    } finally {
      if (!silent) setIsLoadingHistory(false);
    }
  };

  // --- 📂 CARGAR PACIENTE PARA EDICIÓN (CORREGIDO) ---
  const loadPatientForEditing = (p, isNewConsultation = false) => {
    // Si es Nueva Cita, obligamos a que el ID sea null para que sea un INSERT
    const dbIdParaCargar = isNewConsultation ? null : (p.dbId || p.id || null);

    setCurrentRecordId(dbIdParaCargar);

    const d = p.datos ? p.datos : p;

    // Datos Generales
    setPatient({
      nombre: d.nombre || d.Nombre || d.Name || '',
      edad: parseInt(d.edad || d.Edad) || 25,
      genero: d.genero || d.Genero || d.Género || 'Femenino',
      peso: parseFloat(d.peso || d.Peso) || 65,
      talla: parseFloat(d.talla || d.Talla) || 160,
      motivoConsulta: d.motivoConsulta || d.Motivo || d['Motivo de Consulta'] || '',
      suplementos: d.suplementos || d.Suplementos || '',
      foto: d.foto || d.Foto || ''
    });

    // Antropometría
    setAntropo({
      pliegueTri: d.pliegueTri || d.PliegueTri || '',
      pliegueSub: d.pliegueSub || d.PliegueSub || '',
      pliegueSupra: d.pliegueSupra || d.PliegueSupra || '',
      pliegueBici: d.pliegueBici || d.PliegueBici || '',
      pliegueSupraespinal: d.pliegueSupraespinal || '',
      pliegueAbdominal: d.pliegueAbdominal || '',
      pliegueMuslo: d.pliegueMuslo || '',
      plieguePantorrilla: d.plieguePantorrilla || '',
      circBrazo: d.circBrazo || d.CircBrazo || '',
      circBrazoFlex: d.circBrazoFlex || '',
      circCintura: d.circCintura || d.CircCintura || '',
      circCadera: d.circCadera || d.CircCadera || '',
      circPantorrilla: d.circPantorrilla || '',
      diamMuneca: d.diamMuneca || d.DiamMuneca || '',
      diamHumero: d.diamHumero || '',
      diamFemur: d.diamFemur || d.DiamFemur || ''
    });

    // Recuperación Profunda
    try {
      const jsonKey = Object.keys(d).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes('portionsjson'));
      const jsonContent = jsonKey ? d[jsonKey] : null;

      if (jsonContent) {
        const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;

        if (parsed.portions) setPortions(parsed.portions);
        if (parsed.energySettings) setEnergySettings(parsed.energySettings);
        if (parsed.macros) setMacros(parsed.macros);
        if (parsed.distribution) setDistribution(parsed.distribution);
        if (parsed.extras) setExtras(prev => ({ ...prev, ...parsed.extras }));

        // Cuestionario Clínico
        const savedHistory = parsed.medicalHistory || parsed.historialMedico || parsed.medical_history;
        if (savedHistory && Array.isArray(savedHistory)) {
          const merged = DEFAULT_MEDICAL_HISTORY.map(defItem => {
            const found = savedHistory.find(s => s.id === defItem.id);
            return found ? { ...defItem, siNo: found.siNo || '', obs: found.obs || '' } : defItem;
          });
          setMedicalHistory(merged);
        } else {
          setMedicalHistory(DEFAULT_MEDICAL_HISTORY);
        }

        if (parsed.antropoCompleto) {
          setAntropo(prev => ({ ...prev, ...parsed.antropoCompleto }));
        }
      }
    } catch (e) {
      console.error("Error desempacando portionsJSON:", e);
    }

    // Textos Libres
    setMenuText(d.menuText || d.MenuA || '');
    setMenuText2(d.menuText2 || d.MenuB || '');
    setMenuOptionsCount((d.menuText2 || d.MenuB) ? 2 : 1);
    setNotesText(d.notesText || d.Notas || '');
    setGroceryListText(d.groceryListText || d.groceryListText2 || '');

    setShowHistoryModal(false);
    setActiveTab('historia');
    setAlertMessage(isNewConsultation ? "Iniciando nueva consulta (usando datos anteriores)." : `Expediente cargado para editar.`);
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
          margin: [10, 10, 15, 10],
          // Dentro de executePDFDownload, busca 'filename:' y cámbialo por esto:
          filename: `Plan_${patient.nombre ? patient.nombre.trim().replace(/\s+/g, '_') : 'Paciente'}_${displayId}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          pagebreak: { mode: ['css', 'legacy'] },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
                  pdf.setGState(new pdf.GState({ opacity: 0.15 }));
                }
                pdf.addImage(watermarkImgData, 'PNG', x, y, imgWidthMM, imgHeightMM);
                if (typeof pdf.GState !== "undefined") {
                  pdf.setGState(new pdf.GState({ opacity: 1.0 }));
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
    updated[idx] = { ...updated[idx], [field]: value }; // <-- Copia profunda correcta
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
      // 1. Extraemos la imagen
      const base64Data = event.target.result.split(',')[1];

      // 2. Tu prompt se queda exactamente igual (es muy bueno)
      const promptText = `Eres un asistente médico experto en lectura de análisis clínicos. 
       Extrae: glucosa, colesterol, trigliceridos, peso. Devuelve un JSON estricto: {"glucosa": n, "colesterol": n, "trigliceridos": n, "peso": n}`;

      try {
        // 3. Usamos la librería oficial, pasándole el texto y la imagen como un arreglo
        const result = await modelIA.generateContent([
          promptText,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          }
        ]);

        const response = await result.response;
        const rawText = response.text();

        // 4. Limpiamos y leemos el JSON que devuelve la IA
        const extracted = JSON.parse(rawText.replace(/```json|```/g, "").trim());

        // 5. Mantenemos TU lógica exacta para actualizar los valores
        if (extracted.glucosa) handleExtrasChange('glucosa', extracted.glucosa, true);
        if (extracted.colesterol) handleExtrasChange('colesterol', extracted.colesterol, true);
        if (extracted.trigliceridos) handleExtrasChange('trigliceridos', extracted.trigliceridos, true);
        if (extracted.peso) setPatient(prev => ({ ...prev, peso: extracted.peso }));

        setAlertMessage("¡Análisis completado con éxito!");
      } catch (err) {
        console.error("Error OCR IA:", err);
        setAlertMessage("Error al procesar la imagen. Revisa tu conexión o API Key.");
      } finally {
        setIsScanningOCR(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- LÓGICA IA AVANZADA ---
  // --- LÓGICA IA AVANZADA (RUTINAS) ---
  const handleGenerateWorkoutAI = async (mode) => {
    setIsGeneratingWorkout(true);

    // 1️⃣ Definimos las instrucciones del sistema
    const systemPrompt = `Eres un entrenador personal y clínico experto. 
    REGLAS ESTRICTAS: 
    1) Responde ÚNICAMENTE con la rutina solicitada. 
    2) Si te piden días específicos, divide la rutina EXACTAMENTE por esos días. 
    3) Usa un formato limpio con emojis, indicando series, repeticiones y tiempo de descanso. 
    4) Evita ejercicios prohibidos si el nutriólogo los menciona. 
    5) Sé directo, sin introducciones largas.`;

    // 2️⃣ Construimos la consulta dependiendo del modo (Rápido o Personalizado)
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

    try {
      // 3️⃣ Llamada limpia y nativa al SDK de Gemini
      const result = await modelIA.generateContent({
        contents: [{ role: "user", parts: [{ text: query }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.3 }
      });

      const response = await result.response;
      const aiText = response.text();

      // 4️⃣ Guardamos el texto en el editor de la app
      if (aiText) {
        setExtras(prev => ({ ...prev, workoutRoutine: aiText.trim() }));
      }
    } catch (err) {
      console.error("Error IA Rutinas:", err);
      setAlertMessage("Hubo un problema de conexión con el generador de rutinas. Intenta de nuevo.");
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
    while (workoutLibrary[name]) { name = `${baseName} ${count}`; count++; }

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
      // Usamos el modelIA que configuraste en la línea 1, ya no necesitas poner la URL ni la API Key aquí
      const result = await modelIA.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setExtras(prev => ({ ...prev, labsFeedback: text.trim() }));
    } catch (error) {
      console.error("Error IA Laboratorios:", error);
      setAlertMessage("Error al analizar laboratorios con la IA. Revisa tu conexión o API Key.");
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

    // 1️⃣ PRIMERO: Construimos el prompt con los datos del paciente
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

    try {
      // 2️⃣ SEGUNDO: Llamamos a la IA usando el SDK oficial de forma limpia
      const result = await modelIA.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "Eres un profesional de la salud escribiendo directamente en el expediente clínico. Responde solo con la posología." }] }
      });

      const response = await result.response;
      const aiText = response.text();

      // 3️⃣ TERCERO: Guardamos el resultado en la caja de texto
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

    // 1️⃣ PRIMERO: Construimos el texto con las instrucciones
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

    try {
      // 2️⃣ SEGUNDO: Llamamos a la IA usando el SDK oficial, obligándola a devolver JSON
      const result = await modelIA.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "Debes responder EXCLUSIVAMENTE con un JSON válido." }] },
        generationConfig: { responseMimeType: "application/json" }
      });

      const response = await result.response;
      const text = response.text();

      // 3️⃣ TERCERO: Limpiamos la respuesta y la convertimos en objeto JavaScript
      const cleanText = text.replace(/```json|```/g, "").trim();
      const aiPortions = JSON.parse(cleanText);

      // 4️⃣ CUARTO: Actualizamos tu estado de React para que se vea en pantalla
      setPortions(prev => {
        const newPortions = { ...prev };
        Object.keys(SMAE).forEach(key => {
          newPortions[key] = parseFloat(aiPortions[key]) || 0;
        });
        return newPortions;
      });

    } catch (error) {
      console.error("Error IA Porciones:", error);
      setPortionsError(true);
      setAlertMessage("Hubo un problema al calcular las porciones. Revisa tu conexión o API Key.");
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

    // 1️⃣ PRIMERO: Se construye el texto del prompt
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

    try {
      // 2️⃣ SEGUNDO: Se llama a la IA obligando a que responda en JSON perfecto
      const result = await modelIA.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "Devuelve EXCLUSIVAMENTE un objeto JSON. Las claves principales deben ser los IDs de los grupos de alimentos y el valor un sub-objeto con las claves fijas: des, col1, com, col2, cen. Ejemplo: {\"verduras\": {\"des\": 1, \"col1\": 0, \"com\": 1.5, \"col2\": 0, \"cen\": 0.5}}" }] },
        generationConfig: { responseMimeType: "application/json" }
      });

      const response = await result.response;
      const cleanText = response.text().replace(/```json|```/g, "").trim();
      const aiDist = JSON.parse(cleanText);

      // 3️⃣ TERCERO: Se actualiza la tabla en pantalla
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
      setAlertMessage("Hubo un problema al calcular la distribución. Revisa tu conexión o API Key.");
    } finally {
      setIsGeneratingDistribution(false);
    }
  };

  // --- FUNCIÓN PARA RECOPILAR EL CONTEXTO CLÍNICO PARA LA IA ---
  const buildClinicalContext = () => {
    const historyStr = medicalHistory
      .filter(item => item.siNo === 'SI')
      .map(item => `${item.label}: ${item.obs || 'Sí'}`)
      .join(', ');

    return `
      Edad: ${patient.edad} años
      Género: ${patient.genero}
      Peso actual: ${patient.peso} kg
      Talla: ${patient.talla} cm
      Motivo de consulta principal: ${patient.motivoConsulta || 'Mejorar hábitos y salud general'}
      Antecedentes o patologías (¡CRÍTICO!): ${historyStr || 'Ningún antecedente clínico relevante reportado'}
      Laboratorios/Bioquímicos: ${extras.labsFeedback || 'No cuenta con estudios recientes'}
    `.trim();
  };

  // --- 0. GENERACIÓN DE MACROS INTELIGENTE ---
  const handleGenerateMacrosAI = async () => {
    setIsGeneratingMacros(true);

    const prompt = `Eres un nutriólogo clínico de alto nivel. Calcula la distribución IDEAL de macronutrientes en porcentajes para este paciente, basándote en sus patologías, observaciones clínicas y metas:
      
    ${buildClinicalContext()}
      
    Regla estricta: Los valores deben sumar exactamente 100.
    Responde EXCLUSIVAMENTE con un JSON válido usando estas llaves exactas: {"protPercent": 0, "lipPercent": 0, "hcPercent": 0}`;

    try {
      const result = await modelIA.generateContent(prompt);
      const response = await result.response;
      const cleanText = response.text().replace(/```json|```/g, "").trim();

      const resultJson = JSON.parse(cleanText);
      if (resultJson.protPercent + resultJson.lipPercent + resultJson.hcPercent === 100) {
        setMacros(resultJson);
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

    // 1️⃣ Construimos el resumen de equivalentes
    const buildMealSummary = (mealKey) => {
      return Object.entries(SMAE).map(([k, data]) => {
        const val = distribution[k][mealKey];
        return val > 0 ? `${val} eq de ${data.nombre}` : null;
      }).filter(Boolean).join(', ') || 'Sin porciones asignadas';
    };

    const isDouble = menuOptionsCount === 2;

    // 2️⃣ Instrucciones del sistema (Cómo debe actuar la IA)
    const systemPrompt = `Eres un experto nutriólogo clínico. 
    REGLAS ESTRICTAS: 
    1) Contexto local: Usa ingredientes, marcas y terminología habitual en ${location}. 
    2) Tono: Humano, profesional y directo. Prohibido usar introducciones de IA como "Aquí tienes tu plan". 
    3) Formato: Usa guiones y viñetas (•). 
    4) Precisión: Respeta exactamente la distribución de equivalentes del SMAE enviada.
    ${isDouble ? '5) Formato de salida: Escribe la Opción A completa, luego el separador "|||", y finalmente la Opción B.' : ''}`;

    // 3️⃣ El texto base con los datos del paciente
    let prompt = `Genera un plan nutricional de ${energy.get.toFixed(0)} kcal para un paciente ${patient.genero} de ${patient.edad} años.\n`;
    prompt += `Distribución requerida:\n- Desayuno: ${buildMealSummary('des')}\n- Colación 1: ${buildMealSummary('col1')}\n- Comida: ${buildMealSummary('com')}\n- Colación 2: ${buildMealSummary('col2')}\n- Cena: ${buildMealSummary('cen')}.\n`;

    if (patient.suplementos) prompt += `\nSuplementación a incluir: ${patient.suplementos}.`;
    if (aiPromptModifier) prompt += `\nRestricciones/Instrucciones adicionales: ${aiPromptModifier}`;

    try {
      // 4️⃣ Llamamos a la IA usando el SDK oficial limpio
      const result = await modelIA.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      });

      const response = await result.response;
      const aiText = response.text();

      // 5️⃣ Procesamos el texto y lo ponemos en las cajas de la app
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
  // --- 2. EXTRACCIÓN DE LISTA DE COMPRAS INTELIGENTE ---
  const handleGenerateGroceryListAI = async () => {
    if (!menuText && !menuText2) return;
    setIsGeneratingGroceryList(true);

    const isDouble = menuOptionsCount === 2 && menuText2;
    const promptText = `Analiza los siguientes menús y genera una lista de compras consolidada organizada por pasillos del supermercado con emojis. Calcula un costo monetario aproximado para ${location}.\n\nMENÚ A: ${menuText}\n${isDouble ? 'MENÚ B: ' + menuText2 : ''}`;

    const systemInstructionText = isDouble
      ? `Responde exclusivamente en formato JSON con estas llaves: {"listaA": "texto...", "costoA": "monto...", "listaB": "texto...", "costoB": "monto..."}`
      : `Responde exclusivamente en formato JSON con estas llaves: {"lista": "texto...", "costo": "monto..."}`;

    try {
      // Llamada limpia al nuevo SDK de Gemini
      const result = await modelIA.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: systemInstructionText }] },
        generationConfig: { responseMimeType: "application/json" }
      });

      const response = await result.response;
      const cleanJson = response.text().replace(/```json|```/g, "").trim();
      const resultJson = JSON.parse(cleanJson);

      if (isDouble) {
        setGroceryListText(resultJson.listaA || "");
        setGroceryListText2(resultJson.listaB || "");
        handleExtrasChange('groceryCost', resultJson.costoA || "");
        handleExtrasChange('groceryCost2', resultJson.costoB || "");
      } else {
        setGroceryListText(resultJson.lista || "");
        handleExtrasChange('groceryCost', resultJson.costo || "");
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
              <User className="w-4 h-4 mr-2 text-emerald-600" /> Datos Generales
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
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center"><Activity className="w-4 h-4 mr-2 text-emerald-600" /> Motivo de Consulta</h3>
            <textarea name="motivoConsulta" value={patient.motivoConsulta} onChange={handlePatientChange} className="w-full flex-1 p-2 text-sm border rounded-md focus:ring-emerald-500 resize-none min-h-[80px]" placeholder="Antecedentes, indicadores clínicos, metas deportivas..."></textarea>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center"><Camera className="w-4 h-4 mr-2 text-emerald-600" /> Fotografía de Control</h3>
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
            <FileText className="w-4 h-4 mr-2 text-emerald-600" /> Cuestionario Clínico y Antecedentes
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
          <Activity className="w-5 h-5 mr-2 text-emerald-600" /> Antropometría y Composición
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

  {/* RENDER GET CORREGIDO */ }
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
                  <Zap className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" /> Calculadora de Suplementos
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
              <strong>Modo expandido.</strong><br />
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
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Finanzas y Cobranza
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
                <h3 className="text-lg font-bold text-gray-800 flex items-center"><Database className="w-5 h-5 mr-2 text-indigo-600" /> Base de Datos de Plantillas</h3>
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
                <h3 className="text-lg font-bold text-gray-800 flex items-center"><Settings className="w-5 h-5 mr-2 text-emerald-600" /> Configuración del Sistema</h3>
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
                  <input type="text" value={tempProfessionalName} onChange={(e) => setTempProfessionalName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 text-sm shadow-inner uppercase" placeholder="Ej.  EL NUTRIOLOGO" />
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
                <button onClick={saveSettings} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center"><Save className="w-4 h-4 mr-2" /> Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE HISTORIAL: EXPEDIENTE ÚNICO E HISTORIAL CRONOLÓGICO */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-in fade-in px-2 sm:px-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-4 max-w-5xl w-full shadow-2xl max-h-[95vh] flex flex-col border border-gray-100">

              {/* CABECERA: Título y botón de actualización */}
              <div className="flex justify-between items-center mb-3 border-b pb-3 shrink-0">
                <h3 className="text-xl font-black text-gray-800 flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mr-3">
                    <UserSearch className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    Historial de Pacientes
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Expediente Clínico Digital</span>
                  </div>
                  <button
                    onClick={() => fetchHistory(false)}
                    className="ml-5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black hover:bg-emerald-100 flex items-center border border-emerald-100 transition-all"
                  >
                    {isLoadingHistory ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                    ACTUALIZAR
                  </button>
                </h3>
                <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* DASHBOARD: Estadísticas rápidas del nutriólogo */}
              <BusinessDashboard historyData={historyData} />

              {/* BARRA DE HERRAMIENTAS: Buscador y Filtros de Vista */}
              <div className="flex flex-col md:flex-row gap-3 mb-4 shrink-0">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, fecha o ID de expediente..."
                    className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:ring-0 text-sm shadow-sm transition-all font-medium"
                  />
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto shrink-0 shadow-inner">
                  <button
                    onClick={() => setHistoryViewMode('pacientes')}
                    className={`flex-1 md:px-6 py-2 text-[10px] font-black rounded-xl transition-all flex items-center justify-center uppercase tracking-widest ${historyViewMode === 'pacientes' ? 'bg-white text-emerald-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <User className="w-3.5 h-3.5 mr-2" /> Únicos
                  </button>
                  <button
                    onClick={() => setHistoryViewMode('historial')}
                    className={`flex-1 md:px-6 py-2 text-[10px] font-black rounded-xl transition-all flex items-center justify-center uppercase tracking-widest ${historyViewMode === 'historial' ? 'bg-white text-emerald-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <CalendarDays className="w-3.5 h-3.5 mr-2" /> Todo
                  </button>
                </div>
              </div>

              {/* LISTADO DE PACIENTES */}
              <div className="flex-1 overflow-y-auto bg-gray-50/50 border-2 border-gray-100 rounded-3xl p-3 sm:p-4">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                    <p className="text-xs font-black uppercase tracking-widest">Sincronizando nube privada...</p>
                  </div>
                ) : historyData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      let itemsFinales = [];
                      if (historyViewMode === 'pacientes') {
                        const mapUnicos = new Map();
                        historyData.forEach(p => {
                          const nombreNormalizado = (p.nombre || p.Nombre || "Sin Nombre").trim().toLowerCase();
                          if (!mapUnicos.has(nombreNormalizado)) mapUnicos.set(nombreNormalizado, p);
                        });
                        itemsFinales = Array.from(mapUnicos.values());
                      } else {
                        itemsFinales = historyData;
                      }

                      return itemsFinales
                        .filter(h => {
                          const str = `${h.nombre} ${h.fecha} ${h.registro_id} ${h.ID}`.toLowerCase();
                          return str.includes(historySearchTerm.toLowerCase());
                        })
                        .map((paciente, idx) => {
                          const nombreP = paciente.nombre || paciente.Nombre || "Sin Nombre";
                          const fechaP = paciente.fecha || paciente.Fecha || "-";

                          return (
                            <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-400 transition-all group flex flex-col">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-lg shadow-inner">
                                    {nombreP.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-gray-800 text-sm leading-tight line-clamp-1">{nombreP}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center mt-1">
                                      <Activity className="w-3 h-3 mr-1" /> {fechaP}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-[9px] bg-gray-100 px-2 py-1 rounded-lg font-mono font-bold text-gray-500 border border-gray-200">
                                    {formatExpedienteId(paciente.registro_id || paciente.ID || paciente.id)}
                                  </span>
                                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                    {paciente.peso || paciente.Peso || "-"} KG
                                  </span>
                                </div>
                              </div>

                              <p className="text-[11px] text-gray-500 line-clamp-2 italic mb-5">
                                <span className="font-bold text-gray-700 not-italic uppercase text-[9px] mr-1">Motivo:</span>
                                {paciente.motivoConsulta || paciente.Motivo || "Consulta de seguimiento"}
                              </p>

                              <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                                <button
                                  onClick={() => loadPatientForEditing(paciente, false)}
                                  className="flex-1 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-black hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 uppercase"
                                >
                                  <Edit className="w-3 h-3" /> Revisar
                                </button>
                                <button
                                  onClick={() => loadPatientForEditing(paciente, true)}
                                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2 uppercase"
                                >
                                  <PlusCircle className="w-3 h-3" /> Nueva Cita
                                </button>
                                <button
                                  onClick={() => { setPatientToDelete(paciente); setShowDeleteConfirm(true); }}
                                  className="p-2.5 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        });
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Database className="w-12 h-12 text-gray-200 mb-4" />
                    <h4 className="text-gray-800 font-black uppercase tracking-widest text-sm">Historial Vacío</h4>
                    <p className="text-[10px] text-gray-400 font-bold max-w-xs mt-2 uppercase">Tus pacientes aparecerán aquí en cuanto guardes tu primera consulta.</p>
                  </div>
                )}
              </div>

              {/* PIE DE PÁGINA */}
              <div className="flex justify-between items-center pt-4 border-t mt-4 shrink-0">
                <button
                  onClick={() => window.open(sheetsUrl, '_blank')}
                  className="px-4 py-2 bg-white border-2 border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 text-[10px] font-black flex items-center transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2 text-emerald-500" /> EXPORTAR EXCEL
                </button>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-8 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 👇 AQUÍ ESTÁ EL CAMBIO: MODAL DE CONFIRMACIÓN PARA BORRAR 👇 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase">¿Eliminar registro?</h3>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                Esta acción es permanente y no podrás recuperar los datos de <span className="font-black text-red-600">{patientToDelete?.nombre}</span>.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setPatientToDelete(null); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                >
                  Sí, Borrar
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
                <br />Esta acción no se puede deshacer en la base de datos.
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
                          <p className="text-sm font-black text-emerald-600 animate-pulse flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Redactando rutina con IA...</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <Edit className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-black text-emerald-950">Editor de Rutina</h4>
                      </div>
                      <textarea
                        value={extras.workoutRoutine}
                        onChange={e => setExtras({ ...extras, workoutRoutine: e.target.value })}
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
                                  <button onClick={() => deleteRoutine(selectedFolder, routine.id)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <button onClick={() => toggleExpandTemplate(routine.id)} className="flex-1 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                    {expandedTemplates[routine.id] ? 'Ocultar' : 'Ver Texto'}
                                  </button>
                                  <button onClick={() => setExtras({ ...extras, workoutRoutine: routine.content })} className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black hover:bg-emerald-100 transition-colors">
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
                              <button onClick={() => handleDeleteFromLib(activeLibFolder, item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
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
                    } catch (e) { }
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
                            { t: "Patologías", d: "Diabetes, HTA, Alergias." },
                            { t: "Subjetivo", d: "Motivo y metas." },
                            { t: "Suplementos", d: "Dosis y porciones." },
                            { t: "Recall 24h", d: "Hábitos y gustos." }
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
                        <h6 className="font-black text-red-700 uppercase text-xs mb-2 flex items-center"><Scan size={18} className="mr-2" /> OCR Vision IA (Labs)</h6>
                        <p className="text-[10px] text-gray-600">Sube fotos de estudios de sangre. La IA extrae Glucosa, Colesterol y Triglicéridos. Presiona <strong>"Diagnóstico IA"</strong> para generar un análisis de riesgo interpretado para el paciente.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-emerald-100 rounded-3xl">
                        <h6 className="font-black text-emerald-700 uppercase text-xs mb-2 flex items-center"><Dumbbell size={18} className="mr-2" /> Rutinas Cloud Sync</h6>
                        <p className="text-[10px] text-gray-600">Crea carpetas (Ej: Tren Superior). El botón <strong>"Guardar en la Nube"</strong> sincroniza tus plantillas con tu Sheets para que aparezcan en todos tus dispositivos.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-green-100 rounded-3xl">
                        <h6 className="font-black text-green-700 uppercase text-xs mb-2 flex items-center"><MessageCircle size={18} className="mr-2" /> WhatsApp Integrado</h6>
                        <p className="text-[10px] text-gray-600">Envía recordatorios de citas o el plan completo. El sistema descarga el PDF y abre el chat del paciente automáticamente para que solo tengas que adjuntar.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-orange-100 rounded-3xl">
                        <h6 className="font-black text-orange-700 uppercase text-xs mb-2 flex items-center"><ShoppingCart size={18} className="mr-2" /> Súper Inteligente</h6>
                        <p className="text-[10px] text-gray-600">Extrae ingredientes de los Menús A y B. Organiza por pasillos del súper y estima el <strong>Costo Total</strong> de la despensa semanal según tu ciudad.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-pink-100 rounded-3xl">
                        <h6 className="font-black text-pink-700 uppercase text-xs mb-2 flex items-center"><Tag size={18} className="mr-2" /> Inyector de Marcas</h6>
                        <p className="text-[10px] text-gray-600">Selecciona marcas específicas (Ej: Salmas, Susalia). La IA recibirá estas marcas como **restricción obligatoria** al redactar los ingredientes del menú.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-rose-100 rounded-3xl">
                        <h6 className="font-black text-rose-700 uppercase text-xs mb-2 flex items-center"><Bookmark size={18} className="mr-2" /> Recetario Privado</h6>
                        <p className="text-[10px] text-gray-600">Guarda tus recetas estrella. Actívalas antes de generar la dieta para que la IA las incluya como la base del plan de ese día.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-slate-100 rounded-3xl">
                        <h6 className="font-black text-slate-700 uppercase text-xs mb-2 flex items-center"><Clock size={18} className="mr-2" /> R24H (Recall 24h)</h6>
                        <p className="text-[10px] text-gray-600">Ingresa los hábitos reales del paciente. Al presionar <strong>"Forzar Menú"</strong>, la IA ajusta los equivalentes SMAE a los horarios y gustos registrados.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-emerald-50 rounded-3xl shadow-inner">
                        <h6 className="font-black text-emerald-800 uppercase text-xs mb-2 flex items-center"><DollarSign size={18} className="mr-2" /> Cobranza y Finanzas</h6>
                        <p className="text-[10px] text-gray-600">Registra montos, métodos y estados de pago. Se conecta con el dashboard del historial para ver tus ingresos totales del mes.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-purple-100 rounded-3xl">
                        <h6 className="font-black text-purple-700 uppercase text-xs mb-2 flex items-center"><CalendarDays size={18} className="mr-2" /> Agenda y Calendario</h6>
                        <p className="text-[10px] text-gray-600">Gestiona citas próximas. El sistema lee el historial y te muestra una lista cronológica de tus pacientes agendados.</p>
                      </div>

                      <div className="p-5 bg-white border-2 border-blue-50 rounded-3xl">
                        <h6 className="font-black text-blue-700 uppercase text-xs mb-2 flex items-center"><UserSearch size={18} className="mr-2" /> Buscador Predictivo</h6>
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
                        {["ID", "Fecha", "Nombre", "Edad", "Genero", "Peso", "Talla", "Motivo", "Suplementos", "Foto", "portionsJSON"].map(h => (
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
                <User className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
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
              {/* 👇 BLOQUE DINÁMICO: GESTIÓN DE SUSCRIPCIÓN 👇 */}
              <div className="relative ml-3">
                {/* Botón redondo "S" (Siempre visible para gestión) */}
                <button
                  onClick={() => setMostrarInfoTrial(!mostrarInfoTrial)}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[12px] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  S
                </button>

                {/* Ventana de información / selección */}
                {mostrarInfoTrial && (
                  <div className="absolute top-8 right-0 w-56 bg-white border border-emerald-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95">
                    <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 border-b border-emerald-100 pb-1 text-center">
                      Tu Suscripción
                    </p>

                    {suscripcionActiva ? (
                      /* --- VISTA: USUARIO PRO (PAGADO) --- */
                      <div className="flex flex-col animate-in fade-in duration-300">
                        <div className="bg-emerald-50 rounded-xl p-3 text-center mb-3 border border-emerald-100">
                          <p className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Plan Activo</p>
                          <p className="text-[10px] font-black text-gray-800 uppercase line-clamp-1">{planActual || 'Nutri Health Pro'}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => window.open('https://www.mercadopago.com.mx/subscriptions', '_blank')}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-[9px] font-black hover:bg-gray-800 transition-colors uppercase"
                          >
                            Cambiar Plan
                          </button>

                          <button
                            onClick={() => window.open('https://www.mercadopago.com.mx/subscriptions', '_blank')}
                            className="w-full bg-white text-red-500 border border-red-100 py-2.5 rounded-xl text-[9px] font-black hover:bg-red-50 transition-colors uppercase"
                          >
                            Cancelar Suscripción
                          </button>
                        </div>

                        <p className="text-[7px] text-gray-400 mt-3 text-center leading-tight uppercase font-bold">
                          Gestiona tus pagos en <br /> el portal de Mercado Pago
                        </p>
                      </div>
                    ) : (
                      /* --- VISTA: USUARIO EN TRIAL (SIN PAGO) --- */
                      <div className="flex flex-col animate-in fade-in duration-300">
                        <p className="text-xs text-gray-600 mt-2 font-medium text-center">
                          Te quedan <strong className="text-emerald-600 text-xl mx-1">{diasTrialRestantes}</strong> días de prueba.
                        </p>

                        <div className="flex flex-col gap-2 mt-4">
                          <a
                            href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=f79c4a0f10094a1599596b6881167b68"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center w-full bg-gray-50 text-gray-700 border border-gray-200 py-2.5 rounded-xl text-[9px] font-black hover:bg-gray-100 transition-colors uppercase"
                          >
                            Plan Estándar ($399)
                          </a>

                          <a
                            href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=2d6a32fbd9fb4af180556bec8af93e60"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center w-full bg-emerald-600 text-white py-2.5 rounded-xl text-[9px] font-black hover:bg-emerald-700 transition-colors shadow-md border border-emerald-500 uppercase"
                          >
                            Adquirir Plan Pro ($799)
                          </a>
                        </div>

                        <p className="text-[8px] text-gray-400 mt-3 text-center leading-tight">
                          El acceso se desbloquea <br /> automáticamente al pagar.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* 👆 FIN DEL BLOQUE ACTUALIZADO 👆 */}

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
                  <LineChart className="w-4 h-4 mr-2 text-blue-500" /> Evolución
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
                          <span className="font-medium text-gray-600 flex items-center"><CalendarDays className="w-3 h-3 mr-1.5 text-gray-400" /> {h.Fecha || h.fecha}</span>
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{h.Peso || h.peso} kg</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-gray-400 border border-dashed border-gray-300 rounded-lg bg-white">
                      <LineChart className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                      Sin historial de pesajes.<br />Guarda a este paciente primero.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TOOL 2: LABS Y OCR */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => toggleTool('labs')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-bold text-sm text-gray-700 flex items-center">
                  <TestTube className="w-4 h-4 mr-2 text-red-500" /> Labs y OCR
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
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUploadOCR} disabled={isScanningOCR} />
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
                  <CalendarDays className="w-4 h-4 mr-2 text-purple-500" /> Agenda Rápida
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
                  <MessageCircle className="w-4 h-4 mr-2 text-green-500" /> WhatsApp
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
                    <CalendarDays className="w-4 h-4 mr-2" /> Enviar Recordatorio
                  </button>
                  <button onClick={handleWhatsApp} className="w-full py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded font-bold flex justify-center items-center shadow-sm transition-colors mt-2">
                    <FileText className="w-4 h-4 mr-2" /> Enviar Plan / PDF
                  </button>
                </div>
              )}
            </div>

            {/* TOOL 5: 24H RECALL */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => toggleTool('recall')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-bold text-sm text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-amber-500" /> Recall 24H
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
                  <Dumbbell className="w-4 h-4 mr-2 text-emerald-950" /> Entrenamiento
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm flex items-center ml-2">Plus</span>
                </span>
                {!hasPlusPlan ? <Lock className="w-4 h-4 text-gray-400" /> : <Maximize className="w-4 h-4 text-gray-400 group-hover:text-emerald-950 transition-colors" />}
              </button>
            </div>

            {/* TOOL 7: FORMULARIO PRE-CONSULTA */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => toggleTool('onboarding')} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-bold text-sm text-gray-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Pre-Consulta
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
                  <Tag className="w-4 h-4 mr-2 text-pink-500" /> Marcas Comerciales
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
                  <Bookmark className="w-4 h-4 mr-2 text-rose-500" /> Mi Recetario
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
                            <button onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="w-3 h-3" /></button>
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
        </aside>
      </div>
    </MuroDePago>
  ); // Cierre del return
} // Cierre de la función MainApp

// --- COMPONENTE RAÍZ ---
// --- AL FINAL DEL ARCHIVO ---
export default function App() {
  const [sessionUser, setSessionUser] = useState(null);

  return (
    <>
      {!sessionUser ? (
        <LoginNutriHealth onComplete={(user) => {
          // Guardamos en localStorage para que otras partes del código no se rompan
          localStorage.setItem('nutri_auth', 'true');
          setSessionUser(user);
        }} />
      ) : (
        <MainApp externoEmail={sessionUser.email} userId={sessionUser.id} />
      )}
    </>
  );
}
console.log("Despierta Vercel V2.8");
