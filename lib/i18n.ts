;/>

• At the very bottom of the file, **add** the following line:

\`\`\`ts
// Re-export the hook so consumers can simply import from "@/lib/i18n"
export { useLanguage } from "@/components/language-provider"
