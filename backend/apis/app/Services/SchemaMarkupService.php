<?php

namespace App\Services;

class SchemaMarkupService
{
    public function forEntity(string $type, array $data): array
    {
        $base = ['@context' => 'https://schema.org', '@type' => $type];

        $typeSchema = match ($type) {
            'SoftwareApplication' => $this->softwareApplication($data),
            'Service'             => $this->service($data),
            'Article', 'BlogPosting', 'TechArticle' => $this->article($data),
            'FAQPage'             => $this->faqPage($data),
            'HowTo'               => $this->howTo($data),
            'ItemList'            => $this->itemList($data),
            'BreadcrumbList'      => $this->breadcrumbList($data),
            'WebSite'             => $this->website($data),
            'Organization'        => $this->organization($data),
            'WebPage'             => $this->webPage($data),
            'Product'             => $this->product($data),
            'Review'              => $this->review($data),
            default               => $this->generic($data),
        };

        return array_merge($base, $typeSchema);
    }

    // -------------------------------------------------------------------------
    // Schema type builders
    // -------------------------------------------------------------------------

    private function generic(array $data): array
    {
        return $this->compact([
            'name'        => $data['name'] ?? $data['title'] ?? null,
            'description' => $data['description'] ?? $data['summary'] ?? null,
            'url'         => $data['url'] ?? null,
            'image'       => $data['image'] ?? $data['image_url'] ?? null,
        ]);
    }

    private function softwareApplication(array $data): array
    {
        $schema = $this->compact([
            'name'                => $data['name'] ?? null,
            'description'         => $data['description'] ?? $data['overview'] ?? null,
            'url'                 => $data['url'] ?? $data['website_url'] ?? null,
            'image'               => $data['image'] ?? $data['logo_url'] ?? null,
            'applicationCategory' => $data['category'] ?? 'BusinessApplication',
            'operatingSystem'     => $data['os'] ?? 'Web',
        ]);

        if (! empty($data['pricing_model'])) {
            $schema['offers'] = array_filter([
                '@type'       => 'Offer',
                'price'       => $data['pricing_model'] === 'free' ? '0' : null,
                'description' => ucfirst((string) $data['pricing_model']),
                'priceCurrency' => $data['currency'] ?? 'USD',
            ]);
        } elseif (isset($data['price'])) {
            $schema['offers'] = [
                '@type'         => 'Offer',
                'price'         => $data['price'],
                'priceCurrency' => $data['currency'] ?? 'USD',
            ];
        }

        if (! empty($data['rating'])) {
            $schema['aggregateRating'] = [
                '@type'       => 'AggregateRating',
                'ratingValue' => $data['rating'],
                'reviewCount' => $data['review_count'] ?? 1,
                'bestRating'  => '5',
                'worstRating' => '1',
            ];
        }

        return $schema;
    }

    private function service(array $data): array
    {
        $schema = $this->compact([
            'name'        => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
            'url'         => $data['url'] ?? null,
            'image'       => $data['image'] ?? null,
            'areaServed'  => $data['area_served'] ?? null,
        ]);

        if (! empty($data['provider'])) {
            $schema['provider'] = $this->compact([
                '@type' => 'Organization',
                'name'  => $data['provider'],
                'url'   => $data['provider_url'] ?? null,
            ]);
        }

        if (isset($data['price'])) {
            $schema['offers'] = [
                '@type'         => 'Offer',
                'price'         => $data['price'],
                'priceCurrency' => $data['currency'] ?? 'USD',
            ];
        }

        return $schema;
    }

    private function article(array $data): array
    {
        $schema = $this->compact([
            'headline'      => $data['title'] ?? $data['name'] ?? null,
            'description'   => $data['description'] ?? $data['excerpt'] ?? null,
            'url'           => $data['url'] ?? null,
            'image'         => $data['image'] ?? $data['featured_image_url'] ?? null,
            'datePublished' => $data['published_at'] ?? null,
            'dateModified'  => $data['updated_at'] ?? $data['published_at'] ?? null,
        ]);

        if (! empty($data['author'])) {
            $schema['author'] = ['@type' => 'Person', 'name' => $data['author']];
        }

        if (! empty($data['publisher'])) {
            $schema['publisher'] = $this->compact([
                '@type' => 'Organization',
                'name'  => $data['publisher'],
                'logo'  => ! empty($data['publisher_logo']) ? ['@type' => 'ImageObject', 'url' => $data['publisher_logo']] : null,
            ]);
        }

        return $schema;
    }

