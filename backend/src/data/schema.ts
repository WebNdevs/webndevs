// SEO SCHEMA
export const SeoSchema = {
    title: "",
    description: "",
    keywords: [],
    image: "",
    path: "",
};

// HERO SCHEMA
export const HeroSchema = {
    tag: "",
    title1: "",
    title2: "",
    description: "",
};

// HEADER SCHEMA
export const HeaderSchema = {
    tag: "",
    subheading1: "",
    subheading2: "",
    subtext: "",
};

// CTA SCHEMA
export const CtaSchema = {
    preview: {
        text: "",
        url: "",
    },
    full: {
        text: "",
        description: "",
        url: "",
    }
};

export const Schemas: Record<string, Record<string, any>> = {
    hero: {
        ...HeroSchema,
    },
    header: {
        ...HeaderSchema,
    },
    whyus: {
        ...HeaderSchema,
        items: [],
    },
    process: {
        ...HeaderSchema,
        items: [],
        ...CtaSchema,
    },
    comparison: {
        ...HeaderSchema,
        items: [],
    },
    result: {
        ...HeaderSchema,
        items: [],
        ...CtaSchema,
    },
    review: {
        ...HeaderSchema,
        items: [],
        ...CtaSchema,
    },
    stats: {
        ...HeaderSchema,
        items: [],
    },
    faq: {
        ...HeaderSchema,
        items: [],
    },
    data: {
        ...HeaderSchema,
        items: [],
    },
    directory: {
        ...HeaderSchema,
        items: [],   
    },
    benefits: {
        ...HeaderSchema,
        items: [],
    },
    featured: {
        ...HeaderSchema,
        items: [],
    },
    overview: {
        ...HeaderSchema,
        items: [],
    },
    techspec: {
        techtag: "",
        techHeading1: "",
        techHeading2: "",
        tags: [],
    },
    usecase: {
        ...HeaderSchema,
        items: [],
    },
    content: {
        ...HeaderSchema,
        items: [],
    },
    cta: {
        ...CtaSchema,
    },
    seo: {
        ...SeoSchema,
    }
};

export const ItemSchemas: Record<string, Record<string, any>> = {
    whyus: {
        icon: "",
        title: "",
        description: "",
        url: "",
        tags: [],
    },
    process: {
        icon: "",
        title: "",
        description: "",
        duration: "",
        number: "",
    },
    comparison: {
        title: "",
        description: "",
        tag: "",
        leftHeading: "",
        rightHeading: "",
        leftPoints: [],
        rightPoints: [],
    },
    result: {
        title: "",
        category: "",
        description: "",
        results: [],
        tags: [],
        badge: "",
        url: "",
    },
    review: {
        name: "",
        company: "",
        content: "",
        photo_url: "",
        role: "",
    },
    stats: {
        icon: "",
        title: "",
        value: "",
    },
    faq: {
        question: "",
        answer: "",
    },
    data: {
        title: "",
        tag: "",
        description: "",
    },
    directory: {
        icon: "",
        title: "",
        description: "",
        tags: [],
        badge: "",
        href: "",
        is_featured: false,
    },
    benefits: {
        icon: "",
        title: "",
        description: "",
        tags: [],
        badge: "",
        href: "",
        is_featured: false,
    },
    featured: {
        icon: "",
        title: "",
        description: "",
        tags: [],
        badge: "",
        href: "",
        is_featured: false,
    },
    overview: {
        title: "",
        description: "",
    },
    usecase: {
        title: "",
        description: "",
        icon: "",
    },
    content: {
        title: "",
        excerpt: "",
        content: "",
        date: "",
        author: "",
        slug: "",
        image: "",
        tags: [],
        featured: false,
    }
};

/**
 * Generic Deep Merge utility.
 * Recursively merges source properties into a deep clone of target.
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: any): T {
    const result: Record<string, any> = typeof structuredClone === 'function'
        ? structuredClone(target)
        : JSON.parse(JSON.stringify(target));

    if (!source || typeof source !== 'object' || Array.isArray(source)) {
        return result as T;
    }

    for (const key of Object.keys(source)) {
        const sourceVal = source[key];
        if (sourceVal === undefined) continue;

        const targetVal = result[key];

        if (
            targetVal !== null &&
            typeof targetVal === 'object' &&
            !Array.isArray(targetVal) &&
            sourceVal !== null &&
            typeof sourceVal === 'object' &&
            !Array.isArray(sourceVal)
        ) {
            result[key] = deepMerge(targetVal, sourceVal);
        } else {
            result[key] = sourceVal;
        }
    }

    return result as T;
}

/**
 * Returns a deep-cloned default section schema object for the given sectionKey.
 */
export function getSectionSchema(sectionKey: string): Record<string, any> {
    const baseSchema = (Schemas as Record<string, any>)[sectionKey] || HeaderSchema;
    return typeof structuredClone === 'function'
        ? structuredClone(baseSchema)
        : JSON.parse(JSON.stringify(baseSchema));
}

/**
 * Returns a deep-cloned default item schema object for the given sectionKey.
 */
export function getItemSchema(sectionKey: string): Record<string, any> {
    const baseItemSchema = (ItemSchemas as Record<string, any>)[sectionKey] || { title: "", description: "" };
    return typeof structuredClone === 'function'
        ? structuredClone(baseItemSchema)
        : JSON.parse(JSON.stringify(baseItemSchema));
}

/**
 * Merges raw section data from API/state with the section schema defaults.
 * Automatically deep merges section fields and individual items in items array.
 */
export function mergeSectionData(sectionKey: string, data?: any): Record<string, any> {
    const defaultSchema = getSectionSchema(sectionKey);
    if (!data || typeof data !== 'object') return defaultSchema;

    const merged = deepMerge(defaultSchema, data);

    if (Array.isArray(data.items)) {
        merged.items = data.items.map((item: any) => mergeItemData(sectionKey, item));
    }

    return merged;
}

/**
 * Merges raw item data with item schema defaults for the section.
 */
export function mergeItemData(sectionKey: string, item?: any): Record<string, any> {
    const defaultItemSchema = getItemSchema(sectionKey);
    if (!item || typeof item !== 'object') return defaultItemSchema;

    return deepMerge(defaultItemSchema, item);
}
