# 🚀 Despliegue a Vercel - THE DROP 10K

## ✅ Archivos preparados:
- `vercel.json` ✓ (Configuración de Vercel)
- `api/join.js` ✓ (Función serverless para el endpoint)
- `index.html` ✓ (Copiado a la raíz para Vercel)

---

## 📋 PASOS PARA DESPLEGAR

### 1️⃣ Crear una cuenta en Vercel

Ve a [vercel.com](https://vercel.com) y crea una cuenta con GitHub (gratis, sin tarjeta).

---

### 2️⃣ Subir tu código a GitHub

Si aún no has creado un repositorio:

```bash
cd /Users/jorgesanchezgarzon/.gemini/antigravity/scratch/the_drop_10k

# Inicializa Git
git init

# Añade todos los archivos
git add .

# Haz el primer commit
git commit -m "Initial commit - THE DROP 10K"

# Crea un repo en GitHub y luego conéctalo:
# (Crea el repo 'the-drop-10k' en github.com y ejecuta:)
git remote add origin https://github.com/TU_USUARIO/the-drop-10k.git
git branch -M main
git push -u origin main
```

---

### 3️⃣ Conectar GitHub a Vercel

1. Inicia sesión en [vercel.com](https://vercel.com)
2. Haz clic en **"Add New Project"**
3. Autoriza a Vercel a acceder a tu GitHub
4. Selecciona el repositorio `the-drop-10k`
5. Haz clic en **"Import"**

---

### 4️⃣ Configurar Variables de Entorno

Antes de hacer el deploy, añade estas variables:

En la pantalla de configuración de Vercel, ve a **"Environment Variables"** y añade:

```
BREVO_API_KEY
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

FIREBASE_PROJECT_ID
the-drop10k

FIREBASE_CLIENT_EMAIL
firebase-adminsdk-fbsvc@the-drop10k.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2X3sQATJ2zYka
3cU4Tw6MoxVZcwJ8g4uV6YhMrqb8KLWLvnfj/uhRtlh8CcbYnpNPK3ezpy2C3quD
nzhpot3mIazh5dKO08MwjdhbyP+aD2msP5SdHMW1EWJvuzNmXwuWY4CN5reUHuY1
GJOCgkvTgG/smSUnrjOZD4gbmume+53RKUT+4UhL9W6ZyO6Glm9We80TKBT7kT/G
zZvZFdNekn9oL9VclArssVMtDlOAjJT9U2GJuhlugL9ZJmxM9QDQ/Qb6HC8ZVwPi
tLj+2mY3wm7s4qimbE8c8hunkDx6wmJ6VQyNuK1AYfOlvgsgcC3NRG17ONvrWdrq
ujq2G9YpAgMBAAECggEADuF4laQ7XWVE+Cu7UW5l9gTCk7NmMwm6xIczJ2qi1nVt
5tKqTrC4fR5fVvOnRXqe83lNAZw1AvYvUYSW4ku3RnVd+Wq6xQuzZA1W55pdfNEg
Ir1nX3B/E1ixSwOf3I0J0YIZ9borJYtl5lQ0iRQfosjamRgf53532Ffjl7kKsf2b
R/Y8dRrS7FsYTU3+cVpj2oNjpMn9bO12yDoErMTbpRt5g4Fcc4+rvwSZRyZvY0Lm
CxA+hbqI6mzroRR8Oy17ja62h1Hl5K3YmlkwmcpDHvA28UMxMTZ6gRUOAW+l6TaT
UCVezpddSHae40CaTN6JadSVPFzafBkfmTGWUIqRrwKBgQD7MXIVWP1IVzQ7ABJX
mvMBZHdsrW6Yz9ojNVm+v8Hj/6hVuKYbQsNvRWgPEjydQ8o0Ko0EZb/jbyG6yQ7c
t7GJQfmx13ouRAgOQ8mSeryh7hKxgMDPF9Cvw0XRintgmYfvvwBrCNnI1ozCJzBL
bj9IuE+tgblMDL9YC/JWF2Hm8wKBgQC53OVvZfeH1aLwOWch+XUspsX3f9tSJHGj
WFNvPa+LOPIgvAPOBQg+18nvHloBB3yvSeqlt5ENI9WMYMnGy+yRF0UyCvy2SqIg
ALuROcCcR82qiaOu4grF1k6fQYFeuRBLfUdTFMrKqoN7RcDHW2fEfJ/2xIXREx1o
+tNPcS5NcwKBgQCy59ueMrxqyplLsFhgBt8uzbR1Ne0Ab4Go8/WQcxkQX2UwcIv1
/I4fcSqVGWMMi1y33NqFGEccIGnAlDS+pSKQZOoHbTX7P78REdy+NCanml28CLzK
gubCWG0gueX3vkHgUoRkt3ANqCmmmqy9/K6cB5HQPQWRkb6yYgfeo1a6WwKBgQCX
TDdE0IeIfqMt1DydDnmRCI2cpOr/WgVbh9obcuaEea24cfTS74u/xF9wlI+FyPd5
pb0qe1zLioEazetTNct0bLH6Q7FmHykMzivh01Z0oYrNKVAiW4WTeJn10Bgk6JdY
LDo0aneONPHlFmoQntrAuwZolZ+tC1dkjtIXGDYt+wKBgAr1dkOM7dcWPeusOoC4
erLW7jvMl6GIyF9VcYrntLEJjNad9R6N93ZW45Ytuql60m3KxhuMCClLSOZiYbvE
RW4vxjVGs5o7usod+okrhUUrRkbw8dgDHlKnzxmXx848hZ0339mwwVLpT5LB1ssv
+unneWabao7+hwGZoVgTWMhj
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANTE:** 
- Para `FIREBASE_PRIVATE_KEY`, copia TODA la clave incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Vercel automáticamente maneja los saltos de línea

---

### 5️⃣ Deploy

1. Haz clic en **"Deploy"**
2. Vercel construirá y desplegará automáticamente
3. En ~1 minuto tendrás tu URL pública: `https://the-drop-10k.vercel.app`

---

## 🎉 ¡LISTO!

Tu web estará online en una URL tipo:
```
https://the-drop-10k.vercel.app
```

---

## 🔄 Actualizar la web (después del primer deploy)

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel detecta automáticamente los cambios y redespliega. ¡No necesitas hacer nada más!

---

## 🔧 Troubleshooting

### Si el formulario no funciona:
1. Verifica que las 3 variables de Firebase estén configuradas correctamente
2. Revisa los logs en Vercel Dashboard → Tu proyecto → "Functions"
3. Asegúrate de copiar la `FIREBASE_PRIVATE_KEY` completa (con saltos de línea)

### Ver logs en tiempo real:
En Vercel Dashboard → Tu proyecto → "Deployments" → Click en el último → "Functions" → "Logs"

---

## 💰 Costos

- **100% GRATIS** sin tarjeta de crédito
- Deploy ilimitados
- 100 GB de ancho de banda/mes gratis
- Más que suficiente para tu landing page

---

## 🆚 Vercel vs Servidor tradicional

| Característica | Vercel | Servidor tradicional |
|---|---|---|
| Coste | GRATIS | Desde 5€/mes |
| Configuración | 5 minutos | 30+ minutos |
| Auto-deploy | ✅ Automático desde Git | ❌ Manual |
| CDN global | ✅ Incluido | ❌ Hay que configurar |
| SSL/HTTPS | ✅ Automático | ❌ Hay que instalar |
