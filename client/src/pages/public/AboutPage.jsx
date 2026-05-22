import { motion } from 'framer-motion'
import PublicLayout from '../../components/layout/PublicLayout'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Star, Globe } from 'lucide-react'

const G = '#dfab70'

export default function AboutPage() {
  return (
    <PublicLayout>
      <div dir="rtl"> 
        {/* Hero */}
<section className="relative min-h-[100vh] flex items-center overflow-hidden">         {/* Background Image */}
<div className="absolute inset-0">
  <img
    // src="./image/back-teacher.png"
    src="./image/about-1.png"
    alt="About Qurani Online"
    className="w-full h-full object-cover object-center"
  />

  {/* Dark Overlay */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        linear-gradient(
          to bottom,
          rgba(2,6,18,0.72),
          rgba(2,6,18,0.88)
        )
      `,
    }}
  />

  {/* Luxury Glow */}
  <div
    className="absolute inset-0"
    style={{
      background:
        'radial-gradient(circle at center, rgba(223,171,112,0.12) 0%, transparent 70%)',
      mixBlendMode: 'screen',
    }}
  />
</div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs"
                style={{background:'rgba(223,171,112,0.1)', border:'1px solid rgba(223,171,112,0.2)', color:G}}>
                ✦ في رحاب أكاديمية قرآني أونلاين
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-5">
                حيث يلتقي <span style={{color:G}}>العلمُ بجلال القرآن</span>
              </h1>
              <p className="text-lg max-w-2xl mx-auto leading-loose" style={{color:'#7a9bbf'}}>
                مؤسسةٌ قرآنيةٌ راسخةٌ تُعلي قيمةَ الإتقان، وتنهض برسالة التعليم القرآني على أُسسٍ علميةٍ رصينة،
                بإشراف نخبةٍ من العلماء المُجازين الذين يحملون هذا العلمَ بأمانةٍ وإحسان.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16" dir="rtl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
               {icon:Users,  value:'5,000+', label:'متعلّمٌ من شتّى أصقاع المعمورة'},
{icon:BookOpen, value:'50+',   label:'برنامجٌ قرآنيٌّ متخصص'},
{icon:Star,   value:'98%',      label:'من المتعلّمين أتمّوا مساراتهم بتميّز'},
{icon:Globe,  value:'40+',      label:'دولةٌ تضمّ طلابَ الأكاديمية'},
  ].map((s,i) => (
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.1}} viewport={{once:true}}
                  className="glass-card p-6 text-center">
                  <s.icon className="w-8 h-8 mx-auto mb-3" style={{color:G}} />
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-sm" style={{color:'#5e779a'}}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
       <section className="py-16" dir="rtl">
  <div className="container mx-auto px-4 max-w-6xl">
    <div className="glass-card p-10 md:p-14">

      {/* Header */}
      <div className="text-center mb-14">

        <div
          className="inline-block text-xs font-bold tracking-widest mb-4 px-5 py-2 rounded-full"
          style={{
            color: G,
            background: 'rgba(223,171,112,0.08)',
            border: '1px solid rgba(223,171,112,0.15)'
          }}
        >
          ✦ رؤيتنا ورسالتنا وقيمنا
        </div>

        <h2
          className="font-black text-white mb-5"
          style={{
            fontSize: 'clamp(30px,4vw,48px)',
            lineHeight: 1.45,
            fontFamily: "'Cairo', sans-serif"
          }}
        >
          جيلٌ أخلاقُه القُرآن
        </h2>

        <p
          className="leading-loose max-w-3xl mx-auto"
          style={{
            color: '#7a9bbf',
            fontSize: '0.98rem'
          }}
        >
          نؤمن أن القرآن الكريم ليس حفظًا فحسب، بل منهجُ حياةٍ يُزكّي
          الأرواح، ويُهذّب السلوك، ويصنع الإنسان على نور الوحي.
        </p>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-7">

        {/* الرؤية */}
        <div
          className="rounded-3xl p-7"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(223,171,112,0.12)'
          }}
        >
          <div
            className="inline-block mb-5 text-xs font-bold tracking-widest px-4 py-2 rounded-full"
            style={{
              color: G,
              background: 'rgba(223,171,112,0.08)',
              border: '1px solid rgba(223,171,112,0.15)'
            }}
          >
            ✦ الرؤية
          </div>

          <h3
            className="text-white font-black mb-5"
            style={{
              fontSize: '1.35rem',
              lineHeight: 1.9
            }}
          >
            أن ينشأ جيلٌ
            <br />
            أخلاقُه القُرآن
          </h3>

          <div
            className="rounded-2xl p-5 mb-5"
            style={{
              background: 'rgba(223,171,112,0.05)',
              border: '1px solid rgba(223,171,112,0.1)'
            }}
          >
            <div
              className="mb-3"
              style={{
                color: G,
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              القُرآن 《 علمٌ وعمل 》
            </div>

            <p
              className="leading-loose"
              style={{
                color: '#d7e3f1',
                fontSize: '0.92rem'
              }}
            >
              فعن عثمان بن عفان وعبدالله بن مسعود وأُبيّ بن كعب
              رضي الله عنهم :
            </p>

            <p
              className="leading-loose mt-3"
              style={{
                color: 'rgba(255,255,255,0.68)',
                fontSize: '0.9rem'
              }}
            >
              « أن رسول الله ﷺ كان يُقرِئُهم العشر،
              فلا يُجاوزونها إلى عشرٍ أخرى حتى يتعلّموا
              ما فيها من العمل ، فيعلّمنا القرآن والعمل جميعًا »
            </p>
          </div>
        </div>

        {/* الرسالة */}
        <div
          className="rounded-3xl p-7"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(223,171,112,0.12)'
          }}
        >
          <div
            className="inline-block mb-5 text-xs font-bold tracking-widest px-4 py-2 rounded-full"
            style={{
              color: G,
              background: 'rgba(223,171,112,0.08)',
              border: '1px solid rgba(223,171,112,0.15)'
            }}
          >
            ✦ الرسالة
          </div>

          <div
            className="text-center mb-6"
            style={{
              fontFamily: "'Amiri', serif",
              lineHeight: 2.1,
              color: G,
              fontSize: '1.08rem'
            }}
          >
            ﴿ وَإِنَّهُ لَكِتَابٌ عَزِيزٌ ﴾
            <br />
            ﴿ يَا يَحْيَىٰ خُذِ الْكِتَابَ بِقُوَّةٍ ﴾
          </div>

          <p
            className="leading-loose mb-5"
            style={{
              color: '#d7e3f1',
              fontSize: '0.92rem'
            }}
          >
            تحفيظ المسلم القُرآن بأساليب عمليّة تجعل بينه
            وبين كتابِ الله علاقةً روحيّةً بمبدأ
            <span style={{ color: G }}>
              {' '}《 أدومه وإن قل 》{' '}
            </span>
            على أن يحب كتاب الله ويرتبط بوِرده ولا يُجاوز
            الآية حتى يفهمها ويعمل بها بل ويُحبها.
          </p>

          <p
            className="leading-loose mb-5"
            style={{
              color: 'rgba(255,255,255,0.68)',
              fontSize: '0.9rem'
            }}
          >
            وتشربه للعلوم التي تخدم كتاب الله ودينه
            من علومٍ عربية ودروسٍ إسلامية.
          </p>

          <p
            className="leading-loose"
            style={{
              color: 'rgba(255,255,255,0.68)',
              fontSize: '0.9rem'
            }}
          >
            بخطّة سنويّة تُحدّد بعد الحلقات التجريبية
            وتحديد المُستوى مع المُعلّم الأمثل لفئته العُمريّة
            وتفضيلاته الشخصيّة، مع متابعة دورية للتقدم
            واختبارات دوريّة.
          </p>
        </div>

        {/* القيم */}
        <div
          className="rounded-3xl p-7"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(223,171,112,0.12)'
          }}
        >
          <div
            className="inline-block mb-5 text-xs font-bold tracking-widest px-4 py-2 rounded-full"
            style={{
              color: G,
              background: 'rgba(223,171,112,0.08)',
              border: '1px solid rgba(223,171,112,0.15)'
            }}
          >
            ✦ القيم
          </div>

          {/* الشعر */}
          <div
            className="text-center mb-8"
            style={{
              fontFamily: "'Amiri', serif",
              lineHeight: 2.3,
              fontSize: '1.12rem',
              color: '#fff'
            }}
          >
            <div>وَإِنَّ كِتَابَ اللهِ أَوْثَقُ شَافِعٍ</div>

            <div style={{ color: G }}>
              وَأَغْنَى غِنَاءً وَاهِبًا مُتَفَضِّلَا
            </div>

            <div className="mt-4">
              وَخَيْرُ جَلِيسٍ لَا يُمَلُّ حَدِيثُهُ
            </div>

            <div style={{ color: G }}>
              وَتَرْدَادُهُ يَزْدَادُ فِيهِ تَجَمُّلَا
            </div>
          </div>

          {/* values */}
          <div className="space-y-5">

            {[
              {
                title: 'الأمانة والمصداقيّة',
                body: 'ستجدُ حرصًا على قُرآنِك.'
              },
              {
                title: 'الصبر والرّفق',
                body: 'إنّ المُعلم الرفيق الصاحب لهو خيرٌ لك من الموجّه الشديد، فالصاحب سيرحم أخطاءك ويُقيل عثراتك.'
              },
              {
                title: 'التحفيز',
                body: 'لأنّ النفسَ تمل إذا ألِفت وفقدت الدافع، ستجدُ حوافزًا متعددة في الوقت المناسب دومًا.'
              },
              {
                title: 'التيسير وسهولة التحصيل',
                body: 'لأنّ كثيرًا من الناس يصعب عليهم الحضور المباشر، فالأونلاين يوفّر الجهد والوقت.'
              },
              {
                title: 'المنهج التربويّ',
                body: 'لأنّه منهجٌ تحفظهُ عقولنا وقلوبنا وتحيا به نفوسنا.'
              },
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-4">

                <span
                  className="flex-shrink-0 mt-1"
                  style={{
                    color: G,
                    fontSize: '1rem'
                  }}
                >
                  ◆
                </span>

                <div>
                  <div
                    className="font-bold text-white mb-1"
                    style={{
                      fontSize: '0.92rem'
                    }}
                  >
                    {v.title}
                  </div>

                  <div
                    className="leading-relaxed"
                    style={{
                      color: '#7a9bbf',
                      fontSize: '0.84rem'
                    }}
                  >
                    {v.body}
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  </div>
</section>

        {/* Values ribbon */}
        <section className="py-12" dir="rtl">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-black text-white">قيمنا التي نبني عليها</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { value: 'الإتقان',    desc: 'لا نرضى بأقلّ من الإجادة' },
                  { value: 'الأمانة',   desc: 'نؤدّي العلم كما تُلُقِّي' },
                  { value: 'الإحسان',   desc: 'نُعلّم بقلبٍ ورحمة' },
                  { value: 'الأثر',     desc: 'نقيس بما يبقى لا بما يُقال' },
                ].map((v,i) => (
                  <motion.div key={i} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} transition={{delay:i*.08}} viewport={{once:true}}>
                    <div className="text-2xl font-black mb-1" style={{color:G}}>{v.value}</div>
                    <div className="text-xs leading-relaxed" style={{color:'#5e779a'}}>{v.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center" dir="rtl">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="text-sm font-semibold mb-3" style={{color:'rgba(223,171,112,0.55)', letterSpacing:'2px'}}>
              ✦ ابدأ اليوم
            </div>
            <h2 className="text-2xl font-black text-white mb-3">
              رحلةٌ إلى إتقان التلاوة بإحسان
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{color:'#5e779a', fontSize:'0.9rem', lineHeight:'1.9'}}>
              انضمّ إلى آلاف المتعلّمين الذين وجدوا في أكاديمية قرآني أونلاين بيئةً علميةً تستحق الانتماء إليها.
            </p>
            <Link to="/courses" className="btn-gold inline-block">
              انطلق في مسيرتك القرآنية
            </Link>
          </motion.div>
        </section>
      </div>
    </PublicLayout>
  )
}