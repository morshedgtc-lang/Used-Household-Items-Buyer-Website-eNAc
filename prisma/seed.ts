import { PrismaClient, ContentStatus, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: "Site Admin" },
    create: { email, passwordHash, name: "Site Admin" },
  });

  await prisma.setting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyNameAr: "مشتري الأثاث المستعمل",
      companyNameEn: "We Buy Used Furniture",
      phone: "+966500000000",
      whatsapp: "966500000000",
      email: "info@example.com",
      addressAr: "تبوك، المملكة العربية السعودية",
      addressEn: "Tabuk, Saudi Arabia",
      googleMapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.0!2d36.57!3d28.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjguMzg!5e0!3m2!1sen!2ssa!4v1",
      businessHours: {
        ar: "السبت - الخميس: 9 ص - 9 م",
        en: "Sat - Thu: 9 AM - 9 PM",
      },
    },
  });

  const pageContents: { pageKey: string; data: Prisma.InputJsonValue }[] = [
    {
      pageKey: "home_hero",
      data: {
        titleAr: "نشتري الأثاث والأجهزة المستعملة نقداً",
        titleEn: "We buy used furniture & appliances for cash",
        subtitleAr: "تقييم عادل، استلام مجاني، ودفع فوري في تبوك والمناطق المجاورة.",
        subtitleEn: "Fair valuation, free pickup, and instant cash in Tabuk and nearby areas.",
        image: "/images/hero.svg",
        ctaAr: "بع أغراضك الآن",
        ctaEn: "Sell your items now",
      },
    },
    {
      pageKey: "about",
      data: {
        storyAr:
          "نحن فريق متخصص في شراء الأثاث المنزلي والأجهزة المستعملة بأسعار عادلة وخدمة سريعة.",
        storyEn:
          "We specialize in buying used household furniture and appliances at fair prices with fast service.",
        missionAr: "تسهيل بيع المستعمل بثقة وشفافية.",
        missionEn: "Make selling used items simple, trusted, and transparent.",
        visionAr: "أن نكون الخيار الأول لبيع المستعمل في المنطقة.",
        visionEn: "To be the first choice for selling used items in the region.",
        experienceAr: "سنوات من الخبرة في التقييم والاستلام الفوري.",
        experienceEn: "Years of experience in valuation and same-day pickup.",
        areasAr: "تبوك وضواحيها والمناطق المجاورة حسب التوفر.",
        areasEn: "Tabuk, suburbs, and nearby areas based on availability.",
      },
    },
    {
      pageKey: "how_it_works",
      data: {
        introAr: "خمس خطوات بسيطة لبيع أغراضك المستعملة.",
        introEn: "Five simple steps to sell your used items.",
      },
    },
    {
      pageKey: "why_us",
      data: {
        points: [
          { icon: "truck", titleAr: "استلام مجاني", titleEn: "Free pickup" },
          { icon: "banknote", titleAr: "دفع نقدي فوري", titleEn: "Instant cash" },
          { icon: "message-circle", titleAr: "رد سريع", titleEn: "Fast reply" },
          { icon: "shield-check", titleAr: "تقييم عادل", titleEn: "Fair valuation" },
        ],
      },
    },
    {
      pageKey: "cta",
      data: {
        titleAr: "جاهز للبيع؟ تواصل معنا الآن",
        titleEn: "Ready to sell? Contact us now",
        subtitleAr: "أرسل صوراً عبر واتساب واحصل على عرض سعر خلال دقائق.",
        subtitleEn: "Send photos on WhatsApp and get a quote in minutes.",
      },
    },
    {
      pageKey: "privacy",
      data: {
        bodyAr:
          "نحترم خصوصيتك. نستخدم بيانات التواصل فقط للرد على استفساراتك وتقديم خدمة الشراء والاستلام.",
        bodyEn:
          "We respect your privacy. Contact details are used only to respond to inquiries and provide buying/pickup service.",
      },
    },
    {
      pageKey: "terms",
      data: {
        bodyAr:
          "الموقع للتعريف بخدمة شراء المستعمل فقط. الأسعار تقديرية وتُؤكد بعد المعاينة. لا يوجد بيع إلكتروني أو سلة مشتريات.",
        bodyEn:
          "This website only promotes our used-item buying service. Prices are estimates confirmed after inspection. There is no online checkout.",
      },
    },
  ];

  for (const page of pageContents) {
    await prisma.pageContent.upsert({
      where: { pageKey: page.pageKey },
      update: { data: page.data },
      create: { pageKey: page.pageKey, data: page.data },
    });
  }

  const seoPages = [
    {
      pageKey: "home",
      metaTitleAr: "مشتري الأثاث المستعمل | نشتري نقداً",
      metaTitleEn: "We Buy Used Furniture | Cash Buyers",
      metaDescriptionAr: "نشتري الأثاث والأجهزة المستعملة مع استلام مجاني ودفع فوري.",
      metaDescriptionEn: "We buy used furniture and appliances with free pickup and instant cash.",
      keywords: "شراء اثاث مستعمل, تبوك, used furniture buyer",
    },
    {
      pageKey: "categories",
      metaTitleAr: "التصنيفات | مشتري الأثاث المستعمل",
      metaTitleEn: "Categories | We Buy Used Furniture",
      metaDescriptionAr: "تصفح أنواع الأغراض التي نشتريها.",
      metaDescriptionEn: "Browse the types of items we buy.",
      keywords: "categories, used items",
    },
    {
      pageKey: "contact",
      metaTitleAr: "تواصل معنا",
      metaTitleEn: "Contact Us",
      metaDescriptionAr: "اتصل أو راسلنا عبر واتساب لبيع أغراضك المستعملة.",
      metaDescriptionEn: "Call or WhatsApp us to sell your used items.",
      keywords: "contact, whatsapp",
    },
  ];

  for (const seo of seoPages) {
    await prisma.seoSetting.upsert({
      where: { pageKey: seo.pageKey },
      update: seo,
      create: seo,
    });
  }

  const seeded = (await prisma.category.count()) > 0;

  if (!seeded) {
    const cities = [
      { nameAr: "تبوك", nameEn: "Tabuk", sortOrder: 1 },
      { nameAr: "ضباء", nameEn: "Duba", sortOrder: 2 },
      { nameAr: "حقل", nameEn: "Haql", sortOrder: 3 },
      { nameAr: "تيماء", nameEn: "Tayma", sortOrder: 4 },
      { nameAr: "الوجه", nameEn: "Al Wajh", sortOrder: 5 },
    ];

    for (const city of cities) {
      await prisma.city.create({
        data: { ...city, status: ContentStatus.PUBLISHED },
      });
    }

    const faqs = [
      {
        questionAr: "هل توفرون خدمة الاستلام؟",
        questionEn: "Do you provide pickup?",
        answerAr: "نعم، نوفر استلاماً مجانياً حسب المنطقة وتوفر الفريق.",
        answerEn: "Yes, we offer free pickup depending on area and team availability.",
        sortOrder: 1,
      },
      {
        questionAr: "هل الدفع نقدي؟",
        questionEn: "Do you pay cash?",
        answerAr: "نعم، الدفع نقدي فوري عند الاستلام بعد الاتفاق.",
        answerEn: "Yes, we pay cash on the spot after agreement at pickup.",
        sortOrder: 2,
      },
      {
        questionAr: "ما سرعة الرد؟",
        questionEn: "How quickly do you respond?",
        answerAr: "عادةً نرد عبر واتساب خلال دقائق في ساعات العمل.",
        answerEn: "We usually reply on WhatsApp within minutes during business hours.",
        sortOrder: 3,
      },
      {
        questionAr: "ما المدن التي تغطونها؟",
        questionEn: "Which cities do you cover?",
        answerAr: "تبوك والمناطق المجاورة. تواصل معنا للتأكد من التغطية.",
        answerEn: "Tabuk and nearby areas. Contact us to confirm coverage.",
        sortOrder: 4,
      },
    ];

    for (const faq of faqs) {
      await prisma.faq.create({
        data: { ...faq, status: ContentStatus.PUBLISHED },
      });
    }

    await prisma.testimonial.createMany({
      data: [
        {
          name: "أحمد العتيبي",
          rating: 5,
          messageAr: "تقييم عادل واستلام سريع والدفع فوري. أنصح بالتعامل معهم.",
          messageEn: "Fair price, fast pickup, and instant payment. Highly recommended.",
          status: ContentStatus.PUBLISHED,
          sortOrder: 1,
        },
        {
          name: "نورة الشمري",
          rating: 5,
          messageAr: "بعت غرفة نوم كاملة بسهولة عبر واتساب.",
          messageEn: "Sold a full bedroom set easily through WhatsApp.",
          status: ContentStatus.PUBLISHED,
          sortOrder: 2,
        },
        {
          name: "خالد",
          rating: 4,
          messageAr: "خدمة محترمة وتواصل واضح من البداية.",
          messageEn: "Professional service and clear communication from the start.",
          status: ContentStatus.PUBLISHED,
          sortOrder: 3,
        },
      ],
    });

    const categoryDefs = [
      {
        nameAr: "غرف المعيشة",
        nameEn: "Living Room",
        slug: "living-room",
        icon: "sofa",
        descriptionAr: "كنب، طاولات، ومجالس مستعملة.",
        descriptionEn: "Used sofas, tables, and living sets.",
        sortOrder: 1,
        items: [
          {
            titleAr: "كنب مستعمل",
            titleEn: "Used Sofa",
            slug: "used-sofa",
            descriptionAr: "نشتري الكنب والمجالس بجميع الأحجام والحالات الجيدة.",
            descriptionEn: "We buy sofas and majlis sets in all sizes and good condition.",
            benefitsAr: "تقييم فوري\nاستلام من المنزل\nدفع نقدي",
            benefitsEn: "Instant valuation\nHome pickup\nCash payment",
            pickupInfoAr: "الاستلام مجاني داخل نطاق الخدمة بعد الاتفاق.",
            pickupInfoEn: "Free pickup within our service area after agreement.",
            featured: true,
          },
          {
            titleAr: "طاولة قهوة",
            titleEn: "Coffee Table",
            slug: "coffee-table",
            descriptionAr: "نشتري طاولات القهوة والطاولات الجانبية المستعملة.",
            descriptionEn: "We buy used coffee tables and side tables.",
            featured: false,
          },
        ],
      },
      {
        nameAr: "غرف النوم",
        nameEn: "Bedroom",
        slug: "bedroom",
        icon: "bed",
        descriptionAr: "أسرّة، خزائن، ومراتب مستعملة.",
        descriptionEn: "Used beds, wardrobes, and mattresses.",
        sortOrder: 2,
        items: [
          {
            titleAr: "غرفة نوم مستعملة",
            titleEn: "Used Bedroom Set",
            slug: "used-bedroom-set",
            descriptionAr: "نشتري غرف النوم الكاملة أو القطع المنفصلة.",
            descriptionEn: "We buy full bedroom sets or individual pieces.",
            featured: true,
          },
          {
            titleAr: "خزانة ملابس",
            titleEn: "Wardrobe",
            slug: "wardrobe",
            descriptionAr: "نشتري الدواليب والخزائن بجميع المقاسات.",
            descriptionEn: "We buy wardrobes of all sizes.",
            featured: false,
          },
        ],
      },
      {
        nameAr: "المطبخ",
        nameEn: "Kitchen",
        slug: "kitchen",
        icon: "utensils",
        descriptionAr: "أجهزة مطبخ وأدوات مستعملة.",
        descriptionEn: "Used kitchen appliances and equipment.",
        sortOrder: 3,
        items: [
          {
            titleAr: "فرن مستعمل",
            titleEn: "Used Oven",
            slug: "used-oven",
            descriptionAr: "نشتري الأفران وأجهزة المطبخ بحالة جيدة.",
            descriptionEn: "We buy ovens and kitchen appliances in good working condition.",
            featured: true,
          },
        ],
      },
      {
        nameAr: "الإلكترونيات",
        nameEn: "Electronics",
        slug: "electronics",
        icon: "monitor",
        descriptionAr: "أجهزة إلكترونية وتلفزيونات.",
        descriptionEn: "Electronics and televisions.",
        sortOrder: 4,
        items: [
          {
            titleAr: "تلفزيون مستعمل",
            titleEn: "Used TV",
            slug: "used-tv",
            descriptionAr: "نشتري الشاشات والتلفزيونات بمختلف المقاسات.",
            descriptionEn: "We buy TVs and screens of various sizes.",
            featured: true,
          },
          {
            titleAr: "لابتوب مستعمل",
            titleEn: "Used Laptop",
            slug: "used-laptop",
            descriptionAr: "نشتري أجهزة اللابتوب والكمبيوتر المستعملة.",
            descriptionEn: "We buy used laptops and computers.",
            featured: false,
          },
        ],
      },
      {
        nameAr: "الأجهزة المنزلية",
        nameEn: "Home Appliances",
        slug: "home-appliances",
        icon: "washing-machine",
        descriptionAr: "ثلاجات، غسالات، ومكيفات.",
        descriptionEn: "Fridges, washers, and ACs.",
        sortOrder: 5,
        items: [
          {
            titleAr: "ثلاجة مستعملة",
            titleEn: "Used Refrigerator",
            slug: "used-refrigerator",
            descriptionAr: "نشتري الثلاجات المستعملة العاملة.",
            descriptionEn: "We buy working used refrigerators.",
            featured: true,
          },
          {
            titleAr: "غسالة مستعملة",
            titleEn: "Used Washing Machine",
            slug: "used-washing-machine",
            descriptionAr: "نشتري الغسالات الأوتوماتيك والعادية.",
            descriptionEn: "We buy automatic and regular washing machines.",
            featured: false,
          },
          {
            titleAr: "مكيف مستعمل",
            titleEn: "Used Air Conditioner",
            slug: "used-ac",
            descriptionAr: "نشتري المكيفات السبليت والشباك.",
            descriptionEn: "We buy split and window air conditioners.",
            featured: true,
          },
        ],
      },
      {
        nameAr: "المكاتب",
        nameEn: "Office",
        slug: "office",
        icon: "briefcase",
        descriptionAr: "مكاتب وكراسي وتجهيزات مكتبية.",
        descriptionEn: "Desks, chairs, and office furniture.",
        sortOrder: 6,
        items: [
          {
            titleAr: "مكتب مستعمل",
            titleEn: "Used Desk",
            slug: "used-desk",
            descriptionAr: "نشتري المكاتب والكراسي المكتبية.",
            descriptionEn: "We buy office desks and chairs.",
            featured: false,
          },
        ],
      },
    ];

    for (const cat of categoryDefs) {
      const { items, ...categoryData } = cat;
      const category = await prisma.category.create({
        data: {
          ...categoryData,
          status: ContentStatus.PUBLISHED,
          image: `/images/categories/${categoryData.slug}.svg`,
        },
      });

      for (const [index, item] of items.entries()) {
        const created = await prisma.item.create({
          data: {
            categoryId: category.id,
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            slug: item.slug,
            descriptionAr: item.descriptionAr,
            descriptionEn: item.descriptionEn,
            benefitsAr:
              item.benefitsAr ??
              "تقييم عادل\nاستلام من الموقع\nدفع نقدي",
            benefitsEn:
              item.benefitsEn ??
              "Fair valuation\nOn-site pickup\nCash payment",
            pickupInfoAr:
              item.pickupInfoAr ??
              "نحدد موعد الاستلام بعد الاتفاق على السعر.",
            pickupInfoEn:
              item.pickupInfoEn ??
              "We schedule pickup after agreeing on the price.",
            thumbnail: `/images/items/${item.slug}.svg`,
            featured: item.featured,
            status: ContentStatus.PUBLISHED,
            sortOrder: index + 1,
          },
        });

        await prisma.itemImage.createMany({
          data: [
            {
              itemId: created.id,
              url: `/images/items/${item.slug}.svg`,
              altAr: item.titleAr,
              altEn: item.titleEn,
              sortOrder: 0,
            },
            {
              itemId: created.id,
              url: `/images/items/${item.slug}-2.svg`,
              altAr: `${item.titleAr} - صورة إضافية`,
              altEn: `${item.titleEn} - extra photo`,
              sortOrder: 1,
            },
          ],
        });
      }
    }
  }

  console.info("Seed completed successfully.");
  console.info(`Admin login: ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
