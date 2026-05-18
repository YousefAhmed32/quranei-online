require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Inline models for seeder
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['student','teacher','admin'], default: 'student' },
  phone: String, country: String, selectedPackage: String,
  subscriptionStatus: { type: String, default: 'pending' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
  next();
});

const courseSchema = new mongoose.Schema({
  title: String, slug: String, shortDescription: String, description: String,
  thumbnail: String, heroVideo: String,
  category: { type: String, default: 'quran' },
  level: { type: String, default: 'beginner' },
  language: { type: String, default: 'العربية' },
  duration: String, lessonsCount: Number,
  teacherName: String,
  pricingType: { type: String, default: 'contact' },
  price: Number, currency: { type: String, default: 'ريال' },
  showPrice: { type: Boolean, default: false },
  whatsapp: String, ctaText: String,
  isPublished: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  priorityOrder: { type: Number, default: 0 },
  learningOutcomes: [String], targetStudents: [String], highlights: [String], tags: [String],
  enrolledCount: { type: Number, default: 0 },
}, { timestamps: true });

const teacherSchema = new mongoose.Schema({
  fullName: String, title: String, slug: String, gender: { type: String, default: 'male' },
  imageUrl: String, bio: String, shortBio: String,
  specialization: String, experience: String, languages: [String], nationality: String,
  rating: { type: Number, default: 5.0 }, studentsCount: { type: Number, default: 0 },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true }, featured: { type: Boolean, default: false },
  whatsapp: String,
  socialLinks: { youtube: String, instagram: String, twitter: String, facebook: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

const COURSES = [
  {
    title: 'التأسيس القرآني الشامل', slug: 'tajweed-foundation',
    shortDescription: 'برنامج متكامل للمبتدئين يبدأ من الصفر حتى الإتقان الكامل.',
    description: 'برنامج التأسيس القرآني هو الأساس الذي يحتاجه كل متعلم قبل الشروع في رحلة القرآن الكريم. نبدأ معك من الحروف الهجائية ومخارجها، مروراً بأحكام التجويد الأساسية، وصولاً إلى القراءة الصحيحة المتقنة.',
    category: 'tajweed', level: 'beginner', duration: 'شهران', lessonsCount: 24,
    teacherName: 'الشيخ أحمد العمري',
    pricingType: 'paid', price: 299, currency: 'ريال', showPrice: true,
    whatsapp: '201008148164', ctaText: 'اشترك الآن',
    isPublished: true, featured: true, priorityOrder: 1,
    learningOutcomes: ['إتقان نطق الحروف العربية', 'تعلم أحكام التجويد الأساسية', 'القراءة الصحيحة بلا أخطاء', 'فهم علامات الوقف والابتداء'],
    targetStudents: ['المبتدئون من الصفر', 'من يريد تصحيح القراءة', 'الأطفال والكبار'],
    highlights: ['جلسات فردية مع المعلم', 'مواد مرئية وصوتية', 'تقييم مستمر', 'شهادة إتمام'],
    tags: ['تجويد', 'مبتدئ', 'أساسيات'], enrolledCount: 1240,
    heroVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&auto=format',
  },
  {
    title: 'أحكام المد والقصر المتقدم', slug: 'madd-qasr-advanced',
    shortDescription: 'دراسة تفصيلية لأحكام المد والقصر بأنواعها وتطبيقاتها.',
    description: 'دورة متخصصة في أحكام المد والقصر تشمل جميع أنواع المدود الأصلية والفرعية، مع التطبيق العملي على الآيات القرآنية. للطلاب الذين لديهم أساس في التجويد.',
    category: 'tajweed', level: 'intermediate', duration: '6 أسابيع', lessonsCount: 18,
    teacherName: 'الشيخ يوسف الزيد',
    pricingType: 'paid', price: 249, currency: 'ريال', showPrice: true,
    whatsapp: '201008148164', ctaText: 'سجّل الآن',
    isPublished: true, featured: false, priorityOrder: 2,
    learningOutcomes: ['إتقان جميع أنواع المدود', 'التمييز بين المد الأصلي والفرعي', 'تطبيق القواعد على القرآن'],
    targetStudents: ['الطلاب ذوو الأساس في التجويد'],
    highlights: ['شرح تفصيلي', 'تمارين تطبيقية', 'اختبارات دورية'],
    tags: ['تجويد', 'متوسط', 'مد وقصر'], enrolledCount: 673,
    thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format',
  },
  {
    title: 'حفظ القرآن الكريم كاملاً', slug: 'quran-memorization-full',
    shortDescription: 'رحلة الحفظ الكاملة بمنهج متكامل ومتابعة يومية مستمرة.',
    description: 'برنامج الحفظ الكامل للقرآن الكريم المصمم خصيصاً للراغبين في ختم الحفظ. يعتمد على منهج علمي مُجرَّب يجمع بين الحفظ الجيد والمراجعة المستمرة.',
    category: 'memorization', level: 'all', duration: '٣-٥ سنوات', lessonsCount: 0,
    teacherName: 'الشيخ عمر الحسيني',
    pricingType: 'contact', showPrice: false,
    whatsapp: '201008148164', ctaText: 'تواصل للاستفسار',
    isPublished: true, featured: true, priorityOrder: 3,
    learningOutcomes: ['حفظ القرآن كاملاً', 'ضبط الحفظ بالتجويد', 'المراجعة المستمرة'],
    targetStudents: ['كل من أراد حفظ كلام الله'],
    highlights: ['متابعة يومية', 'خطة مخصصة لكل طالب', 'جلسات مراجعة'],
    tags: ['حفظ', 'قرآن', 'شامل'], enrolledCount: 892,
    thumbnail: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format',
  },
  {
    title: 'الإجازة القرآنية بسند متصل', slug: 'quran-ijazah',
    shortDescription: 'احصل على إجازة معتمدة بسند متصل برواية حفص عن عاصم.',
    description: 'برنامج الإجازة القرآنية للمتقنين الراغبين في الحصول على إجازة معتمدة بسند متصل إلى رسول الله ﷺ. يشمل البرنامج إتقان رواية حفص عن عاصم من طريق الشاطبية.',
    category: 'ijazah', level: 'advanced', duration: 'حسب المستوى', lessonsCount: 0,
    teacherName: 'الشيخ محمد علي النجار',
    pricingType: 'contact', showPrice: false,
    whatsapp: '201008148164', ctaText: 'تقديم الطلب',
    isPublished: true, featured: true, priorityOrder: 4,
    learningOutcomes: ['إتقان رواية حفص', 'الحصول على إجازة معتمدة', 'اتصال السند'],
    targetStudents: ['حفظة القرآن الراغبين في الإجازة'],
    highlights: ['سند متصل موثق', 'إجازة مكتوبة', 'معلمون مُجازون'],
    tags: ['إجازة', 'متقدم', 'سند'], enrolledCount: 234,
    thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format',
  },
  {
    title: 'تلاوة القرآن بالمقامات', slug: 'quran-maqamat',
    shortDescription: 'تعلّم أصول التلاوة الجميلة بالمقامات الصوتية القرآنية.',
    description: 'دورة متخصصة في التلاوة بالمقامات الصوتية تشمل تعلم المقام البيات والصبا والحجاز وغيرها، مع التطبيق على الآيات القرآنية وتنمية الموهبة الصوتية.',
    category: 'recitation', level: 'intermediate', duration: '3 أشهر', lessonsCount: 20,
    teacherName: 'الشيخ إبراهيم الحسن',
    pricingType: 'paid', price: 350, currency: 'ريال', showPrice: true,
    whatsapp: '201008148164', ctaText: 'احجز مقعدك',
    isPublished: true, featured: false, priorityOrder: 5,
    learningOutcomes: ['معرفة أنواع المقامات', 'التلاوة بمقامات مختلفة', 'تحسين الصوت'],
    targetStudents: ['من لديه أساس في التلاوة', 'الأئمة والمؤذنون'],
    highlights: ['تسجيلات نموذجية', 'ملاحظات فردية', 'مسابقات داخلية'],
    tags: ['تلاوة', 'مقامات', 'متوسط'], enrolledCount: 445,
    thumbnail: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=600&auto=format',
  },
  {
    title: 'اللغة العربية للمسلمين', slug: 'arabic-for-muslims',
    shortDescription: 'تعلّم اللغة العربية لفهم القرآن الكريم والسنة النبوية.',
    description: 'برنامج اللغة العربية مصمم خصيصاً للمسلمين الراغبين في فهم القرآن والأحاديث النبوية مباشرةً. يبدأ من الأساسيات ويصل إلى مستوى القراءة والفهم.',
    category: 'arabic', level: 'beginner', duration: '4 أشهر', lessonsCount: 32,
    teacherName: 'الدكتور سليمان العلوي',
    pricingType: 'paid', price: 399, currency: 'ريال', showPrice: true,
    whatsapp: '201008148164', ctaText: 'ابدأ رحلتك',
    isPublished: true, featured: false, priorityOrder: 6,
    learningOutcomes: ['قراءة النصوص العربية', 'فهم مفردات القرآن', 'قواعد النحو الأساسية'],
    targetStudents: ['المسلمون غير الناطقين بالعربية', 'من يريد فهم القرآن'],
    highlights: ['منهج مبسط', 'ربط بالقرآن والحديث', 'تطبيقات عملية'],
    tags: ['عربية', 'مبتدئ', 'لغة'], enrolledCount: 1100,
    thumbnail: 'https://images.unsplash.com/photo-1527176930608-09cb256ab504?w=600&auto=format',
  },
]

const TEACHERS = [
  {
    fullName: 'الشيخ أحمد محمد العمري', title: 'أستاذ التجويد والقراءات', slug: 'sheikh-ahmed-omari',
    gender: 'male', nationality: 'سعودي', specialization: 'التجويد والقراءات العشر',
    experience: '15 سنة', languages: ['العربية', 'الإنجليزية'],
    shortBio: 'معلم تجويد مُجاز بسند متصل بأكثر من 15 عاماً خبرة.',
    bio: 'الشيخ أحمد العمري أحد أبرز معلمي التجويد في العالم العربي، حاصل على إجازة متصلة السند في القراءات العشر. أسس أكثر من 50 معلماً قرآنياً معتمداً.',
    rating: 4.9, studentsCount: 3200, displayOrder: 1, active: true, featured: true,
    whatsapp: '966500000001',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&crop=face',
  },
  {
    fullName: 'الشيخ يوسف إبراهيم الزيد', title: 'أستاذ أحكام التجويد', slug: 'sheikh-yusuf-zaid',
    gender: 'male', nationality: 'كويتي', specialization: 'أحكام التجويد والمد والقصر',
    experience: '12 سنة', languages: ['العربية', 'الفرنسية'],
    shortBio: 'متخصص في أحكام التجويد والمد والقصر بأسلوب مبسط وواضح.',
    bio: 'الشيخ يوسف درس على يد كبار علماء التجويد في الكويت والمدينة المنورة. يتميز بأسلوبه الفريد في تبسيط الأحكام التجويدية للمبتدئين والمتقدمين.',
    rating: 4.8, studentsCount: 2100, displayOrder: 2, active: true, featured: true,
    whatsapp: '966500000002',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&crop=face',
  },
  {
    fullName: 'الشيخ عمر عبدالله الحسيني', title: 'حافظ القرآن الكريم', slug: 'sheikh-omar-hussaini',
    gender: 'male', nationality: 'سعودي', specialization: 'الحفظ والمراجعة',
    experience: '20 سنة', languages: ['العربية', 'الأردية'],
    shortBio: 'خبير في منهج الحفظ السريع مع الإتقان والضبط التجويدي.',
    bio: 'الشيخ عمر حفظ القرآن في سن مبكرة وتلقى الإجازة عن أكثر من شيخ. قدّم برنامجه المبتكر لحفظ القرآن لأكثر من 5000 طالب.',
    rating: 5.0, studentsCount: 5100, displayOrder: 3, active: true, featured: false,
    whatsapp: '966500000003',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&crop=face',
  },
  {
    fullName: 'الأستاذة فاطمة عبدالرحمن الأحمدي', title: 'معلمة قرآن للنساء', slug: 'ustadha-fatima-ahmadi',
    gender: 'female', nationality: 'سعودية', specialization: 'التجويد والحفظ للنساء والأطفال',
    experience: '13 سنة', languages: ['العربية', 'الإنجليزية'],
    shortBio: 'معلمة مُجازة متخصصة في تعليم النساء والأطفال في بيئة آمنة.',
    bio: 'الأستاذة فاطمة من أبرز معلمات القرآن في المملكة، متخصصة في بيئة تعليمية نسائية راقية. أتقنت القرآن على يد أمهات المقرئات.',
    rating: 4.9, studentsCount: 2800, displayOrder: 4, active: true, featured: true,
    whatsapp: '966500000004',
    imageUrl: '',
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qurani')
    console.log('✅ Connected to MongoDB')

    // Clear
    await User.deleteMany({})
    await Course.deleteMany({})
    await Teacher.deleteMany({})
    console.log('🧹 Cleared existing data')

    // Admin
    const admin = new User({ name: 'مدير قرآني', email: 'admin@qurani.com', password: 'Admin@123', role: 'admin', country: 'SA', isActive: true })
    await admin.save()
    console.log('👑 Admin created')

    // Students
    for (let i = 1; i <= 5; i++) {
      const s = new User({ name: `طالب تجريبي ${i}`, email: `student${i}@qurani.com`, password: 'Student@123', role: 'student', country: 'EG' })
      await s.save()
    }
    console.log('🎓 Students created')

    // Courses
    const created = await Course.insertMany(COURSES)
    console.log(`📚 ${created.length} courses seeded`)

    // Teachers
    const teachers = await Teacher.insertMany(TEACHERS)
    console.log(`👨‍🏫 ${teachers.length} teachers seeded`)

    console.log('\n✨ Seed complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Admin:   admin@qurani.com / Admin@123')
    console.log('Student: student1@qurani.com / Student@123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed()