    private function faqPage(array $data): array
    {
        if (empty($data['faqs']) || ! \is_array($data['faqs'])) {
            return [];
        }

        return [
            'mainEntity' => array_map(fn ($faq) => [
                '@type'          => 'Question',
                'name'           => $faq['question'] ?? $faq['name'] ?? '',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => $faq['answer'] ?? $faq['text'] ?? '',
                ],
            ], $data['faqs']),
        ];
    }

    private function howTo(array $data): array
    {
        $schema = $this->compact([
            'name'        => $data['name'] ?? $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'image'       => $data['image'] ?? null,
            'totalTime'   => $data['total_time'] ?? null,
        ]);

        if (! empty($data['cost'])) {
            $schema['estimatedCost'] = [
                '@type'    => 'MonetaryAmount',
                'currency' => $data['currency'] ?? 'USD',
                'value'    => $data['cost'],
            ];
        }

        if (! empty($data['steps']) && \is_array($data['steps'])) {
            $schema['step'] = array_values(array_map(fn ($step, $i) => $this->compact([
                '@type'    => 'HowToStep',
                'position' => $step['position'] ?? ($i + 1),
                'name'     => $step['name'] ?? $step['title'] ?? null,
                'text'     => $step['text'] ?? $step['description'] ?? null,
                'image'    => $step['image'] ?? null,
            ]), $data['steps'], array_keys($data['steps'])));
        }

        return $schema;
    }

    private function itemList(array $data): array
    {
        $schema = $this->compact([
            'name'        => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        $schema['itemListElement'] = ! empty($data['items']) && \is_array($data['items'])
            ? array_values(array_map(fn ($item, $i) => $this->compact([
                '@type'    => 'ListItem',
                'position' => $i + 1,
                'name'     => $item['name'] ?? null,
                'url'      => $item['url'] ?? null,
            ]), $data['items'], array_keys($data['items'])))
            : [];

        return $schema;
    }

    private function breadcrumbList(array $data): array
    {
        $crumbs = $data['breadcrumbs'] ?? [];

        return [
            'itemListElement' => \is_array($crumbs)
                ? array_values(array_map(fn ($crumb, $i) => $this->compact([
                    '@type'    => 'ListItem',
                    'position' => $i + 1,
                    'name'     => $crumb['name'] ?? $crumb['label'] ?? null,
                    'item'     => $crumb['url'] ?? $crumb['href'] ?? null,
                ]), $crumbs, array_keys($crumbs)))
                : [],
        ];
    }

    private function website(array $data): array
    {
        $schema = $this->compact([
            'name'        => $data['name'] ?? null,
            'url'         => $data['url'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        if (! empty($data['search_url'])) {
            $schema['potentialAction'] = [
                '@type'       => 'SearchAction',
                'target'      => ['@type' => 'EntryPoint', 'urlTemplate' => $data['search_url']],
                'query-input' => 'required name=search_term_string',
            ];
        }

        return $schema;
    }

    private function organization(array $data): array
    {
        $schema = $this->compact([
            'name'        => $data['name'] ?? null,
            'url'         => $data['url'] ?? null,
            'logo'        => $data['logo'] ?? null,
            'description' => $data['description'] ?? null,
            'email'       => $data['email'] ?? null,
            'telephone'   => $data['telephone'] ?? null,
        ]);

        if (! empty($data['address'])) {
            $schema['address'] = $this->compact([
                '@type'           => 'PostalAddress',
                'streetAddress'   => $data['address']['street'] ?? null,
                'addressLocality' => $data['address']['city'] ?? null,
                'addressRegion'   => $data['address']['state'] ?? null,
                'postalCode'      => $data['address']['zip'] ?? null,
                'addressCountry'  => $data['address']['country'] ?? null,
            ]);
        }

        if (! empty($data['social_links']) && \is_array($data['social_links'])) {
            $schema['sameAs'] = array_values($data['social_links']);
        }

        return $schema;
    }

    private function webPage(array $data): array
    {
        $schema = $this->compact([
            'name'          => $data['name'] ?? $data['title'] ?? null,
            'description'   => $data['description'] ?? null,
            'url'           => $data['url'] ?? null,
            'datePublished' => $data['published_at'] ?? null,
            'dateModified'  => $data['updated_at'] ?? null,
        ]);

        if (! empty($data['breadcrumbs'])) {
            $schema['breadcrumb'] = array_merge(
                ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList'],
                $this->breadcrumbList($data)
            );
        }

        return $schema;
    }

    private function product(array $data): array
    {
        $schema = $this->compact([
            'name'        => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
            'image'       => $data['image'] ?? null,
            'url'         => $data['url'] ?? null,
        ]);

        if (! empty($data['brand'])) {
            $schema['brand'] = ['@type' => 'Brand', 'name' => $data['brand']];
        }

        if (isset($data['price'])) {
            $schema['offers'] = $this->compact([
                '@type'         => 'Offer',
                'url'           => $data['url'] ?? null,
                'price'         => $data['price'],
                'priceCurrency' => $data['currency'] ?? 'USD',
                'availability'  => 'https://schema.org/InStock',
            ]);
        }

        if (! empty($data['rating'])) {
            $schema['aggregateRating'] = [
                '@type'       => 'AggregateRating',
                'ratingValue' => $data['rating'],
                'reviewCount' => $data['review_count'] ?? 1,
                'bestRating'  => '5',
                'worstRating' => '1',
            ];
        }

        return $schema;
    }

    private function review(array $data): array
    {
        $schema = $this->compact([
            'name'          => $data['name'] ?? $data['title'] ?? null,
            'reviewBody'    => $data['body'] ?? $data['content'] ?? null,
            'datePublished' => $data['published_at'] ?? null,
        ]);

        $schema['reviewRating'] = $this->compact([
            '@type'       => 'Rating',
            'ratingValue' => $data['rating'] ?? null,
            'bestRating'  => '5',
            'worstRating' => '1',
        ]);

        if (! empty($data['author'])) {
            $schema['author'] = ['@type' => 'Person', 'name' => $data['author']];
        }

        return $schema;
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /** Remove null values from a schema array (keeps falsy non-null like 0 or ''). */
    private function compact(array $schema): array
    {
        return array_filter($schema, fn ($v) => $v !== null);
    }
}
