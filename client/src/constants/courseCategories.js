// ─── Unified Course Categories ─────────────────────────────────────────────
// هذا هو المصدر الوحيد لجميع التصنيفات في المنصة.
// لإضافة تصنيف جديد، أضفه هنا فقط — وسيظهر تلقائياً في كل مكان.
// ─────────────────────────────────────────────────────────────────────────────

export const COURSE_CATEGORIES = [
  { key: 'quran',        label: 'القرآن الكريم' },
  { key: 'memorization', label: 'الحفظ'          },
  { key: 'tajweed',      label: 'التجويد'        },
  { key: 'recitation',   label: 'التلاوة'        },
  { key: 'ijazah',       label: 'الإجازة'        },
  { key: 'correction',   label: 'التصحيح'        },
  { key: 'arabic',       label: 'العربية'        },
  { key: 'sharia',       label: 'العلوم الشرعية' },
]

/**
 * Quick Arabic-label lookup.
 * Example: CAT_AR['tajweed'] → 'التجويد'
 */
export const CAT_AR = Object.fromEntries(
  COURSE_CATEGORIES.map(c => [c.key, c.label])
)

/**
 * Backward-compatible helper.
 * Returns the categories array for a course document,
 * falling back to [category] for legacy documents that only have the old field.
 *
 * @param {object} course - Mongoose course document or plain object
 * @returns {string[]} array of category keys (never undefined/null)
 */
export function getCourseCategories(course) {
  if (!course) return []
  if (Array.isArray(course.categories) && course.categories.length > 0) {
    return course.categories
  }
  // Legacy fallback: old documents have only `category: String`
  if (course.category) return [course.category]
  return []
}

/**
 * Returns the display label for a category key.
 * Falls back to the raw key if unknown.
 *
 * @param {string} key - category key, e.g. 'tajweed'
 * @returns {string} Arabic label
 */
export function getCategoryLabel(key) {
  return CAT_AR[key] || key || ''
}

/**
 * Returns the display label for the primary (first) category of a course.
 *
 * @param {object} course - course document
 * @returns {string} Arabic label of the first category
 */
export function getPrimaryLabel(course) {
  const cats = getCourseCategories(course)
  return cats.length > 0 ? getCategoryLabel(cats[0]) : ''
}
