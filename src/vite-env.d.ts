/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMAP_API_KEY: string
  readonly VITE_AMAP_SECURITY_JS_CODE: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // 更多环境变量可以在这里添加...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}